# 🚀 Guide : Héberger le Backend Node.js sur Plesk

## 📋 Prérequis

Votre Plesk doit avoir :
- ✅ **Node.js installé** (vérifiez dans Plesk > Extensions)
- ✅ **Accès SSH** (recommandé)
- ✅ **MariaDB configuré** (voir PLESK_SETUP.md)

---

## 🎯 Architecture de déploiement

```
┌─────────────────────────────────────────────┐
│ Netlify (Frontend)                          │
│ https://academie.netlify.app                │
│ └─ Appelle l'API via HTTPS                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Plesk (Backend Node.js + MariaDB)          │
│ https://api.votre-domaine.com               │
│ ou https://votre-domaine.com/api            │
│ ├─ Backend Node.js sur port 3001           │
│ └─ MariaDB                                  │
└─────────────────────────────────────────────┘
```

---

## 📋 Option 1 : Hébergement via Node.js dans Plesk (Recommandé)

### Étape 1 : Créer une application Node.js

1. **Dans Plesk**
   - Allez dans : Domaines > Votre domaine > Node.js

2. **Créer une nouvelle application**
   - Cliquez sur "Activer Node.js"
   - **Version Node.js** : Sélectionnez la dernière LTS (18.x ou 20.x)
   - **Mode d'application** : Production
   - **Répertoire de l'application** : `/api` ou `/backend`
   - **URL** : `https://votre-domaine.com/api`

3. **Configuration**
   - **Fichier de démarrage** : `server/index.js`
   - **Variables d'environnement** :
     ```
     DB_HOST=localhost
     DB_USER=academie_user
     DB_PASSWORD=votre_mot_de_passe
     DB_NAME=academie_tourisme
     DB_PORT=3306
     PORT=3001
     NODE_ENV=production
     ```

### Étape 2 : Téléverser les fichiers

**Via FTP/SFTP :**
1. Connectez-vous avec FileZilla ou WinSCP
2. Accédez au dossier de l'application (ex: `/api` ou `/backend`)
3. Téléversez :
   - `/server/` (tout le dossier)
   - `package.json`
   - `.env` (avec vos vraies valeurs)

**Via SSH (plus rapide) :**
```bash
# Se connecter en SSH
ssh votre-user@votre-domaine.com

# Aller dans le dossier web
cd httpdocs/api  # ou le chemin configuré

# Cloner ou copier les fichiers du backend
# Option 1 : Upload via SCP depuis votre machine locale
# Option 2 : Git clone si vous avez mis le code sur GitHub
```

### Étape 3 : Installer les dépendances

**Dans Plesk :**
1. Retournez dans Node.js
2. Cliquez sur "NPM install"
3. Attendez que l'installation se termine

**Via SSH :**
```bash
cd httpdocs/api
npm install --production
```

### Étape 4 : Démarrer l'application

**Dans Plesk :**
1. Cliquez sur "Redémarrer l'application"
2. Vérifiez que le statut est "En cours d'exécution"

**Test :**
```bash
curl https://votre-domaine.com/api/users
# ou
curl https://api.votre-domaine.com/users
```

---

## 📋 Option 2 : PM2 + Reverse Proxy (Pour utilisateurs avancés)

### Étape 1 : Installer PM2

```bash
# SSH dans votre serveur
npm install -g pm2

# Aller dans le dossier de l'app
cd /var/www/vhosts/votre-domaine.com/httpdocs/backend

# Installer les dépendances
npm install --production

# Créer le fichier .env
nano .env
# Coller vos variables d'environnement
```

### Étape 2 : Démarrer avec PM2

```bash
# Démarrer l'application
pm2 start server/index.js --name academie-api

# Configurer le démarrage automatique
pm2 startup
pm2 save

# Vérifier le statut
pm2 status
pm2 logs academie-api
```

### Étape 3 : Configurer le Reverse Proxy dans Plesk

1. **Allez dans Apache & nginx Settings**
2. **Ajoutez dans "Additional nginx directives" :**

