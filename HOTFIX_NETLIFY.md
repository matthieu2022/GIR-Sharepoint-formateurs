# 🔧 HOTFIX - Correction erreur de build Netlify

## ❌ Erreur identifiée

**Fichier** : `src/views/CalendrierView.jsx`  
**Ligne** : 103  
**Problème** : Tableau fermé avec `}` au lieu de `]`

```javascript
// ❌ INCORRECT (ligne 103)
const groupeColors = [
  { bg: 'bg-blue-50', ... },
  { bg: 'bg-green-50', ... },
}  // ← Mauvais : } au lieu de ]

// ✅ CORRECT
const groupeColors = [
  { bg: 'bg-blue-50', ... },
  { bg: 'bg-green-50', ... },
]  // ← Bon : ]
```

---

## 🚀 Solution rapide (2 méthodes)

### Méthode 1 : Correction directe sur GitHub (RAPIDE)

1. Allez sur GitHub → Votre repo
2. Naviguez vers `src/views/CalendrierView.jsx`
3. Cliquez sur l'icône "Edit" (crayon)
4. Ligne **103** : Changez `}` en `]`
5. Commit directement sur main
6. Netlify redéploiera automatiquement

**Ligne à modifier** :
```javascript
// AVANT (ligne 103)
  ]

// Vérifiez que c'est bien un crochet fermant ]
```

---

### Méthode 2 : Via Git en local

```bash
# 1. Dans votre projet local
cd chemin/vers/academie-app

# 2. Ouvrir le fichier
nano src/views/CalendrierView.jsx

# 3. Ligne 103 : Changer } en ]

# 4. Sauvegarder et commit
git add src/views/CalendrierView.jsx
git commit -m "fix: Correction syntaxe tableau groupeColors"
git push

# Netlify redéploiera automatiquement
```

---

## ✅ Vérification

Le fichier corrigé doit ressembler à ça (lignes 95-108) :

```javascript
  // Couleurs pour les groupes GIR
  const groupeColors = [
    { bg: 'bg-blue-50', border: 'border-l-4 border-blue-400', text: 'text-blue-700' },
    { bg: 'bg-green-50', border: 'border-l-4 border-green-400', text: 'text-green-700' },
    { bg: 'bg-purple-50', border: 'border-l-4 border-purple-400', text: 'text-purple-700' },
    { bg: 'bg-orange-50', border: 'border-l-4 border-orange-400', text: 'text-orange-700' },
    { bg: 'bg-pink-50', border: 'border-l-4 border-pink-400', text: 'text-pink-700' },
    { bg: 'bg-indigo-50', border: 'border-l-4 border-indigo-400', text: 'text-indigo-700' },
  ]  // ← IMPORTANT : Crochet fermant ]

  const getGroupeColor = (groupeId) => {
    const index = groupesGIR.findIndex(g => g.id === groupeId)
    return groupeColors[index % groupeColors.length]
  }
```

---

## 📊 Netlify

Après le push :
1. Allez sur Netlify → Votre site
2. Vérifiez que le build démarre automatiquement
3. Attendez ~2 minutes
4. Le site sera déployé ✅

---

## 🎯 Fichier corrigé

L'archive `academie-app-v3.2-hotfix.tar.gz` contient le fichier corrigé.

Si vous avez déjà le projet sur votre machine, changez juste cette ligne.

---

**C'est une simple faute de frappe, la correction prend 10 secondes !** 🚀
