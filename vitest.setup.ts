import { config } from 'dotenv';
import { beforeAll } from 'vitest';

// Chargement des variables d'environnement avant l'exécution des tests
beforeAll(() => {
  config({ path: '.env.test' });
  
  // On vérifie que les variables d'environnement sont bien chargées
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn('⚠️ Variables d\'environnement non chargées. Vérifiez le fichier .env.test');
    // On définit une valeur par défaut pour les tests
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8800/api';
  }
}); 