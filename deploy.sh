#!/bin/bash

echo "🚀 Script de déploiement SharePoint Manager"
echo "=========================================="
echo ""

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js."
    exit 1
fi

echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "🔨 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "✅ Build terminé avec succès!"
echo ""
echo "📁 Les fichiers sont dans le dossier 'dist/'"
echo ""
echo "Pour déployer sur Netlify:"
echo "  1. Option CLI: netlify deploy --prod"
echo "  2. Option glisser-déposer: Glissez le dossier 'dist/' sur netlify.com/drop"
echo ""
echo "Pour tester localement:"
echo "  npm run preview"
