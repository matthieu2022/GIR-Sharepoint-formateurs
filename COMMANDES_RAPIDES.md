# 📋 Commandes à copier-coller (dans l'ordre)

## 1. Vérification initiale
pwd
node --version
npm --version
whoami

## 2. Créer le dossier backend
cd /var/www/vhosts/academie-tourisme.fr
mkdir -p api/server
cd api
pwd

## 3. Créer package.json
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

## 4. Créer .env
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=admin_gestion_gir
DB_PASSWORD=Neosphere2021*
DB_NAME=admin_gestion_gir
PORT=3001
EOF

chmod 600 .env

## 5. Créer server/index.js
# IMPORTANT : Le contenu du fichier server/index.js est dans l'archive
# Téléversez-le via FTP OU créez-le avec nano :
nano server/index.js
# Collez le contenu du fichier server/index.js depuis l'archive
# Sauvegardez : Ctrl+X → Y → Enter

## 6. Installer les dépendances
npm install

## 7. Test en mode développement
npm start
# Dans un AUTRE terminal :
curl http://localhost:3001/api/health
# Arrêtez avec Ctrl+C

## 8. Production avec PM2
npm install -g pm2
pm2 start server/index.js --name academie-api
pm2 status
pm2 save
pm2 startup
# Copiez et exécutez la commande affichée

## 9. Vérification
pm2 status
curl http://localhost:3001/api/health
pm2 logs academie-api --lines 20

## 10. Commandes utiles
pm2 status                    # Voir le status
pm2 restart academie-api      # Redémarrer
pm2 logs academie-api         # Voir les logs
pm2 stop academie-api         # Arrêter
