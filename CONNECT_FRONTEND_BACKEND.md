# 🔗 Connecter le Frontend Netlify au Backend MariaDB

## ✅ État actuel

- ✅ Base de données MariaDB créée sur Plesk
- ✅ Tables créées (6 tables)
- ✅ Frontend déployé sur Netlify
- ✅ Code sur GitHub

---

## 🎯 Objectif

Connecter votre application Netlify à la base de données MariaDB sur Plesk pour remplacer localStorage par une vraie base de données.

---

## 📋 ÉTAPE 1 : Déployer le backend Node.js sur Plesk

### Option A : Via FTP/SFTP (Recommandé)

#### 1. Préparer les fichiers

Sur votre ordinateur, créez un dossier `api` avec :
```
api/
├── server/
│   └── index.js
├── package.json
├── .env
└── node_modules/ (sera créé après)
```

#### 2. Créer le fichier `.env`

```env
DB_HOST=localhost
DB_USER=admin_gestion_gir
DB_PASSWORD=Neosphere2021*
DB_NAME=admin_gestion_gir
PORT=3001
```

⚠️ **IMPORTANT** : Gardez ce fichier secret !

#### 3. Téléverser via FTP

- **Hôte FTP** : Votre domaine Plesk
- **Utilisateur** : Votre user FTP
- **Destination** : `/httpdocs/api/` (ou `/api/`)

Téléversez tous les fichiers **sauf** `node_modules/`

#### 4. Se connecter en SSH à Plesk

```bash
ssh votre_user@votre_domaine.com
```

#### 5. Installer les dépendances

```bash
cd /var/www/vhosts/votre_domaine.com/httpdocs/api
npm install
```

#### 6. Tester le serveur

```bash
node server/index.js
```

Vous devriez voir :
```
✅ Connexion à MariaDB établie
📊 Base de données: admin_gestion_gir
🚀 Serveur API démarré sur http://localhost:3001
```

**Tapez Ctrl+C** pour arrêter.

#### 7. Démarrer avec PM2 (pour que ça tourne en permanence)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'API
pm2 start server/index.js --name academie-api

# Sauvegarder la config
pm2 save

# Lancer PM2 au démarrage du serveur
pm2 startup
```

✅ **Votre API tourne maintenant en permanence !**

---

### Option B : Via Git (Alternative)

```bash
# Sur votre serveur Plesk
cd /var/www/vhosts/votre_domaine.com/httpdocs
git clone https://github.com/VOTRE_USER/VOTRE_REPO.git api
cd api
npm install
# Créer le fichier .env
pm2 start server/index.js --name academie-api
```

---

## 🌐 ÉTAPE 2 : Configurer un sous-domaine pour l'API (Recommandé)

### Sur Plesk

1. Allez dans **Domaines** → **Ajouter un sous-domaine**
2. Créez : `api.votre-domaine.com`
3. Document root : `/httpdocs/api`

### Configuration Nginx/Apache

Créez un reverse proxy vers le port 3001.

**Fichier de configuration Nginx** :
```nginx
location /api {
    proxy_pass http://localhost:3001/api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Ou configurez via l'interface Plesk :
1. **Apache & nginx Settings**
2. **Additional nginx directives**
3. Collez la config ci-dessus

---

## 🔒 ÉTAPE 3 : Activer HTTPS (OBLIGATOIRE)

### Sur Plesk

1. Allez dans **SSL/TLS Certificates**
2. Activez **Let's Encrypt** (gratuit)
3. Cochez **Secure the wildcard domain**
4. **Installer**

✅ Votre API est maintenant accessible en HTTPS !

---

## 🔧 ÉTAPE 4 : Configurer CORS dans le backend

Le serveur backend doit autoriser les requêtes depuis Netlify.

**Modifiez `server/index.js`** :

```javascript
import cors from 'cors';

// Configurez CORS pour autoriser votre domaine Netlify
app.use(cors({
  origin: [
    'http://localhost:5173',  // Développement local
    'https://votre-app.netlify.app',  // Production Netlify
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

**Redémarrez l'API** :
```bash
pm2 restart academie-api
```

---

## ⚙️ ÉTAPE 5 : Configurer Netlify

### 1. Ajouter les variables d'environnement

Dans Netlify :
1. Allez dans **Site settings** → **Environment variables**
2. Cliquez sur **Add a variable**
3. Ajoutez :

```
Key: VITE_API_URL
Value: https://api.votre-domaine.com/api
```

OU si vous n'avez pas de sous-domaine :

```
Key: VITE_API_URL
Value: https://votre-domaine.com/api
```

### 2. Créer le fichier `.env.local` en local

Pour le développement local, créez `.env.local` :

```env
VITE_API_URL=http://localhost:3001/api
```

**⚠️ Ne commitez PAS ce fichier !** (déjà dans `.gitignore`)

### 3. Redéployer sur Netlify

```bash
git add .
git commit -m "Connexion à l'API MariaDB"
git push origin main
```

Netlify redéploiera automatiquement avec la nouvelle config.

---

## 🧪 ÉTAPE 6 : Tester la connexion

### 1. Tester l'API directement

```bash
# Test de santé
curl https://api.votre-domaine.com/api/health

# Récupérer les users
curl https://api.votre-domaine.com/api/users
```

### 2. Tester depuis Netlify

Ouvrez votre app Netlify et ouvrez la console développeur (F12).

Vous devriez voir les requêtes vers votre API :
```
GET https://api.votre-domaine.com/api/users
```

### 3. Créer un utilisateur de test

Dans l'app Netlify :
1. Cliquez sur "Ajouter un utilisateur"
2. Remplissez le formulaire
3. Cliquez sur "Créer"

**Vérifiez dans phpMyAdmin** :
```sql
SELECT * FROM users;
```

Vous devriez voir le nouvel utilisateur ! ✅

---

## 🔄 ÉTAPE 7 : Basculer de localStorage vers l'API

Le code a déjà été préparé avec `src/services/api.js`.

**Toutes les vues utilisent déjà l'API** si `VITE_API_URL` est défini !

Si vous voulez garder localStorage en backup :
- Développement local : localStorage
- Production : API MariaDB

---

## 📊 Architecture finale

```
┌─────────────────┐
│   Navigateur    │
│   (Utilisateur) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│     Netlify     │
│   (Frontend)    │
│   React + Vite  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Votre Plesk   │
│  (Backend API)  │
│  Node.js:3001   │
└────────┬────────┘
         │ localhost
         ▼
┌─────────────────┐
│    MariaDB      │
│ admin_gestion   │
│     _gir        │
└─────────────────┘
```

---

## 🐛 Dépannage

### Erreur CORS

**Symptôme** : `Access to fetch at '...' has been blocked by CORS policy`

**Solution** :
1. Vérifiez la config CORS dans `server/index.js`
2. Ajoutez votre domaine Netlify
3. Redémarrez l'API : `pm2 restart academie-api`

### Erreur 502 Bad Gateway

**Symptôme** : L'API ne répond pas

**Causes possibles** :
- Le serveur Node n'est pas démarré
- Problème de port
- Firewall bloque le port 3001

**Solution** :
```bash
# Vérifier que l'API tourne
pm2 status

# Redémarrer
pm2 restart academie-api

# Voir les logs
pm2 logs academie-api
```

### Erreur de connexion BDD

**Symptôme** : `Can't connect to MySQL server`

**Solution** :
1. Vérifiez le fichier `.env`
2. Testez la connexion MySQL :
```bash
mysql -u admin_gestion_gir -p admin_gestion_gir
```

### Variables d'environnement non prises en compte

**Solution** :
1. Sur Netlify : Vérifiez **Environment variables**
2. Redéployez : **Deploys** → **Trigger deploy** → **Clear cache and deploy**

---

## 🔐 Sécurité

### ✅ À FAIRE

1. **HTTPS activé** sur l'API (Let's Encrypt)
2. **CORS configuré** (seulement votre domaine)
3. **Mots de passe chiffrés** (recommandé avec bcrypt)
4. **Variables d'env sécurisées** (pas de commit de .env)
5. **Firewall configuré** (port 3001 non accessible publiquement)

