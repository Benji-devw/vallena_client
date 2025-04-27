# Tests Unitaires

Ce répertoire contient les tests unitaires pour l'application Vallena Client.

## Structure des tests

Les tests sont organisés de la manière suivante:

- `/services_api`: Tests des services d'API (productService, etc.)
- `/mocks`: Mocks réutilisables pour les tests

## Variables d'environnement

Les tests utilisent un mock centralisé pour les variables d'environnement, défini dans `src/__tests__/mocks/envMock.ts`.

```typescript
// src/__tests__/mocks/envMock.ts
export const ENV = {
  NEXT_PUBLIC_API_URL: 'http://localhost:8800/api'
};
```

Cette approche permet de contourner les problèmes liés au chargement des variables d'environnement dans Vitest et assure que tous les tests utilisent les mêmes valeurs.

## Exécution des tests

Pour exécuter tous les tests:

```bash
npm test
```

Pour exécuter uniquement les tests des services API:

```bash
npm run test:services-api
```

## Mocks

Les mocks sont centralisés dans le répertoire `/mocks` pour faciliter leur réutilisation à travers les différents tests.

### apiMocks.ts

Ce fichier contient les mocks pour les tests des services API, notamment:
- `createMockProduct`: Fonction utilitaire pour créer des mocks de produits
- `mockProducts`: Collection de produits mockés pour différents cas de test
- `mockFilters`: Collection de filtres mockés pour tester différentes combinaisons
- `mockCategories`: Mocks des catégories
- `mockMatters`: Mocks des matières
- `mockColors`: Mocks des couleurs

### envMock.ts

Ce fichier contient les variables d'environnement mockées pour les tests.

## Organisation des tests de productService

Les tests du service de produits sont séparés en plusieurs fichiers pour une meilleure organisation:

- `productService.getAllProducts.test.ts`: Tests de la méthode getAllProducts avec différentes combinaisons de filtres
- `productService.getProduct.test.ts`: Tests de la méthode getProductById
- `productService.getCategories.test.ts`: Tests de la méthode getCategories
- `productService.getMatters.test.ts`: Tests de la méthode getMatters
- `productService.getColors.test.ts`: Tests de la méthode getColors
- `productService.specialProducts.test.ts`: Tests des méthodes getPromotionalProducts, getNewProducts et searchProducts 