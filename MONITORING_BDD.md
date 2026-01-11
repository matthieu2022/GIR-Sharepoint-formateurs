# 📊 Monitoring Base de Données - Sidebar Droite

## ✨ Nouvelle fonctionnalité

Un widget de monitoring en temps réel de la base de données MariaDB a été ajouté dans la sidebar droite de l'application.

---

## 🎨 Aperçu

```
┌─────────────────────────────────┐
│ 🗄️ Base de données              │
├─────────────────────────────────┤
│ Statut     [✓ Connectée]        │
│ Nom        admin_gestion_gir    │
│ Version    10.11.8-MariaDB      │
│ Taille     2.45 Mo              │
│                                  │
│ ──────────────────────────────  │
│                                  │
│ Enregistrements                 │
│ Users              42           │
│ Salles             8            │
│ Événements         15           │
│ SharePoint         5            │
│ Groupes GIR        3            │
│                                  │
│ ⟳ Actualisé: 14:32:15           │
└─────────────────────────────────┘
```

---

## 🔧 Configuration

### 1. Backend - Nouveau endpoint

Un endpoint `/api/database/status` a été ajouté au serveur backend.

**Fichier** : `server/index.js`

**Retour JSON** :
```json
{
  "status": "connected",
  "database": "admin_gestion_gir",
  "host": "localhost",
  "version": "10.11.8-MariaDB",
  "size_mb": 2.45,
  "tables": {
    "users": 42,
    "salles": 8,
    "events": 15,
    "sharepoint": 5,
    "groupes_gir": 3
  },
  "timestamp": "2025-01-11T14:32:15.000Z"
}
```

---

### 2. Frontend - Configuration de l'URL API

**Créer le fichier `.env.local`** à la racine du projet frontend :

```bash
# Pour le développement local
VITE_API_URL=http://localhost:3001

# Pour la production
VITE_API_URL=https://academie-tourisme.fr/api/gir
```

**Pour Netlify** :
1. Allez dans **Site settings** → **Environment variables**
2. Ajoutez la variable :
   - Clé : `VITE_API_URL`
   - Valeur : `https://academie-tourisme.fr/api/gir`

---

## 📋 Informations affichées

### Badge de statut

| Statut | Couleur | Texte |
|--------|---------|-------|
| Connectée | Vert 🟢 | ✓ Connectée |
| Erreur | Rouge 🔴 | ✗ Erreur |
| Déconnectée | Rouge 🔴 | ✗ Déconnectée |
| Vérification | Jaune 🟡 | ⟳ Vérification... |

### Informations BDD

- **Nom** : Nom de la base de données
- **Version** : Version de MariaDB/MySQL
- **Taille** : Taille totale en Mo
- **Enregistrements** : Nombre d'enregistrements par table

### Actualisation automatique

- Vérification **au chargement** de la page
- Vérification **toutes les 30 secondes**
- Affichage de l'heure de la dernière actualisation

---

## 🔄 Fonctionnement

### Mode localStorage (sans backend)

Si le backend n'est pas configuré :
- Le badge affiche "✗ Déconnectée" en rouge
- Les autres informations ne s'affichent pas
- L'application continue de fonctionner normalement avec localStorage

### Mode MariaDB (avec backend)

Si le backend est configuré et tourne :
- Le badge affiche "✓ Connectée" en vert
- Toutes les informations BDD s'affichent
- Actualisation automatique toutes les 30 secondes

---

## 🚀 Déploiement

### Étape 1 : Backend

Le backend doit être déployé et accessible.

```bash
# Vérifier que le backend tourne
curl https://academie-tourisme.fr/api/gir/database/status
```

**Réponse attendue** :
```json
{"status":"connected","database":"admin_gestion_gir",...}
```

---

### Étape 2 : Frontend (Netlify)

1. **Configurez la variable d'environnement** :
   - Netlify → Site settings → Environment variables
   - `VITE_API_URL` = `https://academie-tourisme.fr/api/gir`

2. **Redéployez** l'application :
   - Soit via un commit Git
   - Soit via le bouton "Trigger deploy" dans Netlify

3. **Vérifiez** :
   - Ouvrez l'application
   - La sidebar droite doit afficher le statut "✓ Connectée"

---

## 🧪 Tests

### Test en local

