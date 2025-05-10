import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
// import type { NextAuthConfig } from 'next-auth'; // Le type exact peut varier avec les versions beta

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Variables d\'environnement GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET manquantes');
}
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  // Auth.js v5 préfère AUTH_SECRET, mais vérifions les deux pour la transition.
  throw new Error('Variable d\'environnement NEXTAUTH_SECRET ou AUTH_SECRET manquante');
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  // trustHost: true, // Décommentez si vous déployez sur des plateformes comme Vercel/Netlify
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Email ou mot de passe manquant dans les credentials");
          return null;
        }

        try {
          const res = await fetch('http://localhost:8805/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("API login error (Credentials):", res.status, errorText);
            return null;
          }

          const apiResponse = await res.json(); // { token, user: { _id, email, firstName, lastName, ... } }

          if (apiResponse && apiResponse.token && apiResponse.user) {
            // Retourner un objet plat que NextAuth peut utiliser pour peupler le 'user' du callback jwt
            return {
              id: apiResponse.user._id,
              email: apiResponse.user.email,
              name: `${apiResponse.user.firstName} ${apiResponse.user.lastName}`,
              firstName: apiResponse.user.firstName,
              lastName: apiResponse.user.lastName,
              username: apiResponse.user.username,
              picture: apiResponse.user.picture || null,
              roles: apiResponse.user.roles || ['user'],
              token: apiResponse.token,
            };
          } else {
            console.log("Utilisateur non trouvé ou token/user manquant après connexion par credentials API");
            return null;
          }
        } catch (error) {
          console.error('Erreur interne lors de la connexion (authorize):', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[NextAuth signIn callback] Début pour provider:", account?.provider);
      if (account?.provider === 'google') {
        console.log("[NextAuth signIn callback - Google] Tentative de connexion Backend pour:", user.email);
        try {
          const body = {
            email: user.email,
            name: user.name,
            googleId: user.id,
            picture: user.image,
          };
          console.log("[NextAuth signIn callback - Google] Corps de la requête Backend:", JSON.stringify(body));

          const res = await fetch('http://localhost:8805/user/google-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          console.log("[NextAuth signIn callback - Google] Réponse brute du Backend - Statut:", res.status);
          const responseText = await res.text(); 
          console.log("[NextAuth signIn callback - Google] Réponse brute du Backend - Texte:", responseText);

          if (!res.ok) {
            console.error("[NextAuth signIn callback - Google] Erreur API Backend! Statut:", res.status, "Réponse:", responseText);
            return false;
          }
          
          let backendUser;
          try {
            backendUser = JSON.parse(responseText); 
          } catch (e) {
            console.error("[NextAuth signIn callback - Google] Erreur parsing JSON de la réponse Backend:", e, "Réponse texte était:", responseText);
            return false;
          }

          if (backendUser && backendUser.token && backendUser.user) {
            console.log("[NextAuth signIn callback - Google] Succès! Token reçu du Backend pour:", backendUser.user?.email || user.email);
            // Enrichir l'objet user original de NextAuth avec le token et l'ID de notre backend
            (user as any).token = backendUser.token; 
            (user as any).id = backendUser.user._id;
            (user as any).username = backendUser.user.username;
            (user as any).firstName = backendUser.user.firstName;
            (user as any).lastName = backendUser.user.lastName;
            (user as any).roles = backendUser.user.roles || ['user'];
            return true;
          } else {
            console.log("[NextAuth signIn callback - Google] Token manquant ou utilisateur non valide du Backend. Réponse parsée:", backendUser);
            return false;
          }
        } catch (error) {
          console.error('[NextAuth signIn callback - Google] Exception dans le try...catch:', error);
          return false;
        }
      }
      console.log("[NextAuth signIn callback] Fin pour provider (non-Google ou autre):", account?.provider, "User object:", user);
      return true; 
    },
    async jwt({ token, user, account }) {
      console.log("[NextAuth jwt callback] User object reçu:", user);
      console.log("[NextAuth jwt callback] Account object reçu:", account);
      if (user) { // user est l'objet retourné par authorize ou enrichi par signIn (pour Google)
        token.id = user.id; 
        token.accessToken = (user as any).token; 
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || (user as any).picture; 

        // Champs personnalisés
        token.username = (user as any).username;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.roles = (user as any).roles || ['user'];
      }
      console.log("[NextAuth jwt callback] Token retourné:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth session callback] Token reçu:", token);
      if (session.user) {
        session.user.id = token.id as string | undefined || '';
        session.user.accessToken = token.accessToken as string | undefined;
        session.user.name = token.name as string | undefined || '';
        session.user.email = token.email as string | undefined || '';
        session.user.image = token.picture as string | undefined; 
        
        // Champs personnalisés
        // @ts-ignore
        session.user.username = token.username as string | undefined;
        // @ts-ignore
        session.user.firstName = token.firstName as string | undefined;
        // @ts-ignore
        session.user.lastName = token.lastName as string | undefined;
        // @ts-ignore
        session.user.roles = token.roles as string[] | undefined || ['user'];
      }
      console.log("[NextAuth session callback] Session retournée:", session);
      return session;
    },
  },
  pages: {
    signIn: '/auth', 
    error: '/auth',  // Les erreurs redirigent vers /auth pour affichage
  },
  session: {
    strategy: 'jwt',
    // maxAge: 30 * 24 * 60 * 60, // 30 jours (Optionnel, v5 a des valeurs par défaut)
  },
  // Utilisez AUTH_SECRET dans votre .env.local pour NextAuth.js v5
  // secret: process.env.NEXTAUTH_SECRET, // Peut être omis si AUTH_SECRET est défini
  debug: process.env.NODE_ENV === 'development',
});
