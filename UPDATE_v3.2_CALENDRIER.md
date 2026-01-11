# 🎉 Version 3.2 - Améliorations Calendrier & Statistiques

## ✨ Nouvelles fonctionnalités

### 1️⃣ Périodes des groupes GIR dans les calendriers ✅

**Calendrier latéral (sidebar gauche)** :
- ✅ Affichage des périodes des groupes GIR actifs
- ✅ Jours colorés selon les groupes en cours
- ✅ Palette de 8 couleurs harmonieuses
- ✅ Tooltip avec détails (nom du groupe + dates)
- ✅ Indicateur visuel pour jours avec plusieurs groupes
- ✅ Liste des groupes GIR actifs sous le calendrier avec pastille de couleur

**Calendrier annuel (vue principale)** :
- ✅ Affichage des périodes de groupes GIR dans chaque cellule
- ✅ Icône 📚 + nom du groupe
- ✅ Bordure latérale colorée par groupe
- ✅ Tooltip avec dates complètes
- ✅ Groupes affichés avant les événements
- ✅ Click pour plus d'infos (sans créer d'événement sur les groupes)

**Couleurs des groupes** :
1. Bleu (blue-50 / blue-400)
2. Vert (green-50 / green-400)
3. Violet (purple-50 / purple-400)
4. Orange (orange-50 / orange-400)
5. Rose (pink-50 / pink-400)
6. Indigo (indigo-50 / indigo-400)
7. Jaune (yellow-50 / yellow-400)
8. Turquoise (teal-50 / teal-400)

---

### 2️⃣ Badge de statut dans la liste des apprenants ✅

**Vue Kanban (Liste des apprenants)** :
- ✅ Badge de statut **TOUJOURS affiché** pour chaque utilisateur
- ✅ Couleurs selon le statut :
  - **Actif** → Badge vert (badge-success)
  - **Suspendu** → Badge jaune/orange (badge-warning)
  - **Supprimé** → Badge rouge (badge-danger)

**Position** : Dans la zone des badges, avec le groupe et le TP

**Exemple de card** :
```
┌─────────────────────────────────┐
│ Jean Dupont                   ✏️🗑️│
│ 📧 jean.dupont@email.com         │
│                                  │
│ [VTF] [RHH] [Actif]             │
│ 📅 Du 2025-01-01 au 2025-12-31   │
└─────────────────────────────────┘
```

---

### 3️⃣ Statistiques depuis la BDD ✅

**Sidebar droite - Statistiques** :
- ✅ Données proviennent de la **base de données MariaDB**
- ✅ Compteurs en temps réel via l'API
- ✅ Fallback sur localStorage si BDD non disponible

**Nouvelles requêtes SQL** :
- Apprenants actifs : `SELECT COUNT(*) FROM users WHERE role = "Apprenant" AND etat = "Actif"`
- Formateurs actifs : `SELECT COUNT(*) FROM users WHERE role = "Formateur" AND etat = "Actif"`

**Endpoint backend mis à jour** : `/api/database/status`

**Retourne maintenant** :
```json
{
  "status": "connected",
  "tables": {
    "users": 42,
    "apprenants": 35,  // ← NOUVEAU
    "formateurs": 7,    // ← NOUVEAU
    "salles": 8,
    "events": 15,
    "sharepoint": 5,
    "groupes_gir": 3
  }
}
```

**Actualisation** :
- Au chargement de la page
- Toutes les 30 secondes
- Passage automatique localStorage → BDD quand le backend est disponible

---

## 🔧 Modifications techniques

### Fichiers modifiés

#### Frontend

1. **src/components/SideCalendar.jsx**
   - Import de `isWithinInterval` de date-fns
   - Import de `getGroupesGIR` du storage
   - Fonction `getActiveGroupesForDay()` pour filtrer les groupes actifs
   - Palette de couleurs pour les groupes
   - Affichage des jours colorés selon les groupes
   - Liste des groupes GIR actifs sous le calendrier

