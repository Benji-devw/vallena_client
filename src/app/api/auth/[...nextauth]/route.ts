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

          const user = await res.json(); // 'user' contient la réponse de votre API, ex: { id, email, name, token }

          if (user && user.token) {
            // NextAuth attend un objet utilisateur conforme. Votre API doit renvoyer id, email, name, et le token peut être attaché.
            return user; // L'objet utilisateur complet, y compris le token, sera passé au callback jwt.
          } else {
            console.log("Utilisateur non trouvé ou token manquant après connexion par credentials");
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
            picture: profile?.picture,
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
          const responseText = await res.text(); // Lire le texte pour le log, même si ce n'est pas JSON
          console.log("[NextAuth signIn callback - Google] Réponse brute du Backend - Texte:", responseText);

          if (!res.ok) {
            console.error("[NextAuth signIn callback - Google] Erreur API Backend! Statut:", res.status, "Réponse:", responseText);
            return false;
          }
          
          // Tenter de parser en JSON seulement si res.ok et qu'on s'attend à du JSON
          let backendUser;
          try {
            backendUser = JSON.parse(responseText); 
          } catch (e) {
            console.error("[NextAuth signIn callback - Google] Erreur parsing JSON de la réponse Backend:", e, "Réponse texte était:", responseText);
            return false;
          }

          if (backendUser && backendUser.token) {
            console.log("[NextAuth signIn callback - Google] Succès! Token reçu du Backend pour:", backendUser.email);
            (user as any).token = backendUser.token; 
            (user as any).id = backendUser.id || user.id;
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
      console.log("[NextAuth signIn callback] Fin pour provider (non-Google ou autre):", account?.provider);
      return true; 
    },
    async jwt({ token, user, account }) {
      // `user` est l'objet retourné par `authorize` (pour credentials) ou enrichi dans `signIn` (pour Google).
      if (user) { // Ce bloc est exécuté lors de la connexion initiale
        token.accessToken = (user as any).token; // Token de notre API
        token.id = (user as any).id || user.id; // ID de notre API
        // Ajoutez d'autres propriétés de `user` au `token` si nécessaire
        // token.name = user.name;
        // token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Le `token` ici est celui retourné par le callback `jwt`.
      // Nous transférons les infos du `token` vers l'objet `session.user`.
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).accessToken = token.accessToken as string;
        // Assurez-vous que les types correspondent à ce que vous avez défini dans `next-auth.d.ts` si vous en utilisez un.
        // session.user.name = token.name as string; 
        // session.user.email = token.email as string;
      }
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
