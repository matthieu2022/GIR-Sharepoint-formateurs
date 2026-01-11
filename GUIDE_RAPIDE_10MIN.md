# 🎯 GUIDE RAPIDE - Déploiement Backend en 10 minutes

**Vous êtes ici** : `/var/www/vhosts/academie-tourisme.fr`  
**But** : Installer le backend API MariaDB de manière sécurisée

---

## ✅ ÉTAPE 1 - Vérification (2 min)

Copiez-collez ces commandes une par une :

```bash
# Où êtes-vous ?
pwd

# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Qui êtes-vous ?
whoami
```

**Résultats attendus** :
- pwd → `/var/www/vhosts/academie-tourisme.fr`
- node → `v18.x` ou supérieur
- npm → `8.x` ou supérieur
- whoami → votre utilisateur

⚠️ **Si Node.js n'est pas installé**, installez-le via Plesk (Extensions → Node.js)

---

## 📁 ÉTAPE 2 - Créer le dossier backend (1 min)

```bash
# Créer le dossier
mkdir -p api/server

# Vérifier
ls -la | grep api

# Entrer dedans
cd api

# Vérifier où vous êtes
pwd
```

**Résultat attendu** :
```
/var/www/vhosts/academie-tourisme.fr/api
```

---

## 📝 ÉTAPE 3 - Créer package.json (1 min)

```bash
cat > package.json << 'EOF'
{
  "name": "academie-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1"
  }
}
EOF
```

**Vérifier** :
```bash
cat package.json
```

---

## 🔐 ÉTAPE 4 - Créer le fichier .env (1 min)

```bash
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=admin_gestion_gir
DB_PASSWORD=Neosphere2021*
DB_NAME=admin_gestion_gir
PORT=3001
EOF
```

**Sécuriser le fichier** :
```bash
chmod 600 .env
```

**Vérifier** :
```bash
cat .env
ls -la .env
```

---

## 🔧 ÉTAPE 5 - Créer server/index.js (2 min)

**Option A : Via nano (éditeur texte)**

```bash
nano server/index.js
```

Puis COPIEZ-COLLEZ le contenu du fichier `server/index.js` depuis l'archive.

Sauvegardez : `Ctrl+X` → `Y` → `Enter`

**Option B : Via un fichier que je vous donne**

Je vous prépare un fichier server/index.js complet dans le prochain message.

---

## 📦 ÉTAPE 6 - Installer les dépendances (2 min)

```bash
# Vérifier où vous êtes
pwd
# Doit afficher : /var/www/vhosts/academie-tourisme.fr/api

# Installer
npm install

# Attendre que ça termine...
# Vous verrez : added X packages
```

**Vérifier** :
```bash
ls -la | grep node_modules
```

Vous devriez voir le dossier `node_modules`

---

## 🧪 ÉTAPE 7 - Test (1 min)

```bash
# Démarrer en mode test
npm start
```

**Vous devriez voir** :
```
✅ Connexion à MariaDB établie
📊 Base de données: admin_gestion_gir
🚀 Serveur API démarré sur http://localhost:3001
```

**Dans un AUTRE terminal SSH**, testez :
```bash
curl http://localhost:3001/api/health
```

**Réponse attendue** :
```json
{"status":"OK","database":"admin_gestion_gir","timestamp":"..."}
```

✅ **Si ça marche, BRAVO ! Continuez.**

❌ **Si erreur, ARRÊTEZ et dites-moi l'erreur.**

**Arrêter le test** : `Ctrl+C`

---

## 🚀 ÉTAPE 8 - Production avec PM2 (2 min)

```bash
# Installer PM2 (une seule fois)
npm install -g pm2

# Démarrer l'API
pm2 start server/index.js --name academie-api

# Vérifier le status
pm2 status
```

**Résultat attendu** :
```
┌─────┬──────────────┬─────────┐
│ id  │ name         │ status  │
├─────┼──────────────┼─────────┤
│ 0   │ academie-api │ online  │
└─────┴──────────────┴─────────┘
```

**Sauvegarder la config** :
```bash
pm2 save
```

**Démarrage automatique** :
```bash
pm2 startup
```

Copiez et exécutez la commande affichée (elle ressemble à ça) :
```bash
sudo env PATH=... pm2 startup systemd -u VOTRE_USER --hp /home/VOTRE_USER
```

---

## ✅ ÉTAPE 9 - Vérification finale (1 min)

```bash
# L'API tourne-t-elle ?
pm2 status

# Test local
curl http://localhost:3001/api/health

# Voir les logs
pm2 logs academie-api --lines 20
```

---

## 🌐 ÉTAPE 10 - Configuration Nginx (dans Plesk)

1. Allez dans **Plesk** → **academie-tourisme.fr**
2. Allez dans **Apache & nginx Settings**
3. Dans **Additional nginx directives**, ajoutez :

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

4. Cliquez **OK**

5. Testez depuis l'extérieur :
```bash
curl https://academie-tourisme.fr/api/health
```

---

## 🎉 C'EST TERMINÉ !

Votre backend tourne maintenant en production !

**Commandes utiles** :

```bash
# Voir le status
pm2 status

# Redémarrer
pm2 restart academie-api

# Voir les logs
pm2 logs academie-api

# Arrêter
pm2 stop academie-api
```

---

## 🆘 EN CAS DE PROBLÈME

**L'API ne démarre pas** :
```bash
cd /var/www/vhosts/academie-tourisme.fr/api
pm2 logs academie-api --err
```

**Rollback complet** :
```bash
pm2 stop academie-api
pm2 delete academie-api
cd /var/www/vhosts/academie-tourisme.fr
rm -rf api
# Votre site principal est intact !
```

**Tester la connexion BDD** :
```bash
mysql -u admin_gestion_gir -p'Neosphere2021*' -e "USE admin_gestion_gir; SHOW TABLES;"
```

---

## 📞 BESOIN D'AIDE ?

Envoyez-moi :
1. La sortie de `pm2 logs academie-api`
2. La sortie de `pm2 status`
3. Le message d'erreur exact

Je vous aiderai !
