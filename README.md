# Vallena Client

Interface client pour la boutique en ligne Vallena, développée avec Next.js et TypeScript.

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Benji-devw/vallena_client.git
cd vallena_client

# Installer les dépendances
npm install

# Installer les types Node.js (pour résoudre les erreurs TypeScript)
npm install --save-dev @types/node
```


## 📦 Env file

```bash

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```


## 📦 Scripts disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler le projet
npm run build

# Démarrer le projet en production
npm run start

# Lancer les tests
npm run test

# Lancer les tests des services API uniquement
npm run test:services-api

# Lancer les tests des composants Home
npm run test:home
```

## 🧪 Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration.

### Exécution des tests

```bash
# Exécuter tous les tests
npm run test

# Exécuter uniquement les tests des services API
npm run test:services-api

# Exécuter les tests d'un composant spécifique
npm run test:home
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
    branches: ["main"]
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
          node-version: "20"
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

- [X] Mise en place de la structure du projet
- [X] Créer la page shop
- [X] Ajout des filtres des produits (catégorie, matière, couleur, prix)
- [X] Implémentation des tris spéciaux (promotions, nouveautés) via le frontend
- [X] Implémentation des tests unitaires de base
- [X] Tests complets des services API
- [ ] Création du système de pagination
- [X] Développement des composants de cartes produits
- [X] Configuration du système de tests avec Vitest
- [X] Configuration des workflows GitHub pour tests
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