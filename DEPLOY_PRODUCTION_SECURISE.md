# 🚀 Déploiement Backend sur Serveur de Production
## Guide Sécurisé - academie-tourisme.fr

---

## 📋 AVANT DE COMMENCER - Checklist Sécurité

### 1. Vérifications préalables

```bash
# 1. Vérifier la structure actuelle
cd /var/www/vhosts/academie-tourisme.fr
ls -la

# 2. Vérifier Node.js installé
node --version
npm --version

# 3. Vérifier l'utilisateur actuel
whoami

# 4. Vérifier les permissions
ls -la /var/www/vhosts/academie-tourisme.fr
```

**Notes importantes** :
- ✅ Ne touchez PAS aux dossiers existants (httpdocs, httpsdocs, etc.)
- ✅ Le backend sera isolé dans son propre dossier
- ✅ On ne modifie RIEN qui existe déjà

---

## 🗂️ ÉTAPE 1 : Structure recommandée

```
/var/www/vhosts/academie-tourisme.fr/
├── httpdocs/              ← VOTRE SITE ACTUEL (NE PAS TOUCHER)
├── private/               ← Dossier privé (si existe)
├── logs/                  ← Logs (si existe)
└── api/                   ← NOUVEAU DOSSIER BACKEND (À CRÉER)
    ├── server/
    │   └── index.js
    ├── package.json
    ├── .env
    ├── .gitignore
    ├── logs/
    └── node_modules/
```

---

## 🔧 ÉTAPE 2 : Vérifier les prérequis système

### A. Node.js et npm

```bash
# Vérifier Node.js
node --version
# Doit afficher : v18.x ou supérieur

# Si Node.js n'est pas installé ou version trop ancienne
# Sur Plesk, vous pouvez installer via :
# - Extension Node.js dans Plesk
# - Ou installer manuellement avec nvm
```

### B. Droits d'accès

```bash
# Vérifier qui vous êtes
whoami

# Vérifier les permissions du dossier parent
ls -ld /var/www/vhosts/academie-tourisme.fr

# Vous devriez être propriétaire ou avoir les droits d'écriture
```

---

## 📦 ÉTAPE 3 : Créer le dossier backend (SÉCURISÉ)

```bash
# 1. Aller dans le dossier vhost
cd /var/www/vhosts/academie-tourisme.fr

# 2. Créer le dossier api
mkdir -p api

# 3. Vérifier que c'est créé
ls -la | grep api

# 4. Aller dans le nouveau dossier
cd api

# 5. Vérifier où on est
pwd
# Doit afficher : /var/www/vhosts/academie-tourisme.fr/api
```

---

## 📁 ÉTAPE 4 : Transférer les fichiers backend

### Option A : Via FTP/SFTP (RECOMMANDÉ pour la prod)

1. Ouvrez FileZilla ou votre client FTP
2. Connectez-vous à votre serveur
3. Naviguez vers `/var/www/vhosts/academie-tourisme.fr/api`
4. Téléversez ces fichiers depuis votre archive :
   ```
   - server/index.js
   - package.json
   - .env
   - .gitignore
   ```

### Option B : Via Git (si vous préférez)

```bash
cd /var/www/vhosts/academie-tourisme.fr/api

# Cloner seulement le dossier backend depuis GitHub
# (si vous l'avez séparé dans un repo)
```

### Option C : Copie manuelle des fichiers

```bash
# Si vous avez les fichiers localement via SSH
cd /var/www/vhosts/academie-tourisme.fr/api

# Créer les fichiers nécessaires (voir ci-dessous)
```

---

## 📝 ÉTAPE 5 : Créer les fichiers essentiels

### 1. Créer package.json

```bash
cd /var/www/vhosts/academie-tourisme.fr/api
nano package.json
```

Collez ce contenu :
```json
{
  "name": "academie-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/index.js",
    "dev": "node --watch server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1"
  }
}
```

Sauvegardez : `Ctrl+X` → `Y` → `Enter`

### 2. Créer le dossier server

```bash
mkdir -p server
```

### 3. Créer server/index.js

```bash
nano server/index.js
```

Je vous donne le contenu dans le fichier suivant.

### 4. Créer le fichier .env

