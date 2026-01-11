#!/bin/bash

# Script de démarrage rapide du backend sur Plesk
# Usage: bash quick-start.sh

echo "🚀 Démarrage du backend Académie du Tourisme"
echo ""

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "server/index.js" ]; then
    echo "❌ Erreur: Fichier server/index.js non trouvé"
    echo "Assurez-vous d'être dans le dossier racine de l'application"
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Installez Node.js 18+ puis relancez ce script"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "Création du fichier .env..."
    cat > .env << EOF
DB_HOST=localhost
DB_USER=admin_gestion_gir
DB_PASSWORD=Neosphere2021*
DB_NAME=admin_gestion_gir
PORT=3001
EOF
    echo "✅ Fichier .env créé"
    echo ""
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées"
    echo ""
fi

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 n'est pas installé"
    read -p "Voulez-vous installer PM2 globalement ? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g pm2
        echo "✅ PM2 installé"
    else
        echo "ℹ️  Démarrage sans PM2 (développement)"
        echo "Pour production, installez PM2 : npm install -g pm2"
        echo ""
        echo "🚀 Démarrage du serveur..."
        npm run server
        exit 0
    fi
fi

# Arrêter l'instance existante si elle existe
pm2 delete academie-api 2>/dev/null

# Démarrer avec PM2
echo "🚀 Démarrage avec PM2..."
pm2 start server/index.js --name academie-api

# Sauvegarder la configuration
pm2 save

echo ""
echo "✅ Backend démarré avec succès !"
echo ""
echo "📊 Informations:"
pm2 info academie-api

echo ""
echo "🔍 Commandes utiles:"
echo "  pm2 status              - Voir l'état de l'API"
echo "  pm2 logs academie-api   - Voir les logs en temps réel"
echo "  pm2 restart academie-api - Redémarrer l'API"
echo "  pm2 stop academie-api   - Arrêter l'API"
echo ""
echo "🧪 Tester l'API:"
echo "  curl http://localhost:3001/api/health"
echo ""
