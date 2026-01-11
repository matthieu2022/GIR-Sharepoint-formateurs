# 🔐 Mise à jour v2.1 - Champs de mots de passe

## ✅ Nouveaux champs ajoutés

### Profil utilisateur enrichi

Deux nouveaux champs ont été ajoutés au profil utilisateur :

1. **Mot de passe Office 365**
   - Champ de type password (masqué par défaut)
   - Accessible uniquement aux 4 administrateurs
   - Affiché dans les cards Kanban avec bouton œil pour révéler/masquer

2. **Mot de passe LMS ADT**
   - Champ de type password (masqué par défaut)
   - Accessible uniquement aux 4 administrateurs
   - Affiché dans les cards Kanban avec bouton œil pour révéler/masquer

## 🎨 Interface

### Formulaire d'édition

Les deux champs apparaissent dans le formulaire utilisateur avec :
- Type `password` pour masquer la saisie
- Placeholder informatif
- ⚠️ Avertissement de sécurité visible

### Vue Kanban

Dans les cards utilisateur :
- Mots de passe masqués par défaut (`••••••••`)
- Boutons œil (👁️) pour révéler/masquer
- Fond jaune clair pour indiquer l'information sensible
- Labels clairs : "MdP O365" et "MdP LMS"

**Exemple de card avec mots de passe** :

```
┌─────────────────────────────────┐
│ Jean Dupont                   ✏️🗑️│
│ 📧 jean.dupont@email.com         │
│                                  │
│ [VTF] [RHH]                      │
│ 📅 Du 2025-01-01 au 2025-12-31   │
│                                  │
│ ─────────────────────────────    │
│ MdP O365: •••••••• 👁️           │
│ MdP LMS:  •••••••• 👁️           │
└─────────────────────────────────┘
```

## 📥 Import/Export CSV

### Export CSV

Le fichier CSV exporté inclut maintenant :
- Colonne 14 : **Mot de passe O365**
- Colonne 15 : **Mot de passe LMS**

⚠️ **Alerte de sécurité** : Un message d'avertissement s'affiche lors de l'export :
> "ATTENTION : Ce fichier contient des mots de passe. À manipuler avec précaution !"

### Template CSV

Le template téléchargeable inclut des exemples :
```csv
..., "MotDePasse123!", "LMS_Pass456!"
```

### Import CSV

L'import CSV :
- Lit les colonnes 14 et 15
- Stocke les mots de passe de manière sécurisée
- Affiche un message confirmant l'import sécurisé

## 🔒 Sécurité

### Niveau actuel (localStorage)

- ✅ Mots de passe masqués dans l'interface
- ✅ Bouton révéler/masquer
- ✅ Stockage en localStorage (navigateur)
- ⚠️ Accessibles à toute personne ayant accès au navigateur

### Recommandations

Pour une sécurité accrue en production :

1. **Utiliser MariaDB** plutôt que localStorage
2. **Chiffrer les mots de passe** dans la base de données
3. **Ajouter une authentification** pour limiter l'accès
4. **Activer HTTPS** sur Netlify (gratuit et automatique)
5. **Utiliser un gestionnaire de secrets** (ex: HashiCorp Vault)

## 👥 Accès aux mots de passe

**Réservé aux 4 administrateurs** :
- Virginie Clément
- Muriel Ambrosino
- Orlane Laurent
- Cyber-technique

**Note** : Actuellement, il n'y a pas de système de connexion. Toute personne ayant accès à l'application peut voir les mots de passe. Pour restreindre l'accès, il faudrait implémenter :
- Page de connexion
- Système d'authentification
- Gestion des rôles et permissions

## 📊 Structure complète d'un utilisateur

```javascript
{
  // Informations de base
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "role": "Apprenant",
  
  // Académique
  "groupe": "VTF",
  "dateEntree": "2025-01-01",
  "dateSortie": "2025-12-31",
  "tp": "RHH",
  
  // Licences et état
  "licenceGlobalExam": "GE123456",
  "etat": "Actif",
  
  // Matériel
  "ordinateurFournir": "oui",
  "ordiPersonnel": "",
  "adresseO365Creer": "non",
  
  // 🔐 NOUVEAUX CHAMPS - Mots de passe
  "motDePasseO365": "MotDePasse123!",
  "motDePasseLMS": "LMS_Pass456!"
}
```

## 🔄 Compatibilité

- ✅ Rétrocompatible avec les données existantes
- ✅ Champs optionnels (peuvent être vides)
- ✅ Import/Export CSV compatible
- ✅ Fonctionnement identique si champs vides

## 📝 Utilisation

### Ajouter/Modifier un utilisateur

1. Ouvrir le formulaire utilisateur
2. Remplir les champs habituels
3. Descendre jusqu'aux nouveaux champs :
   - **Mot de passe Office 365**
   - **Mot de passe LMS ADT**
4. Saisir les mots de passe (ou laisser vide)
5. Enregistrer

### Voir un mot de passe dans la vue Kanban

1. Localiser la card de l'utilisateur
2. Si des mots de passe sont renseignés, ils apparaissent en bas de la card
3. Cliquer sur l'icône œil 👁️ pour révéler
4. Cliquer à nouveau pour masquer

### Exporter les mots de passe

1. Cliquer sur "Export CSV"
2. ⚠️ Lire l'avertissement de sécurité
3. Le fichier CSV contient tous les mots de passe
4. **Sécuriser le fichier** (ne pas l'envoyer par email, le stocker de manière sécurisée)

## ⚠️ Avertissements de sécurité

### Risques actuels

1. **localStorage** : Les mots de passe sont stockés en clair dans le navigateur
2. **Pas d'authentification** : Toute personne accédant à l'URL peut voir les données
3. **Export CSV** : Fichier en texte clair avec tous les mots de passe

### Bonnes pratiques

1. ✅ Ne pas partager l'URL publique de l'application
2. ✅ Sécuriser les fichiers CSV exportés
3. ✅ Ne pas envoyer les mots de passe par email/chat
4. ✅ Utiliser des mots de passe forts et uniques
5. ✅ Changer régulièrement les mots de passe

### Recommandation pour production

Pour une version production avec vraie sécurité :

```bash
# 1. Activer MariaDB (plutôt que localStorage)
# 2. Chiffrer les mots de passe dans la BDD
# 3. Ajouter une page de connexion
# 4. Implémenter les permissions par rôle
# 5. Activer le HTTPS (automatique sur Netlify)
# 6. Audit de sécurité régulier
```

## 🚀 Déploiement

L'application est prête à être déployée avec ces nouvelles fonctionnalités.

**Rappel** : Une fois déployé sur Netlify avec HTTPS, la connexion est sécurisée, mais les données restent accessibles à toute personne connaissant l'URL.

---

## 📞 Support

Pour toute question sur la sécurité ou les mots de passe :
- Virginie Clément
- Muriel Ambrosino
- Orlane Laurent
- Cyber-technique

---

**Version** : 2.1  
**Date** : Janvier 2025  
**Nouveaux champs** : Mot de passe O365 + Mot de passe LMS ADT
