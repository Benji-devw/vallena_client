# Vallena Client

Interface client pour la boutique en ligne Vallena, développée avec Next.js et TypeScript.

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Benji-devw/vallena_client.git
cd vallena_client

# Installer les dépendances
pnpm install

# Installer les types Node.js (pour résoudre les erreurs TypeScript)
pnpm install --save-dev @types/node
```

## 📦 Env file

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK=dev
```

## 📦 Scripts disponibles

```bash
# Démarrer le serveur de développement
pnpm run dev

# Compiler le projet
pnpm run build

# Démarrer le projet en production
pnpm run start

# Lancer les tests
pnpm run test

# Lancer les tests des services API uniquement
pnpm run test:services-api

# Lancer les tests des composants Home
pnpm run test:home
```

## 🧪 Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration.

### Exécution des tests

```bash
# Exécuter tous les tests
pnpm run test

# Exécuter uniquement les tests des services API
pnpm run test:services-api

# Exécuter les tests d'un composant spécifique
pnpm run test:home
```

### Data Structure

```json
{
  "products": [
    {
      "_id": "67890",
      "imgCollection": ["image1.jpg", "image2.jpg", "image3.jpg"],
      "titleProduct": "Product 1",
      "categoryProduct": "Category 1",
      "descriptionProduct": "Description 1",
      "size_fit": ["S", "M", "L"],
      "method": ["Method 1", "Method 2"],
      "priceProduct": 10,
      "sizeProduct": ["S", "M", "L"],
      "weightProduct": "100g",
      "quantityProduct": 10,
      "stockProduct": true,
      "promotionProduct": true,
      "reporterProduct": "Alice Johnson",
      "tags": "Tag 1, Tag 2",
      "matter": "Matter 1",
      "composition": "Composition 1",
      "fabrication": "Fabrication 1",
      "color": ["Red", "Blue", "Green"],
      "entretien": "Entretien 1",
      "novelty": true,
      "oldPriceProduct": 10,
      "displaySlideHome": true,
      "yearCollection": 2023,
      "visible": true,
      "notes": 5,
      "comments": []
    }
  ]
}
```

```json
{
  "comments": [
    {
      "orderNumber": "12345",
      "idProduct": "67890",
      "by": "Alice Johnson",
      "messageTitle": "Great Product!",
      "message": "I really enjoyed using this product. Highly recommend!",
      "note": "5",
      "dateBuy": "2023-10-01",
      "datePost": "2023-10-05",
      "status": true
    }
  ]
}
```

### Structure des tests

Les tests sont organisés selon une structure bien définie :

- `/src/__tests__/services_api/` : Tests des services d'API

  - `productService.getAllProducts.test.ts` : Tests pour getAllProducts
  - `productService.getProduct.test.ts` : Tests pour getProductById
  - `productService.getCategories.test.ts` : Tests pour getCategories
  - `productService.getMatters.test.ts` : Tests pour getMatters
  - `productService.getColors.test.ts` : Tests pour getColors
  - `productService.specialProducts.test.ts` : Tests pour getPromotionalProducts, getNewProducts, etc.

- `/src/__tests__/components/` : Tests des composants React

  - `Home.test.tsx` : Tests du composant Home

- `/src/__tests__/mocks/` : Mocks réutilisables
  - `apiMocks.ts` : Mocks pour les tests de l'API (produits, catégories, etc.)
  - `envMock.ts` : Variables d'environnement mockées pour les tests

### Bonnes pratiques

- Utilisez les mocks centralisés dans `/src/__tests__/mocks/` pour faciliter la maintenance
- Suivez l'organisation modulaire des tests pour une meilleure lisibilité
- Chaque fichier de test se concentre sur une fonctionnalité spécifique

## 📋 Structure du projet

```
src/
├── __tests__/                # Tests unitaires et d'intégration
│   ├── components/           # Tests des composants React
│   ├── mocks/                # Données mockées pour les tests
│   ├── services_api/         # Tests des services API
│   └── README.md             # Documentation des tests
├── assets/                   # Ressources statiques (images, etc.)
├── app/                      # Routes et pages de l'application (Next.js App Router)
├── components/               # Composants React réutilisables
│   ├── home/                 # Composants de la page d'accueil
│   ├── layout/               # Composants de mise en page (Header, Footer, etc.)
│   ├── products/             # Composants liés aux produits
│   └── shop/                 # Composants de la boutique
├── hooks/                    # Hooks React personnalisés
├── services/                 # Services et API
│   └── api/                  # Services d'API
└── types/                    # Définitions de types TypeScript
```

## 🛠️ Technologies utilisées

- **Next.js** - Framework React pour le rendu côté serveur et la génération de sites statiques
- **TypeScript** - Superset JavaScript avec typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Vitest** - Outil de test unitaire rapide
- **React Testing Library** - Bibliothèque de test pour les composants React
- **Axios** - Client HTTP pour les requêtes API

## 📝 Notes de développement

### API et filtres

- Le service API `productService.getAllProducts()` gère les filtres de base comme category, minPrice, maxPrice, etc.
- Les filtres spéciaux comme "promotions" ou "nouveautés" sont gérés dans le frontend via le paramètre `sort` dans l'URL (ex: `/shop?sort=promotions`)
- Navigation vers ces filtres spéciaux dans les composants : `router.push('/shop?sort=promotions')`

### Tests

- Les tests utilisent un mock centralisé pour les variables d'environnement dans `src/__tests__/mocks/envMock.ts`
- L'API est accessible via les services dans `src/services/api/`
- Les mocks pour les tests sont situés dans `src/__tests__/mocks/`

### Structure

- Le projet suit les conventions de nommage et de structure de Next.js App Router
- Les filtres d'API sont définis dans l'interface `ProductFilters`
- Le tri et les filtres spéciaux sont gérés dans le composant `SortBy`

## 🔄 Workflow GitHub

Le projet utilise GitHub Actions pour l'intégration continue.

### Configuration des workflows

Le workflow est défini dans le fichier `.github/workflows/nextjs.yml` et exécute actuellement uniquement les tests :

```yaml
# .github/workflows/nextjs.yml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Create .env.test file
        run: |
          echo "NEXT_PUBLIC_API_URL=http://localhost:8800/api" > .env.test
      - name: Run tests
        run: npm run test
```

Les jobs de build et de déploiement sont actuellement commentés et seront activés ultérieurement.

## 📋 TODO Liste

- [x] Mise en place de la structure du projet
- [x] Créer la page shop
- [x] Ajout des filtres des produits (catégorie, matière, couleur, prix)
- [x] Implémentation des tris spéciaux (promotions, nouveautés) via le frontend
- [x] Implémentation des tests unitaires de base
- [x] Tests complets des services API
- [ ] Création du système de pagination
- [x] Développement des composants de cartes produits
- [x] Configuration du système de tests avec Vitest
- [x] Configuration des workflows GitHub pour tests
- [ ] Implémenter la fonctionnalité de panier d'achat complète
- [ ] Ajouter l'authentification utilisateur
- [ ] Créer la page de profil utilisateur
- [ ] Implémenter le paiement en ligne
- [ ] Ajouter le filtre par tags dans la boutique
- [ ] Optimiser les images pour de meilleures performances
- [ ] Améliorer les tests pour atteindre une couverture de 80%
- [ ] Implémenter le mode sombre complet
- [ ] Ajouter le support multilingue (français, anglais)
- [ ] Créer une documentation API complète

## 👤 Auteur

### [navart.dev](https://navart.dev)
