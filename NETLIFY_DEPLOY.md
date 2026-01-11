# 🌐 Guide de Déploiement sur Netlify

## ✅ Oui, vous pouvez déployer MAINTENANT !

L'application est **100% prête** pour Netlify. Elle fonctionnera en mode **localStorage** (les données seront stockées dans le navigateur de chaque utilisateur).

---

## 🚀 Déploiement en 3 étapes

### Méthode 1 : Depuis GitHub (Recommandé)

#### 1️⃣ Pousser sur GitHub

Si ce n'est pas déjà fait :

```bash
cd academie-app
git init
git add .
git commit -m "Application Académie du Tourisme"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/academie-app.git
git push -u origin main
```

#### 2️⃣ Connecter à Netlify

1. Allez sur https://app.netlify.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **GitHub**
4. Sélectionnez votre repository `academie-app`
5. Netlify détecte automatiquement la config (grâce à `netlify.toml`)
   - Build command: `npm run build` ✅
   - Publish directory: `dist` ✅
6. Cliquez sur **"Deploy site"**

#### 3️⃣ C'est en ligne ! 🎉

Votre site sera accessible sur : `https://random-name.netlify.app`

Vous pourrez personnaliser le nom dans les paramètres Netlify.

---

### Méthode 2 : Netlify Drop (Ultra rapide)

Si vous voulez juste tester rapidement :

```bash
# 1. Build en local
cd academie-app
npm install
npm run build

# 2. Allez sur https://app.netlify.com/drop

# 3. Glissez-déposez le dossier 'dist/'
```

✅ Votre site est en ligne instantanément !

---

## 📊 Ce qui fonctionnera sur Netlify

### ✅ Fonctionne parfaitement
- Interface complète (navigation, vues, design)
- Ajout/Édition/Suppression d'utilisateurs
- Vue Kanban avec cards
- Recherche et filtres
- Gestion des salles
- Calendrier avec événements
- Import/Export des données (JSON)
- **Stockage en localStorage** (dans le navigateur)

### ⚠️ Limitations du mode localStorage
- Données par navigateur/appareil (si vous changez de navigateur, les données ne suivent pas)
- Pas de synchronisation multi-utilisateurs
- Si vous videz le cache du navigateur, les données sont perdues

**Solution** : Utilisez la fonction Export régulièrement pour sauvegarder vos données !

---

## 🗄️ Pour activer le mode MariaDB plus tard

Le mode localStorage est parfait pour :
- ✅ Tester l'application
- ✅ Usage personnel
- ✅ Petites équipes

Si vous voulez la **persistance avec BDD** :

1. Hébergez le backend sur un serveur (VPS, Heroku, Railway, etc.)
2. Configurez MariaDB
3. Modifiez les appels API dans le code pour pointer vers votre backend

Pour l'instant, **localStorage suffit largement** pour tester et utiliser l'app !

---

## 🎨 Personnalisation après déploiement

### Changer le nom du site

1. Dans Netlify → Site settings
2. Site details → Change site name
3. Exemple : `academie-tourisme.netlify.app`

### Ajouter un domaine personnalisé

1. Dans Netlify → Domain management
2. Add custom domain
3. Suivez les instructions DNS

---

## 🔄 Mises à jour

Chaque fois que vous poussez sur GitHub :

```bash
git add .
git commit -m "Mise à jour"
git push
```

Netlify **redéploie automatiquement** ! ✨

---

## 📱 Test de l'application

Une fois déployée, testez :

1. ✅ Ajouter un utilisateur (Apprenant)
2. ✅ Ajouter un utilisateur (Formateur)
3. ✅ Les voir dans la vue Kanban
4. ✅ Filtrer par rôle/groupe
5. ✅ Ajouter une salle
6. ✅ Créer un événement au calendrier
7. ✅ Exporter les données
8. ✅ Importer les données

---

## ❓ Problèmes fréquents

### Le build échoue sur Netlify

Vérifiez les logs de build. Souvent c'est un problème de dépendances.

**Solution** :
```bash
# En local, testez le build
npm install
npm run build
```

Si ça marche en local, ça marchera sur Netlify.

### Les données disparaissent

Normal avec localStorage ! Utilisez **Export** pour sauvegarder.

### Je veux plusieurs utilisateurs avec les mêmes données

→ Il faut passer au mode MariaDB (backend nécessaire)

---

## 🎯 Résumé

| Fonctionnalité | Netlify (localStorage) | Avec Backend MariaDB |
|----------------|------------------------|----------------------|
| Interface complète | ✅ | ✅ |
| CRUD utilisateurs | ✅ | ✅ |
| Calendrier | ✅ | ✅ |
| Gestion salles | ✅ | ✅ |
| Recherche/Filtres | ✅ | ✅ |
| Multi-utilisateurs | ❌ (données locales) | ✅ |
| Persistance garantie | ⚠️ (cache navigateur) | ✅ |
| Synchronisation | ❌ | ✅ |
| Déploiement | ✅ Gratuit et simple | ⚙️ Configuration requise |

---

## 🚀 Go !

**Vous êtes prêt à déployer !**

1. Poussez sur GitHub
2. Connectez à Netlify
3. Déployez
4. Partagez le lien avec votre équipe

L'application est **100% fonctionnelle** en mode localStorage sur Netlify ! 🎉

---

**Questions ?** Consultez les logs de build sur Netlify si besoin.
