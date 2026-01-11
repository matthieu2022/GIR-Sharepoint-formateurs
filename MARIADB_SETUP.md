# 🗄️ Guide de Configuration MariaDB

## Installation de MariaDB

### Sur Windows

1. Téléchargez MariaDB depuis : https://mariadb.org/download/
2. Lancez l'installateur
3. Définissez un mot de passe root
4. Terminez l'installation

### Sur Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo mysql_secure_installation
```

### Sur macOS

```bash
brew install mariadb
brew services start mariadb
```

## Configuration de la Base de Données

### 1. Se connecter à MariaDB

```bash
mysql -u root -p
# Entrez votre mot de passe root
```

### 2. Créer la base de données

```sql
CREATE DATABASE academie_tourisme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Créer un utilisateur dédié (Recommandé)

```sql
CREATE USER 'academie_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON academie_tourisme.* TO 'academie_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Configurer l'application

Copiez `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Éditez `.env` :

```env
DB_HOST=localhost
DB_USER=academie_user
DB_PASSWORD=votre_mot_de_passe_securise
DB_NAME=academie_tourisme
PORT=3001
```

## Structure des Tables

Les tables sont créées automatiquement au démarrage du serveur. Voici leur structure :

### Table `users`

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('Apprenant', 'Formateur') NOT NULL,
  groupe VARCHAR(100),
  date_entree DATE,
  date_sortie DATE,
  tp ENUM('RHH', 'RET', 'ALT', 'GH'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table `salles`

```sql
CREATE TABLE salles (
  id VARCHAR(36) PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  capacite INT NOT NULL,
  equipement TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table `events`

```sql
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time_start TIME,
  time_end TIME,
  type ENUM('cours', 'examen', 'evenement') NOT NULL,
  salle VARCHAR(100),
  formateur VARCHAR(255),
  groupe VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Commandes Utiles

### Vérifier la connexion

```bash
mysql -u academie_user -p academie_tourisme
```

### Voir les tables

```sql
USE academie_tourisme;
SHOW TABLES;
```

### Voir le contenu d'une table

```sql
SELECT * FROM users;
SELECT * FROM salles;
SELECT * FROM events;
```

### Sauvegarder la base de données

```bash
mysqldump -u academie_user -p academie_tourisme > backup_$(date +%Y%m%d).sql
```

### Restaurer une sauvegarde

```bash
mysql -u academie_user -p academie_tourisme < backup_20250111.sql
```

## Migration depuis localStorage

Si vous avez des données en localStorage :

1. Exportez vos données (bouton "Exporter" dans l'app)
2. Configurez MariaDB selon ce guide
3. Lancez le backend : `npm run server`
4. Les tables seront créées automatiquement
5. Importez vos données via le bouton "Importer"

## Dépannage

### Erreur : "Access denied"

Vérifiez vos identifiants dans le fichier `.env`

### Erreur : "Can't connect to MySQL server"

1. Vérifiez que MariaDB est démarré :
   ```bash
   # Linux
   sudo systemctl status mariadb
   
   # macOS
   brew services list
   
   # Windows
   # Vérifiez dans Services
   ```

2. Démarrez MariaDB si nécessaire :
   ```bash
   # Linux
   sudo systemctl start mariadb
   
   # macOS
   brew services start mariadb
   ```

### Port 3306 déjà utilisé

MariaDB utilise le port 3306 par défaut. Si ce port est occupé, modifiez le port dans la configuration de MariaDB.

### Réinitialiser le mot de passe root

```bash
sudo mysqladmin -u root password NEWPASSWORD
```

## Accès distant (Production)

Pour permettre l'accès distant à MariaDB :

1. Éditez `/etc/mysql/mariadb.conf.d/50-server.cnf`
2. Changez `bind-address = 127.0.0.1` en `bind-address = 0.0.0.0`
3. Redémarrez MariaDB
4. Créez un utilisateur avec accès distant :

```sql
CREATE USER 'academie_user'@'%' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON academie_tourisme.* TO 'academie_user'@'%';
FLUSH PRIVILEGES;
```

⚠️ **Attention** : Utilisez un mot de passe fort et configurez un firewall !

## Performances

### Index recommandés

```sql
-- Index sur email pour recherche rapide
CREATE INDEX idx_users_email ON users(email);

-- Index sur role pour filtrage
CREATE INDEX idx_users_role ON users(role);

-- Index sur groupe
CREATE INDEX idx_users_groupe ON users(groupe);

-- Index sur date pour le calendrier
CREATE INDEX idx_events_date ON events(date);
```

### Optimisation

```sql
-- Analyser les tables
ANALYZE TABLE users, salles, events;

-- Optimiser les tables
OPTIMIZE TABLE users, salles, events;
```

## Support

Pour plus d'informations sur MariaDB : https://mariadb.org/documentation/

---

**Questions fréquentes**

**Q : Puis-je utiliser MySQL au lieu de MariaDB ?**
R : Oui, MariaDB est un fork de MySQL. L'application fonctionne avec les deux.

**Q : Faut-il absolument utiliser une BDD ?**
R : Non, l'application fonctionne avec localStorage pour les petites installations.

**Q : Comment migrer de localStorage vers MariaDB ?**
R : Exportez vos données, configurez MariaDB, puis importez-les dans l'app connectée à la BDD.