```bash
# 1. Démarrer le backend
cd /var/www/vhosts/academie-tourisme.fr/api/api-gir-sharepoint
npm start

# 2. Dans un autre terminal, tester l'endpoint
curl http://localhost:3001/api/database/status

# 3. Démarrer le frontend
cd chemin/vers/frontend
npm run dev

# 4. Ouvrir http://localhost:5173
# La sidebar droite doit afficher "✓ Connectée"
```

---

### Test en production

```bash
# Tester l'endpoint backend
curl https://academie-tourisme.fr/api/gir/database/status

# Ouvrir l'application
# https://votre-app.netlify.app
```

---

## 🎨 Personnalisation

### Modifier la fréquence d'actualisation

Dans `src/components/RightSidebar.jsx` :

```javascript
// Ligne ~60
// Actuellement : 30000 ms (30 secondes)
const interval = setInterval(checkDatabaseStatus, 30000)

// Pour 1 minute :
const interval = setInterval(checkDatabaseStatus, 60000)

// Pour 10 secondes :
const interval = setInterval(checkDatabaseStatus, 10000)
```

---

### Ajouter d'autres métriques

Dans `server/index.js`, ajoutez vos requêtes :

```javascript
// Exemple : Nombre d'utilisateurs actifs
const [activeUsers] = await pool.query(
  'SELECT COUNT(*) as count FROM users WHERE etat = "Actif"'
);

// Retourner dans la réponse
res.json({
  // ... autres données
  active_users: activeUsers[0].count
});
```

Puis dans `RightSidebar.jsx`, affichez la nouvelle donnée.

---

## 🔒 Sécurité

### CORS

Le backend est configuré pour accepter toutes les origines (development).

En production, restreindre dans `server/index.js` :

```javascript
app.use(cors({
  origin: 'https://votre-app.netlify.app',
  credentials: true
}));
```

---

### Données sensibles

Le widget n'affiche **PAS** :
- Les mots de passe
- Les données personnelles
- Les informations sensibles

Seulement des **métadonnées** :
- Nombre d'enregistrements
- Taille de la BDD
- Version

---

## 🐛 Dépannage

### Le badge affiche "Déconnectée"

**Causes possibles** :
1. Le backend n'est pas démarré
2. L'URL API est incorrecte
3. Problème CORS

**Solutions** :
```bash
# Vérifier que le backend tourne
pm2 status

# Tester l'endpoint
curl https://academie-tourisme.fr/api/gir/database/status

# Vérifier les logs backend
pm2 logs api-gir-sharepoint

# Vérifier la console navigateur (F12)
# Doit afficher l'URL utilisée pour l'appel
```

---

### Le badge reste sur "Vérification..."

**Cause** : Requête en cours qui ne se termine pas

**Solution** :
- Vérifier la console du navigateur (F12)
- Regarder l'onglet Network
- Vérifier si la requête est bloquée (CORS, firewall, etc.)

---

### Les chiffres ne correspondent pas

**Cause** : L'application utilise localStorage, pas la BDD

**Solution** :
- Vous devez d'abord migrer vers MariaDB
- Ou connecter le frontend au backend (voir documentation complète)

---

## 📊 Monitoring en production

Pour un monitoring plus avancé, envisagez :

1. **PM2 Monitoring** (gratuit)
   ```bash
   pm2 monitor
   ```

2. **Logs centralisés**
   ```bash
   pm2 logs --json > logs.json
   ```

3. **Alertes**
   - Configurez des alertes si la BDD est déconnectée
   - Surveillance de l'espace disque

---

## ✅ Checklist

- [ ] Backend déployé et accessible
- [ ] Endpoint `/api/database/status` fonctionne
- [ ] Variable d'environnement `VITE_API_URL` configurée
- [ ] Frontend redéployé
- [ ] Badge "✓ Connectée" affiché
- [ ] Actualisation automatique fonctionne
- [ ] Chiffres corrects affichés

---

## 🎯 Avantages

✅ **Visibilité** : État de la BDD en un coup d'œil  
✅ **Proactif** : Détection immédiate des problèmes  
✅ **Pratique** : Informations utiles toujours visibles  
✅ **Professionnel** : Interface moderne et claire  

---

**Tout est prêt !** La sidebar affichera automatiquement l'état de votre base de données en temps réel ! 🎉
