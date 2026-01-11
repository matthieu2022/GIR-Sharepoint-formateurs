# 📚 SharePoint Access Manager - Académie du Tourisme

Application web moderne pour gérer les accès SharePoint des formateurs et apprenants de l'Académie du Tourisme.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)

## ✨ Fonctionnalités

- 📊 **Tableau de bord** avec statistiques en temps réel
- 👥 **Gestion des formateurs** avec leurs multiples accès SharePoint
- 🎓 **Gestion des apprenants** organisés par groupes (VTF, Héliades, AC, Belambra, ECG)
- 🌐 **Gestion des sites SharePoint** avec suivi des membres
- 🔍 **Recherche globale** et filtres avancés
- 📥 **Import/Export** des données en JSON
- ⚡ **Interface réactive** et moderne
- 🎨 **Design professionnel** avec Tailwind CSS

## 🚀 Installation

### Prérequis

- Node.js 18+ installé
- npm ou yarn

### Étapes

```bash
# 1. Cloner le repository
git clone <votre-repo-github>
cd sharepoint-manager

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev

# 4. Ouvrir dans le navigateur
# L'application sera accessible sur http://localhost:5173
```

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## 🌐 Déploiement sur Netlify

### Via l'interface Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre repository GitHub
4. Netlify détectera automatiquement la configuration grâce au fichier `netlify.toml`
5. Cliquez sur "Deploy"

### Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

## 📂 Structure du projet

```
sharepoint-manager/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Tableau de bord
│   │   ├── FormateursView.jsx     # Gestion formateurs
│   │   ├── ApprenantsView.jsx     # Gestion apprenants
│   │   └── SitesView.jsx          # Gestion sites SharePoint
│   ├── data/
│   │   └── initialData.json       # Données initiales
│   ├── App.jsx                    # Composant principal
│   ├── main.jsx                   # Point d'entrée
│   └── index.css                  # Styles globaux
├── public/                        # Assets statiques
├── index.html                     # Template HTML
├── vite.config.js                 # Configuration Vite
├── tailwind.config.js             # Configuration Tailwind
├── netlify.toml                   # Configuration Netlify
└── package.json                   # Dépendances
```

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `tailwind.config.js` pour personnaliser le thème :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs personnalisées
      }
    }
  }
}
```

### Ajouter des données

Les données sont stockées dans `src/data/initialData.json`. Vous pouvez :

1. Modifier directement ce fichier
2. Utiliser la fonction Import dans l'application
3. Exporter les données modifiées avec le bouton Export

## 🔧 Technologies utilisées

- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes
- **date-fns** - Manipulation des dates

## 📊 Données

### Format des données

Les données sont au format JSON avec trois collections principales :

```json
{
  "formateurs": [...],
  "apprenants": [...],
  "sites": [...],
  "metadata": {
    "derniere_mise_a_jour": "...",
    "nombre_formateurs": 15,
    "nombre_apprenants": 78,
    "nombre_sites": 14
  }
}
```

### Import depuis Excel

Pour convertir votre fichier Excel existant :

```bash
# Le script Python fourni permet de convertir l'Excel en JSON
python convert_excel_to_json.py votre_fichier.xlsx
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est développé pour l'Académie du Tourisme.

## 🆘 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe IT de l'Académie du Tourisme

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Synchronisation avec SharePoint API
- [ ] Notifications pour les accès expirants
- [ ] Export Excel
- [ ] Mode sombre
- [ ] Application mobile (React Native)

---

Développé avec ❤️ pour l'Académie du Tourisme
