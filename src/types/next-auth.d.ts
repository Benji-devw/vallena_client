import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by \`useSession\`, \`getSession\` and received as a prop on the \`SessionProvider\` React Context
   */
  interface Session {
    user?: {
      id?: string | null; // L'ID de ta base de données
      accessToken?: string | null; // Ton token d'API personnalisé
    } & DefaultSession['user'];
    accessToken?: string | null; // Répété ici pour accès direct via session.accessToken si besoin
  }

  /**
   * The shape of the user object returned in the OAuth providers' \`profile\` callback,
   * or the second parameter of the \`session\` callback, when using a database.
   */
  interface User extends DefaultUser {
    id?: string; // L'ID de ta base de données
    accessToken?: string; // Peut être utile de l'avoir aussi sur l'objet User initial
    // Ajoute d'autres champs personnalisés que tu récupères de ton API/authorize ici
    // par exemple: firstName?: string; lastName?: string; username?: string; role?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the \`jwt\` callback and sent to the \`session\` callback */
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    // Ajoute d'autres champs personnalisés que tu stockes dans le token JWT ici
    // par exemple: role?: string; username?: string;
  }
} 