### ⚠️ Amélioration future : Chiffrer les mots de passe

Actuellement, les mots de passe O365 et LMS sont en clair dans la BDD.

**Pour les chiffrer** :
```bash
npm install bcrypt
```

```javascript
import bcrypt from 'bcrypt';

// Lors de la création
const hashedPassword = await bcrypt.hash(motDePasseO365, 10);

// Lors de la vérification
const match = await bcrypt.compare(inputPassword, hashedPassword);
```

---

## 📝 Checklist finale

### Backend Plesk
- ☐ Serveur Node.js déployé
- ☐ Dépendances installées (`npm install`)
- ☐ Fichier `.env` créé avec les bonnes infos
- ☐ PM2 installé et configuré
- ☐ API démarrée avec PM2
- ☐ Test santé réussi (`/api/health`)
- ☐ HTTPS activé (Let's Encrypt)
- ☐ CORS configuré

### Frontend Netlify
- ☐ Variable `VITE_API_URL` ajoutée
- ☐ Code poussé sur GitHub
- ☐ Redéployé sur Netlify
- ☐ Test création d'utilisateur
- ☐ Vérification dans phpMyAdmin

---

## 🎯 URL à configurer

Remplacez ces valeurs selon votre configuration :

```env
# Dans Netlify (Environment variables)
VITE_API_URL=https://api.votre-domaine.com/api

# Ou sans sous-domaine
VITE_API_URL=https://votre-domaine.com/api

# Ou avec IP
VITE_API_URL=https://123.456.789.10/api
```

---

## ✅ Test final

1. Ouvrez votre app Netlify
2. Ajoutez un utilisateur
3. Vérifiez dans phpMyAdmin → Table `users`
4. L'utilisateur apparaît ? **C'EST BON !** 🎉

---

## 📞 Besoin d'aide ?

Si vous avez des erreurs :

1. **Logs du backend** :
```bash
pm2 logs academie-api
```

2. **Console navigateur** (F12)
3. **Logs Netlify** (Deploy logs)

---

**Votre application est maintenant connectée à MariaDB !** 🚀

Les 4 administrateurs peuvent gérer les utilisateurs, groupes, salles, etc., et tout est sauvegardé dans la base de données !