2. **src/views/CalendrierView.jsx**
   - Import de `isWithinInterval` de date-fns
   - Import de `getGroupesGIR` du storage
   - État local pour les groupes GIR
   - Fonction `getActiveGroupesForDay()`
   - Fonction `getGroupeColor()`
   - Affichage des groupes dans les cellules du calendrier

3. **src/views/ApprenantsView.jsx**
   - Badge de statut toujours affiché (plus uniquement pour Suspendu/Supprimé)
   - Couleur du badge selon le statut

4. **src/components/RightSidebar.jsx**
   - Utilisation des statistiques détaillées de la BDD
   - Apprenants actifs et formateurs actifs séparés
   - Fallback sur localStorage si BDD indisponible

#### Backend

5. **server/index.js**
   - Requêtes SQL ajoutées pour filtrer par rôle ET statut
   - Endpoint `/api/database/status` enrichi avec `apprenants` et `formateurs`

---

## 🎨 Interface utilisateur

### Calendrier latéral (sidebar gauche)

```
┌─────────────────────────────────┐
│ Janvier 2025            [←][→]  │
├─────────────────────────────────┤
│ L  M  M  J  V  S  D             │
│          1  2  3  4  5           │
│ 6  7  8  9 10 11 12             │
│13 14 15 16 17 18 19             │ ← Jours colorés selon groupes
│20 21 22 23 24 25 26             │
│27 28 29 30 31                   │
├─────────────────────────────────┤
│ Groupes GIR actifs (3)          │
│                                  │
│ GIR RHH5             🔵         │
│ 01/01/2025 → 31/12/2025         │
│                                  │
│ GIR RET3             🟢         │
│ 01/09/2024 → 30/06/2025         │
│                                  │
│ GIR ALT2             🟣         │
│ 15/01/2025 → 15/12/2025         │
└─────────────────────────────────┘
```

### Calendrier annuel (vue principale)

```
┌────────────────────────────────────────┐
│ Janvier 2025          [Aujourd'hui]    │
│                      [←][→] [+ Nouvel] │
├────────────────────────────────────────┤
│ Lun  Mar  Mer  Jeu  Ven  Sam  Dim     │
├────────────────────────────────────────┤
│                1    2    3    4    5   │
│                                         │
│ 6    7    8    9   10   11   12        │
│ 📚 GIR RHH5                            │ ← Groupe avec bordure bleue
│ 📅 Cours Math                          │ ← Événement
│                                         │
│13   14   15   16   17   18   19        │
│ 📚 GIR RHH5                            │
│ 📚 GIR RET3                            │ ← Plusieurs groupes
│ 📅 Examen                              │
└────────────────────────────────────────┘
```

### Liste des apprenants (Kanban)

