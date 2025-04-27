# Vallena Client

Interface client pour la boutique en ligne Vallena, développée avec Next.js et TypeScript.

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-nom/vallena_client.git
cd vallena_client

# Installer les dépendances
npm install

# Installer les types Node.js (pour résoudre les erreurs TypeScript)
npm install --save-dev @types/node
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

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec l'interface utilisateur
npm run test:ui

# Générer la couverture de tests
npm run test:coverage
```

## 🧪 Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration. Pour exécuter les tests :

```bash
# Exécuter tous les tests
npm run test

# Exécuter un fichier de test spécifique
npm run test src/__tests__/components/shop/ProductCard.test.tsx
```

## 📋 Structure du projet

```
src/
├── app/                  # Routes et pages de l'application (Next.js App Router)
├── components/           # Composants React réutilisables
│   ├── home/             # Composants de la page d'accueil
│   ├── layout/           # Composants de mise en page (Header, Footer, etc.)
│   ├── products/         # Composants liés aux produits
│   └── shop/             # Composants de la boutique
├── services/             # Services et API
│   └── api/              # Services d'API
└── __tests__/            # Tests unitaires et d'intégration
    ├── app/              # Tests des pages
    ├── components/       # Tests des composants
    ├── mocks/            # Données mockées pour les tests
    └── utils/            # Utilitaires pour les tests
```

## 🛠️ Technologies utilisées

- **Next.js** - Framework React pour le rendu côté serveur et la génération de sites statiques
- **TypeScript** - Superset JavaScript avec typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Vitest** - Outil de test unitaire rapide
- **React Testing Library** - Bibliothèque de test pour les composants React

## 📝 Notes de développement

- Utilisez les attributs `data-testid` pour les tests au lieu de sélectionner les éléments par texte
- Les mocks pour les tests sont situés dans `src/__tests__/mocks/`
- Le projet suit les conventions de nommage et de structure de Next.js App Router

## 🔄 Workflow GitHub

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement continu.

### Configuration des workflows

Les workflows sont définis dans le répertoire `.github/workflows/`:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run test
```

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to production
        uses: some-deployment-action@v1
        with:
          # Configuration de déploiement
          api_token: ${{ secrets.DEPLOY_TOKEN }}
          # Autres paramètres...
```

### Comment utiliser

1. Créez les fichiers de workflow dans `.github/workflows/`
2. Pour les déploiements, ajoutez les secrets nécessaires dans les paramètres du repository GitHub
3. Les tests s'exécuteront automatiquement à chaque push et pull request
4. Le déploiement se fera automatiquement lors des push sur la branche principale

## 📋 TODO Liste

- [X] Mise en place de la structure du projet
- [X] Créer la page shop
- [X] Ajout des filtres des produits (catégorie, matière, couleur, prix)
- [X] Implémentation des tests unitaires de base
- [ ] Création du système de pagination
- [X] Développement des composants de cartes produits
- [X] Configuration du système de tests avec Vitest
- [X] Configuration des workflows GitHub pour tests et déploiement
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
