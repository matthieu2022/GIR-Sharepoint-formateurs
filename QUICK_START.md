# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### 1️⃣ Installer Node.js

Si pas déjà installé, téléchargez Node.js depuis : https://nodejs.org/
Version recommandée : 18 ou supérieure

### 2️⃣ Installer et lancer l'application

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur sur `http://localhost:5173`

### 3️⃣ Déployer sur GitHub + Netlify

#### Sur GitHub :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - SharePoint Manager"

# Connecter à votre repository GitHub
# (créez d'abord un repo sur github.com)
git remote add origin https://github.com/VOTRE_USERNAME/sharepoint-manager.git

# Pousser le code
git push -u origin main
```

#### Sur Netlify :

**Option 1 : Via l'interface (Recommandé)**

1. Allez sur https://app.netlify.com
2. Cliquez sur "Add new site" → "Import an existing project"
3. Choisissez GitHub et sélectionnez votre repository
4. Netlify détectera automatiquement la configuration
5. Cliquez sur "Deploy site"
6. Votre site sera en ligne en quelques minutes ! 🎉

**Option 2 : Glisser-Déposer (Plus rapide pour tester)**

1. Lancez `npm run build` dans votre terminal
2. Allez sur https://app.netlify.com/drop
3. Glissez-déposez le dossier `dist/` créé
4. Votre site est en ligne immédiatement ! ⚡

## 📝 Personnalisation des données

### Option 1 : Via l'interface

1. Lancez l'application
2. Utilisez le bouton "Importer" pour charger vos données JSON
3. Ou modifiez directement dans l'interface
4. Exportez avec le bouton "Exporter"

### Option 2 : Modifier le fichier JSON

Éditez `src/data/initialData.json` avec vos données.

Structure :
```json
{
  "formateurs": [
    {
      "id": "F001",
      "nom": "Nom Prénom",
      "email": "email@academie.fr",
      "formation": "RHH",
      "lms_actif": "ok",
      "acces_sharepoint": [
        {
          "site": "Nom du site",
          "date_entree": "2025-01-01",
          "date_sortie": "2025-12-31"
        }
      ]
    }
  ],
  "apprenants": [...],
  "sites": [...]
}
```

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Lance le serveur de développement

# Production
npm run build            # Crée une version optimisée
npm run preview          # Prévisualise la version de production

# Déploiement
./deploy.sh              # Script automatique de build + infos déploiement
```

## ❓ Problèmes courants

### "npm not found"
→ Installez Node.js depuis nodejs.org

### Erreur lors de npm install
→ Essayez : `npm cache clean --force` puis `npm install`

### Port 5173 déjà utilisé
→ L'application utilisera automatiquement un autre port (5174, 5175, etc.)

### Erreur de build
→ Vérifiez que toutes les dépendances sont installées : `npm install`

## 📞 Support

Pour toute question :
- Consultez le README.md complet
- Créez une issue sur GitHub
- Contactez l'équipe IT

---

Bon développement ! 🎉