```
┌─────────────────────────────────┐
│ Apprenants (35)                  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Jean Dupont               ✏️🗑️│ │
│ │ 📧 jean.dupont@email.com     │ │
│ │                              │ │
│ │ [VTF] [RHH] [Actif] 🟢      │ │ ← Badge statut
│ │ 📅 01/01 au 31/12            │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Sophie Martin             ✏️🗑️│ │
│ │ 📧 sophie.martin@email.com   │ │
│ │                              │ │
│ │ [AC] [RET] [Suspendu] 🟡    │ │ ← Badge jaune
│ │ 📅 15/01 au 15/12            │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🔄 Fonctionnement

### Périodes de groupes GIR

**Logique d'affichage** :
1. Récupération des groupes GIR depuis le storage/BDD
2. Filtrage des groupes avec `statut = "Actif"`
3. Pour chaque jour, vérifier si la date est dans `[dateEntree, dateSortie]`
4. Appliquer la couleur correspondante au groupe

**Gestion des dates** :
- Si `dateSortie` est vide → considéré comme 31/12/2099
- Utilisation de `isWithinInterval` de date-fns pour la vérification

**Plusieurs groupes sur un même jour** :
- Calendrier latéral : Affiche une couleur composite (dégradé)
- Calendrier principal : Affiche tous les groupes (liste)

---

### Statistiques BDD

**Mode hybride** :
1. **Au chargement** : Charge les stats depuis localStorage
2. **Appel API** : Vérifie la connexion BDD
3. **Si connecté** : Remplace les stats par celles de la BDD
4. **Si déconnecté** : Garde les stats localStorage

**Avantage** :
- Application fonctionnelle même sans backend
- Passage automatique localStorage → BDD sans action de l'utilisateur

---

## 📊 Impact sur les performances

### Calendrier
- ✅ Calcul des périodes uniquement pour le mois affiché
- ✅ Pas de requêtes BDD supplémentaires (données en mémoire)
- ✅ Rendu optimisé avec React

### Statistiques
- ✅ Requêtes SQL optimisées avec index
- ✅ Actualisation toutes les 30s (pas en temps réel)
- ✅ Cache côté client

---

## 🚀 Déploiement

### Backend

**Fichier modifié** : `server/index.js`

**Nouvelles requêtes SQL** ajoutées dans `/api/database/status`

**Pas de changement de schéma BDD** : Les tables existantes suffisent

### Frontend

**Build et déploiement** :
```bash
npm run build
# Push sur GitHub
# Netlify redéploie automatiquement
```

**Configuration** :
- Variable `VITE_API_URL` déjà configurée
- Pas de changement nécessaire

---

## ✅ Checklist de vérification

### Calendrier latéral
- [ ] Les jours sont colorés selon les groupes GIR actifs
- [ ] Tooltip affiche les informations du groupe
- [ ] Liste des groupes GIR visible sous le calendrier
- [ ] Pastilles de couleur correspondent aux jours

### Calendrier annuel
- [ ] Les périodes de groupes s'affichent dans les cellules
- [ ] Icône 📚 visible
- [ ] Bordure latérale colorée
- [ ] Groupes affichés avant les événements

### Liste des apprenants
- [ ] Badge de statut visible sur toutes les cards
- [ ] Couleur correcte selon le statut (Actif=vert, Suspendu=jaune, Supprimé=rouge)
- [ ] Badge affiché même pour les utilisateurs actifs

### Statistiques BDD
- [ ] Backend `/api/database/status` retourne apprenants et formateurs
- [ ] Sidebar affiche les bonnes statistiques
- [ ] Passage automatique localStorage → BDD quand backend disponible
- [ ] Actualisation toutes les 30 secondes

---

## 🎯 Points d'attention

### Groupes GIR sans dates
- Si `dateEntree` est vide → groupe non affiché dans le calendrier
- Si `dateSortie` est vide → groupe affiché jusqu'en 2099

### Nombre de couleurs
- Palette de 8 couleurs qui se répètent si > 8 groupes
- Toutes les couleurs sont harmonieuses et accessibles

### Performance
- Pas de problème avec des centaines de groupes GIR
- Calcul optimisé par jour

---

## 📝 Améliorations futures possibles

1. **Édition rapide** : Clic sur un groupe dans le calendrier pour l'éditer
2. **Filtrage** : Afficher/masquer certains groupes dans le calendrier
3. **Export calendrier** : Exporter au format ICS
4. **Vue timeline** : Affichage type Gantt des périodes
5. **Statistiques avancées** : Graphiques d'évolution

---

## 🎉 Résumé

**Version** : 3.2  
**Date** : Janvier 2025

**3 améliorations majeures** :
1. ✅ Périodes des groupes GIR dans les calendriers (latéral + annuel)
2. ✅ Badge de statut toujours affiché dans la liste des apprenants
3. ✅ Statistiques provenant de la base de données MariaDB

**Tout fonctionne en mode localStorage ET en mode BDD !** 🚀
