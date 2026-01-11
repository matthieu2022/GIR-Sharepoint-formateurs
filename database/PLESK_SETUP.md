# 🗄️ Guide de Configuration MariaDB sur Plesk

## 📋 Étape 1 : Créer la base de données dans Plesk

### Via l'interface Plesk

1. **Connectez-vous à Plesk**
   - URL : https://votre-domaine.com:8443

2. **Accédez aux bases de données**
   - Cliquez sur "Bases de données" dans le menu
   - Ou allez dans : Domaines > Votre domaine > Bases de données

3. **Créer une nouvelle base de données**
   - Cliquez sur "Ajouter une base de données"
   - **Nom de la base** : `academie_tourisme`
   - Notez le nom complet (peut être préfixé, ex: `nomuser_academie_tourisme`)

4. **Créer un utilisateur de base de données**
   - **Nom d'utilisateur** : `academie_user` (ou votre choix)
   - **Mot de passe** : Générez un mot de passe fort
   - ⚠️ **NOTEZ CES INFORMATIONS** (vous en aurez besoin)

5. **Permissions**
   - Donnez tous les privilèges à cet utilisateur sur cette base
   - Cochez : SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER

---

## 📋 Étape 2 : Importer le script SQL

### Méthode 1 : Via phpMyAdmin (Recommandé)

1. **Ouvrir phpMyAdmin**
   - Dans Plesk, cliquez sur "phpMyAdmin" à côté de votre base
   - Ou accédez via : Bases de données > Gestion Web de BD

2. **Sélectionner votre base**
   - Dans le menu de gauche, cliquez sur `academie_tourisme`

3. **Importer le script**
   - Cliquez sur l'onglet "SQL" en haut
   - Copiez-collez le contenu de `create_tables.sql`
   - Cliquez sur "Exécuter"

4. **Vérification**
   - Vous devriez voir 6 tables créées :
     - ✅ users
     - ✅ salles
     - ✅ events
     - ✅ sharepoint_sites
     - ✅ groupes_gir
     - ✅ notes

### Méthode 2 : Via SSH (Pour utilisateurs avancés)

```bash
# Se connecter en SSH à votre serveur
ssh votre-user@votre-domaine.com

# Importer le script
mysql -u academie_user -p academie_tourisme < create_tables.sql

# Entrez le mot de passe quand demandé
```

---

## 📋 Étape 3 : Récupérer les informations de connexion

Notez ces informations (vous en aurez besoin pour configurer l'application) :

```
Base de données : academie_tourisme (ou nomuser_academie_tourisme)
Utilisateur     : academie_user (ou nomuser_academie_user)
Mot de passe    : [votre mot de passe]
Hôte            : localhost OU 127.0.0.1 OU votre-domaine.com
Port            : 3306 (par défaut)
```

### Comment trouver l'hôte ?

**Dans la plupart des cas :**
- Si votre application et la BDD sont sur le **même serveur Plesk** : `localhost`
- Si l'application est ailleurs : `votre-domaine.com` ou l'IP du serveur

**Pour vérifier dans Plesk :**
1. Allez dans Bases de données
2. Cliquez sur votre base de données
3. Regardez "Serveur de base de données" ou "Hôte"

---

## 📋 Étape 4 : Tester la connexion

### Via phpMyAdmin

1. Ouvrez phpMyAdmin
2. Sélectionnez votre base `academie_tourisme`
3. Cliquez sur "Structure"
4. Vous devriez voir les 6 tables

### Via une requête de test

Dans phpMyAdmin, onglet SQL, exécutez :

```sql
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'academie_tourisme';
```

**Résultat attendu** : `total_tables: 6`

---

## 📋 Étape 5 : Configuration de l'application

Une fois les tables créées, donnez-moi ces informations :

```env
DB_HOST=localhost (ou votre-domaine.com)
DB_USER=academie_user
DB_PASSWORD=votre_mot_de_passe
DB_NAME=academie_tourisme
DB_PORT=3306
```

Je mettrai à jour le fichier `.env` et le backend pour vous.

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Mot de passe fort**
   - Au moins 16 caractères
   - Mélange de lettres, chiffres, symboles
   - Généré aléatoirement

2. **Utilisateur dédié**
   - Ne jamais utiliser `root`
   - Un utilisateur par application

3. **Permissions minimales**
   - Uniquement les droits nécessaires
   - SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER

4. **Accès distant** (si nécessaire)
   - Dans Plesk : Bases de données > Serveurs de BD
   - Autoriser uniquement les IP nécessaires
   - Par défaut : localhost uniquement

---

## 🛠️ Dépannage

### Erreur : "Access denied"

**Causes possibles :**
- Mauvais mot de passe
- Mauvais nom d'utilisateur
- Utilisateur n'a pas les permissions

**Solution :**
1. Vérifiez les identifiants dans Plesk
2. Réinitialisez le mot de passe si nécessaire
3. Vérifiez les permissions de l'utilisateur

### Erreur : "Unknown database"

**Cause :** Nom de base de données incorrect

**Solution :**
- Vérifiez le nom exact dans Plesk (peut avoir un préfixe)
- Exemple : `moncompte_academie_tourisme`

### Erreur : "Can't connect to MySQL server"

**Causes possibles :**
- Mauvais hôte
- Port fermé
- Service MySQL arrêté

**Solution :**
1. Vérifiez que MySQL/MariaDB est démarré dans Plesk
2. Vérifiez l'hôte (localhost vs IP vs domaine)
3. Vérifiez le port (généralement 3306)

### Tables non créées

**Solution :**
1. Vérifiez que vous avez sélectionné la bonne base de données
2. Vérifiez que l'utilisateur a les droits CREATE
3. Consultez les erreurs dans phpMyAdmin

---

## 📊 Structure des tables créées

### Table : users
- **Champs principaux** : nom, prenom, email, role, groupe
- **Nouveaux champs** : mot_de_passe_o365, mot_de_passe_lms
- **Index** : email, role, groupe, etat

### Table : salles
- **Champs** : nom, capacite, equipement, description

### Table : events
- **Champs** : title, date, time_start, time_end, type, salle, formateur
- **Index** : date, type, groupe

### Table : sharepoint_sites
- **Champs** : etat, nom, url, description
- **Index** : etat, nom

### Table : groupes_gir
- **Champs** : nom, date_entree, date_sortie, statut
- **Index** : nom, statut

### Table : notes
- **Champs** : content (pense-bête)

---

## 🎯 Prochaines étapes

Une fois les tables créées et testées :

1. **Donnez-moi vos informations de connexion** :
   ```
   DB_HOST=?
   DB_USER=?
   DB_PASSWORD=?
   DB_NAME=?
   DB_PORT=?
   ```

2. **Je mettrai à jour** :
   - Le fichier `.env`
   - Le backend Node.js
   - Les routes API

3. **Vous pourrez** :
   - Héberger le backend sur votre Plesk
   - Connecter le frontend au backend
   - Avoir une vraie persistance des données
   - Multi-utilisateurs synchronisés

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de Plesk
2. Consultez les erreurs dans phpMyAdmin
3. Vérifiez les permissions de l'utilisateur

---

**Prêt à configurer ?** 

Donnez-moi vos informations de connexion et je configure tout le reste ! 🚀
