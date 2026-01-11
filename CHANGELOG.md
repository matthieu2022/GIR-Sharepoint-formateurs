# 📝 Changelog - Modifications

## Version 2.0 - Nouvelles fonctionnalités

### ✨ Ajouts principaux

#### 1. 📊 Listing SharePoint
- Nouvelle page dédiée au listing des sites SharePoint
- Colonnes : État, Nom SharePoint, URL d'accès
- CRUD complet (Ajouter, Modifier, Supprimer)
- États disponibles : Actif, En cours, Suspendu, Archivé
- Accès direct aux sites via liens externes

#### 2. 👤 Profils utilisateurs enrichis
Nouveaux champs ajoutés :
- **Licence Global Exam** : Numéro de licence
- **État** : Actif / Suspendu / Supprimé
- **Ordinateur à fournir** : Oui / Non
  - Si Non → **Ordinateur personnel** : MAC / PC / Chromebook / Autres
- **Adresse Office 365 à créer** : Oui / Non

#### 3. 📅 Sidebar gauche - Calendrier
- Mini calendrier du mois en cours
- Visualisation des événements du jour
- **Liste des groupes actifs** avec nombre de membres
- Navigation mensuelle

#### 4. 📝 Sidebar gauche - Pense-bête
- Zone de notes personnelles
- Sauvegarde automatique
- Parfait pour les rappels et tâches

#### 5. 📊 Sidebar droite - Statistiques
- Statistiques en temps réel :
  - Apprenants actifs
  - Formateurs actifs
  - Nombre de salles
  - Événements planifiés
  - Sites SharePoint actifs
- Accès rapides (personnalisable)

#### 6. 📥📤 Import/Export CSV
- **Export CSV** : Exportez vos utilisateurs en CSV
- **Import CSV** : Importez en masse vos utilisateurs
- **Template CSV téléchargeable** : Fichier exemple pour faciliter l'import
- Format standardisé avec tous les champs

#### 7. 👥 Gestion limitée
Application gérée par 4 personnes :
- Virginie Clément
- Muriel Ambrosino
- Orlane Laurent
- Cyber-technique

---

## 📋 Champs du profil utilisateur (complet)

| Champ | Type | Obligatoire |
|-------|------|-------------|
| Nom | Texte | ✅ |
| Prénom | Texte | ✅ |
| Email | Email | ✅ |
| Rôle | Liste (Apprenant/Formateur) | ✅ |
| Groupe d'appartenance | Liste déroulante | ❌ |
| Date d'entrée | Date | ❌ |
| Date de sortie | Date | ❌ |
| TP | Liste (RHH/RET/ALT/GH) | ❌ |
| Licence Global Exam | Texte | ❌ |
| État | Liste (Actif/Suspendu/Supprimé) | ✅ |
| Ordinateur à fournir | Oui/Non | ❌ |
| Ordinateur personnel | Liste (MAC/PC/Chromebook/Autres) | ❌* |
| Adresse O365 à créer | Oui/Non | ❌ |

*Affiché uniquement si "Ordinateur à fournir" = Non

---

## 🎨 Interface mise à jour

### Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Header + Navigation                   │
├──────────┬──────────────────────────────────┬───────────┤
│          │                                  │           │
│ Calendrier│       Contenu principal         │ Stats     │
│ +        │       (Vue active)              │ +         │
│ Pense-   │                                  │ Accès     │
│ bête     │                                  │ rapides   │
│          │                                  │           │
└──────────┴──────────────────────────────────┴───────────┘
   (Gauche)              (Centre)                (Droite)
```

### Navigation
1. Calendrier
2. Gestion des salles
3. Liste des apprenants
4. **Listing SharePoint** (NOUVEAU)

### Boutons d'action
- Template CSV (télécharger le fichier exemple)
- Export CSV
- Import CSV
- Export JSON
- Import JSON

---

## 📥 Format CSV pour import

Le fichier CSV doit contenir ces colonnes dans l'ordre :

```csv
Nom,Prénom,Email,Rôle,Groupe,Date entrée,Date sortie,TP,Licence Global Exam,État,Ordinateur à fournir,Ordi personnel,Adresse O365 à créer
"Dupont","Jean","jean.dupont@email.com","Apprenant","VTF","2025-01-01","2025-12-31","RHH","GE123456","Actif","oui","","non"
```

**Téléchargez le template** via le bouton "Template CSV" dans l'interface pour avoir un exemple pré-formaté.

---

## 🔄 Compatibilité

- ✅ Toutes les données existantes sont préservées
- ✅ Les nouveaux champs sont optionnels (sauf État = Actif par défaut)
- ✅ Import/Export compatible avec l'ancienne et la nouvelle version

---

## 🚀 Déploiement

L'application est prête à être déployée sur Netlify avec toutes les nouvelles fonctionnalités.

### Mode localStorage (actuel)
Toutes les fonctionnalités fonctionnent immédiatement :
- ✅ Profils enrichis
- ✅ SharePoint
- ✅ Calendrier latéral
- ✅ Pense-bête
- ✅ Import/Export CSV

### Mode MariaDB (futur)
Les tables seront mises à jour automatiquement pour supporter les nouveaux champs.

---

## 📞 Support

Application gérée par :
- Virginie Clément
- Muriel Ambrosino
- Orlane Laurent
- Cyber-technique

Pour toute question, consultez le README.md ou contactez l'équipe.
