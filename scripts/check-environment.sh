#!/bin/bash
# Script de vérification avant installation du backend
# À exécuter dans /var/www/vhosts/academie-tourisme.fr

echo "🔍 Vérification de l'environnement de production..."
echo ""

# 1. Vérifier l'emplacement
echo "📍 Emplacement actuel :"
pwd
echo ""

# 2. Vérifier Node.js
echo "🟢 Node.js :"
if command -v node &> /dev/null; then
    node --version
else
    echo "❌ Node.js n'est pas installé"
fi
echo ""

# 3. Vérifier npm
echo "📦 npm :"
if command -v npm &> /dev/null; then
    npm --version
else
    echo "❌ npm n'est pas installé"
fi
echo ""

# 4. Vérifier l'utilisateur
echo "👤 Utilisateur actuel :"
whoami
echo ""

# 5. Vérifier les permissions
echo "🔐 Permissions du dossier :"
ls -ld /var/www/vhosts/academie-tourisme.fr 2>/dev/null || echo "Dossier non trouvé"
echo ""

# 6. Vérifier si le dossier api existe déjà
echo "📁 Vérification du dossier api :"
if [ -d "/var/www/vhosts/academie-tourisme.fr/api" ]; then
    echo "⚠️  Le dossier api existe déjà !"
    ls -la /var/www/vhosts/academie-tourisme.fr/api
else
    echo "✅ Le dossier api n'existe pas (OK pour créer)"
fi
echo ""

# 7. Vérifier la connexion MariaDB
echo "🗄️  Test de connexion MariaDB :"
if command -v mysql &> /dev/null; then
    mysql -u admin_gestion_gir -p'Neosphere2021*' -e "USE admin_gestion_gir; SHOW TABLES;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Connexion MariaDB OK"
    else
        echo "❌ Erreur de connexion MariaDB"
    fi
else
    echo "⚠️  Commande mysql non disponible"
fi
echo ""

# 8. Vérifier le port 3001
echo "🔌 Vérification du port 3001 :"
if command -v lsof &> /dev/null; then
    lsof -i :3001 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "⚠️  Le port 3001 est déjà utilisé"
    else
        echo "✅ Port 3001 disponible"
    fi
else
    echo "⚠️  Commande lsof non disponible"
fi
echo ""

# 9. Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ = OK pour continuer"
echo "⚠️  = Attention requise"
echo "❌ = Problème à résoudre"
echo ""
echo "Vous pouvez maintenant procéder à l'installation si tout est OK."
