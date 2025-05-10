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
      username?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      roles?: string[] | null; // Tableau de rôles
      picture?: string | null;
      phone?: string | null;
      country?: string | null;
      bio?: string | null;
    } & DefaultSession['user'];
    accessToken?: string | null; // Répété ici pour accès direct via session.accessToken si besoin
    // @ts-ignore TODO: Vérifier si cette ligne est encore utile avec la structure user ci-dessus
    roles?: string[] | null; 
  }

  /**
   * The shape of the user object returned in the OAuth providers' \`profile\` callback,
   * or the second parameter of the \`session\` callback, when using a database.
   */
  interface User extends DefaultUser {
    id?: string; // L'ID de ta base de données
    accessToken?: string; // Peut être utile de l'avoir aussi sur l'objet User initial
    firstName?: string;
    lastName?: string;
    username?: string;
    roles?: string[]; // Tableau de rôles
    picture?: string | null; // Assurons-nous que picture est bien là aussi
    phone?: string | null;
    country?: string | null;
    bio?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the \`jwt\` callback and sent to the \`session\` callback */
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    username?: string;
    firstName?: string; 
    lastName?: string; 
    roles?: string[]; // Tableau de rôles
    picture?: string | null; // Assurons-nous que picture est bien là aussi
    phone?: string | null;
    country?: string | null;
    bio?: string | null;
  }
} 