```bash
nano .env
```

Contenu :
```env
DB_HOST=localhost
DB_USER=admin_gestion_gir
DB_PASSWORD=Neosphere2021*
DB_NAME=admin_gestion_gir
PORT=3001
```

Sauvegardez : `Ctrl+X` → `Y` → `Enter`

**⚠️ TRÈS IMPORTANT** : Protégez ce fichier !
```bash
chmod 600 .env
```

### 5. Créer .gitignore

```bash
nano .gitignore
```

Contenu :
```
node_modules/
.env
logs/*.log
*.log
```

---

## 📥 ÉTAPE 6 : Installer les dépendances

```bash
cd /var/www/vhosts/academie-tourisme.fr/api

# Installer les dépendances npm
npm install

# Vérifier que node_modules est créé
ls -la | grep node_modules
```

**Si erreur de permissions** :
```bash
# Changer les permissions du dossier
chown -R $(whoami) /var/www/vhosts/academie-tourisme.fr/api
```

---

## 🧪 ÉTAPE 7 : Tester en mode développement (AVANT LA PROD)

```bash
cd /var/www/vhosts/academie-tourisme.fr/api

# Lancer le serveur en test
npm start
```

**Vous devriez voir** :
```
✅ Connexion à MariaDB établie
📊 Base de données: admin_gestion_gir
✅ Test de connexion réussi
🚀 Serveur API démarré sur http://localhost:3001
```

**Tester l'API** (dans un autre terminal SSH) :
```bash
curl http://localhost:3001/api/health
```

**Réponse attendue** :
```json
{
  "status": "OK",
  "database": "admin_gestion_gir",
  "timestamp": "2025-01-11T..."
}
```

✅ **Si ça fonctionne, passez à l'étape suivante !**

**Arrêter le serveur de test** : `Ctrl+C`

---

## 🚀 ÉTAPE 8 : Déployer en production avec PM2

### A. Installer PM2 globalement

```bash
npm install -g pm2
```

### B. Démarrer l'application

```bash
cd /var/www/vhosts/academie-tourisme.fr/api

# Démarrer avec PM2
pm2 start server/index.js --name academie-api

# Vérifier que c'est démarré
pm2 status
```

**Vous devriez voir** :
```
┌─────┬──────────────┬─────────┬─────────┬───────┐
│ id  │ name         │ status  │ restart │ uptime│
├─────┼──────────────┼─────────┼─────────┼───────┤
│ 0   │ academie-api │ online  │ 0       │ 0s    │
└─────┴──────────────┴─────────┴─────────┴───────┘
```

### C. Configurer le démarrage automatique

```bash
# Sauvegarder la configuration PM2
pm2 save

# Configurer le démarrage au boot
pm2 startup

# Copier et exécuter la commande affichée
# (différente selon votre système)
```

---

## 🌐 ÉTAPE 9 : Configurer l'accès via sous-domaine (OPTIONNEL)

### Option A : Via sous-domaine (api.academie-tourisme.fr)

Dans Plesk :
1. Allez dans **Domaines** → **academie-tourisme.fr**
2. Créez un **Sous-domaine** : `api.academie-tourisme.fr`
3. Configurez **Nginx** comme reverse proxy vers `localhost:3001`

### Option B : Via chemin (/api)

Dans Plesk :
1. Allez dans **Apache & nginx Settings**
2. Ajoutez dans "Additional nginx directives" :

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

---

## 🔒 ÉTAPE 10 : Sécuriser

### 1. Protéger le fichier .env

```bash
cd /var/www/vhosts/academie-tourisme.fr/api
chmod 600 .env
```

### 2. Vérifier les permissions

```bash
# Le dossier api doit appartenir à l'utilisateur du serveur web
chown -R www-data:www-data /var/www/vhosts/academie-tourisme.fr/api
# OU selon votre config
chown -R $(whoami):www-data /var/www/vhosts/academie-tourisme.fr/api
```

### 3. Activer HTTPS

Dans Plesk :
- **SSL/TLS Certificates** → Activer Let's Encrypt
- Forcer HTTPS

---

## 📊 ÉTAPE 11 : Monitoring et logs

### Commandes PM2 utiles