```nginx
location /api/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

3. **Appliquez et testez**

---

## 📋 Option 3 : Sous-domaine dédié pour l'API

### Créer un sous-domaine

1. **Dans Plesk : Domaines**
2. **Ajouter un sous-domaine** : `api.votre-domaine.com`
3. **Configurer Node.js sur ce sous-domaine**
4. **Suivre les étapes de l'Option 1**

**Avantages :**
- URL propre : `https://api.votre-domaine.com/users`
- Séparation claire frontend/backend
- Certificat SSL automatique

---

## 🔒 Configuration SSL (HTTPS)

### Activer SSL dans Plesk

1. **Allez dans SSL/TLS Certificates**
2. **Let's Encrypt** (gratuit) :
   - Cochez votre domaine
   - Cochez "Sécuriser le nom de domaine générique"
   - Cliquez sur "Obtenir"

3. **Vérifier** :
   ```bash
   curl https://votre-domaine.com/api/users
   ```

---

## 🔧 Configuration du Frontend (Netlify)

### Mettre à jour l'URL de l'API

**Dans votre code frontend**, créez un fichier `.env.production` :

```env
VITE_API_URL=https://votre-domaine.com/api
# ou
VITE_API_URL=https://api.votre-domaine.com
```

**Dans `src/services/api.js`** (à créer) :

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

// Répéter pour toutes les autres routes...
```

---

## 📊 Monitoring et Logs

### Vérifier les logs dans Plesk

1. **Logs Node.js** : Domaines > Node.js > Logs
2. **Logs Apache/Nginx** : Domaines > Logs
3. **Logs MariaDB** : Bases de données > Logs

### Via SSH avec PM2

```bash
# Voir les logs en temps réel
pm2 logs academie-api

# Logs des erreurs
pm2 logs academie-api --err

# Redémarrer en cas de problème
pm2 restart academie-api
```

---

## 🛠️ Dépannage

### L'application ne démarre pas

1. **Vérifier les logs** :
   ```bash
   pm2 logs academie-api
   # ou dans Plesk > Node.js > Logs
   ```

2. **Vérifier les variables d'environnement** :
   - Le fichier `.env` existe ?
   - Les valeurs sont correctes ?

3. **Vérifier la connexion BDD** :
   ```bash
   mysql -u academie_user -p academie_tourisme
   # Devrait se connecter sans erreur
   ```

### Erreur CORS

**Symptôme** : Frontend ne peut pas appeler l'API

**Solution** : Vérifier dans `server/index.js` :

```javascript
app.use(cors({
  origin: 'https://academie.netlify.app', // Votre URL Netlify
  credentials: true
}));
```

### Port déjà utilisé

**Erreur** : `Error: listen EADDRINUSE: address already in use :::3001`

**Solution** :
```bash
# Trouver le processus
lsof -i :3001

# Tuer le processus
kill -9 PID

# Ou changer le port dans .env
PORT=3002
```

---

## ✅ Checklist de déploiement

- [ ] MariaDB configuré et tables créées
- [ ] Node.js activé dans Plesk
- [ ] Fichiers backend téléversés
- [ ] `.env` configuré avec les bonnes valeurs
- [ ] `npm install` exécuté
- [ ] Application démarrée (Plesk ou PM2)
- [ ] SSL activé (HTTPS)
- [ ] Test de l'API : `curl https://votre-domaine.com/api/users`
- [ ] CORS configuré pour Netlify
- [ ] Frontend mis à jour avec l'URL de l'API
- [ ] Tests complets frontend ↔ backend

---

## 🎯 Prochaines étapes

**Donnez-moi :**
1. Vos informations de connexion BDD
2. L'URL où sera hébergée l'API (ex: `https://api.academie-tourisme.fr`)

**Je vous donnerai :**
1. Le fichier `.env` complet
2. Le backend mis à jour pour Plesk
3. Le frontend mis à jour pour appeler l'API
4. Les instructions de déploiement détaillées

---

**Prêt à déployer ?** 🚀
