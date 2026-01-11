# 🎓 Application de Gestion - Académie du Tourisme

Application web moderne pour la gestion des apprenants, formateurs, salles de cours et planning.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MariaDB](https://img.shields.io/badge/MariaDB-Ready-orange)

## ✨ Fonctionnalités

### 📅 Calendrier
- Vue calendrier annuel
- Création d'événements (cours, examens, événements)
- Association avec salles et formateurs
- Gestion des horaires

### 🚪 Gestion des salles
- Liste des salles disponibles
- Capacité et équipement
- CRUD complet (Créer, Lire, Modifier, Supprimer)

### 👥 Liste des apprenants et formateurs
- **Vue Kanban** avec cards
- **Filtres avancés** : rôle, groupe, TP
- **Recherche rapide** par nom, prénom, email
- **CRUD complet** pour les profils utilisateurs
- Champs profil : nom, prénom, email, rôle, groupe, dates, TP

### 🎨 Design
- Couleur principale : **#308dc2** (bleu Académie)
- Design moderne et responsive
- Zone logo en haut à gauche

## 🚀 Installation

### Prérequis
- Node.js 18+ installé
- MariaDB installé (optionnel, fonctionne aussi avec localStorage)

### Option 1 : Mode localStorage (Sans BDD)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm run dev

# L'application sera accessible sur http://localhost:5173
```

✅ Les données sont stockées dans le navigateur (localStorage)

### Option 2 : Mode MariaDB (Production)

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
# Créer une BDD MariaDB :
mysql -u root -p
CREATE DATABASE academie_tourisme;
exit;

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres BDD

# 4. Lancer le backend
npm run server
# Le serveur API démarre sur http://localhost:3001

# 5. Dans un autre terminal, lancer le frontend
npm run dev
# L'application sera accessible sur http://localhost:5173

# OU lancer les deux en même temps :
npm run dev:full
```

## ⚙️ Configuration BDD

### Fichier `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=academie_tourisme
PORT=3001
```

### Structure de la BDD

Les tables sont créées automatiquement au démarrage du serveur :

- **users** : Apprenants et formateurs
- **salles** : Salles de cours
- **events** : Événements du calendrier

## 📊 Structure d'un profil utilisateur

```javascript
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "role": "Apprenant", // ou "Formateur"
  "groupe": "VTF", // Groupes configurables
  "dateEntree": "2025-01-01",
  "dateSortie": "2025-12-31",
  "tp": "RHH" // RHH, RET, ALT, ou GH
}
```

## 🎯 Utilisation

### Ajouter un utilisateur

1. Cliquer sur "Ajouter un utilisateur"
2. Remplir le formulaire
3. Choisir le rôle (Apprenant ou Formateur)
4. Sélectionner un groupe et un TP
5. Définir les dates d'entrée et de sortie
6. Enregistrer

### Filtrer les utilisateurs

- **Recherche** : Tapez un nom, prénom ou email
- **Filtre par rôle** : Apprenants ou Formateurs
- **Filtre par groupe** : VTF, Héliades, AC, etc.
- **Filtre par TP** : RHH, RET, ALT, GH

### Gérer le calendrier

1. Naviguer dans le calendrier
2. Cliquer sur une date
3. Créer un événement (cours, examen, événement)
4. Associer une salle et un formateur
5. Enregistrer

### Gérer les salles

1. Ajouter une salle avec sa capacité
2. Définir l'équipement disponible
3. Modifier ou supprimer selon les besoins

## 📤 Import/Export

### Exporter les données

Cliquez sur "Exporter" dans le header pour télécharger toutes vos données en JSON.

### Importer des données

Cliquez sur "Importer" et sélectionnez un fichier JSON précédemment exporté.

## 🔧 Personnalisation

### Modifier les groupes disponibles

Éditez `src/components/UserModal.jsx` ligne ~35 :

```javascript
const groupesOptions = [
  'VOS_GROUPES',
  'ICI',
]
```

### Changer la couleur

La couleur principale (#308dc2) est définie dans `tailwind.config.js`.
Pour la modifier, changez les valeurs de `primary`.

### Ajouter un logo

Remplacez le texte dans `src/App.jsx` ligne ~61 par votre logo :

```jsx
<div className="w-48 h-12">
  <img src="/votre-logo.png" alt="Logo" className="h-full" />
</div>
```

## 🌐 Déploiement

### Sur Netlify

```bash
# 1. Build
npm run build

# 2. Déployez le dossier 'dist/' sur Netlify
# Ou connectez votre repo GitHub à Netlify
```

### Sur un serveur avec BDD

1. Configurez votre serveur MariaDB
2. Configurez les variables d'environnement
3. Lancez le backend : `npm run server`
4. Buildez le frontend : `npm run build`
5. Servez le dossier `dist/` avec nginx ou Apache

## 📁 Structure du projet

```
academie-app/
├── src/
│   ├── components/         # Composants React
│   │   ├── UserModal.jsx   # Modal utilisateur
│   │   ├── SalleModal.jsx  # Modal salle
│   │   └── EventModal.jsx  # Modal événement
│   ├── views/              # Vues principales
│   │   ├── ApprenantsView.jsx  # Vue Kanban
│   │   ├── CalendrierView.jsx  # Calendrier
│   │   └── SallesView.jsx      # Gestion salles
│   ├── services/
│   │   └── storage.js      # Gestion données
│   ├── App.jsx             # App principale
│   └── main.jsx            # Point d'entrée
├── server/
│   └── index.js            # API Node.js/MariaDB
├── package.json            # Dépendances
└── README.md              # Ce fichier
```

## 🛠️ Commandes

```bash
# Développement (localStorage)
npm run dev

# Développement (avec BDD)
npm run server          # Backend seul
npm run dev:full        # Frontend + Backend

# Production
npm run build           # Build pour production
npm run preview         # Prévisualiser le build
```

## 🔄 Migration de localStorage vers MariaDB

Si vous avez commencé avec localStorage et voulez migrer vers MariaDB :

1. Exportez vos données (bouton "Exporter")
2. Configurez MariaDB (voir instructions ci-dessus)
3. Lancez le backend `npm run server`
4. Importez vos données via l'interface

## 📞 Support

Pour toute question ou problème :
- Consultez ce README
- Vérifiez les logs du serveur
- Testez en mode localStorage d'abord

## 🎨 Captures d'écran

### Vue Kanban
- Apprenants et formateurs séparés en colonnes
- Cards avec nom, email, groupe, TP
- Actions rapides (éditer, supprimer)

### Calendrier
- Vue mensuelle
- Code couleur par type d'événement
- Création rapide d'événements

### Gestion des salles
- Grille de cards
- Capacité et équipement visibles
- Modification facile

## 📄 License

Application développée pour l'Académie du Tourisme.

---

Développé avec ❤️ pour l'Académie du Tourisme
Technologies : React + Vite + Tailwind CSS + Node.js + MariaDB