```bash
# Voir le status
pm2 status

# Voir les logs en temps réel
pm2 logs academie-api

# Redémarrer l'API
pm2 restart academie-api

# Arrêter l'API
pm2 stop academie-api

# Supprimer du PM2
pm2 delete academie-api

# Voir les métriques
pm2 monit
```

### Logs personnalisés

```bash
# Créer un dossier de logs
mkdir -p /var/www/vhosts/academie-tourisme.fr/api/logs

# Les logs PM2 sont dans :
~/.pm2/logs/
```

---

## 🧪 ÉTAPE 12 : Tests finaux

### 1. Test local

```bash
curl http://localhost:3001/api/health
```

### 2. Test depuis l'extérieur

```bash
# Si vous avez configuré le sous-domaine
curl https://api.academie-tourisme.fr/api/health

# Ou via le chemin
curl https://academie-tourisme.fr/api/health
```

### 3. Test complet de l'API

```bash
# Récupérer les users
curl https://academie-tourisme.fr/api/users

# Créer un user de test
curl -X POST https://academie-tourisme.fr/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "API",
    "email": "test@academie.fr",
    "role": "Apprenant",
    "etat": "Actif"
  }'
```

---

## 🔄 ÉTAPE 13 : Connecter le frontend Netlify au backend

### Modifier le frontend pour utiliser l'API

Créez un fichier `src/config/api.js` :

```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://academie-tourisme.fr/api'
  : 'http://localhost:3001/api'

export default API_BASE_URL
```

### Variables d'environnement Netlify

Dans Netlify :
1. Allez dans **Site settings** → **Environment variables**
2. Ajoutez :
   - `VITE_API_URL` = `https://academie-tourisme.fr/api`

---

## ⚠️ ROLLBACK - Si quelque chose ne va pas

```bash
# 1. Arrêter PM2
pm2 stop academie-api
pm2 delete academie-api

# 2. Supprimer le dossier api
cd /var/www/vhosts/academie-tourisme.fr
rm -rf api

# 3. Votre site principal est intact !
```

---

## 📋 CHECKLIST FINALE

Avant de dire que c'est terminé :

- [ ] Base de données créée et tables présentes
- [ ] Dossier `/var/www/vhosts/academie-tourisme.fr/api` créé
- [ ] Fichiers backend copiés
- [ ] `npm install` exécuté avec succès
- [ ] Test en mode dev réussi (`npm start`)
- [ ] PM2 installé et configuré
- [ ] API démarrée avec PM2
- [ ] `pm2 status` montre "online"
- [ ] Test `curl localhost:3001/api/health` OK
- [ ] Reverse proxy configuré (Nginx)
- [ ] Test externe réussi
- [ ] HTTPS activé
- [ ] Fichier .env protégé (chmod 600)
- [ ] PM2 startup configuré

---

## 🆘 Problèmes courants

### "Cannot find module"
```bash
cd /var/www/vhosts/academie-tourisme.fr/api
rm -rf node_modules package-lock.json
npm install
```

### "Permission denied"
```bash
chown -R $(whoami) /var/www/vhosts/academie-tourisme.fr/api
```

### "Port 3001 already in use"
```bash
# Trouver ce qui utilise le port
lsof -i :3001
# Ou changer le port dans .env
```

### PM2 ne démarre pas au boot
```bash
pm2 unstartup
pm2 startup
# Copier et exécuter la commande affichée
pm2 save
```

---

## 🎯 Résumé des commandes complètes

```bash
# 1. Créer le dossier
cd /var/www/vhosts/academie-tourisme.fr
mkdir api && cd api

# 2. Créer les fichiers (package.json, server/index.js, .env)
# (via nano ou FTP)

# 3. Installer
npm install

# 4. Tester
npm start
# Tester dans un autre terminal : curl http://localhost:3001/api/health
# Ctrl+C pour arrêter

# 5. Prod avec PM2
npm install -g pm2
pm2 start server/index.js --name academie-api
pm2 save
pm2 startup
# Exécuter la commande affichée

# 6. Vérifier
pm2 status
curl http://localhost:3001/api/health
```

---

Voilà ! Vous avez un backend sécurisé qui tourne en production ! 🚀
