# 🚀 Guide de Démarrage Rapide

## ⚡ Démarrage en 3 minutes (Mode localStorage)

```bash
# 1. Décompresser
tar -xzf academie-app.tar.gz
cd academie-app

# 2. Installer
npm install

# 3. Lancer
npm run dev

# ✅ Ouvrir http://localhost:5173
```

**C'est tout !** Les données sont stockées dans votre navigateur (localStorage).

---

## 🗄️ Démarrage avec BDD MariaDB (Mode Production)

### Prérequis
- MariaDB installé

### Étapes

```bash
# 1. Décompresser et installer
tar -xzf academie-app.tar.gz
cd academie-app
npm install

# 2. Créer la base de données
mysql -u root -p
```

```sql
CREATE DATABASE academie_tourisme;
CREATE USER 'academie_user'@'localhost' IDENTIFIED BY 'MOT_DE_PASSE';
GRANT ALL PRIVILEGES ON academie_tourisme.* TO 'academie_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 3. Configurer l'application
cp .env.example .env
# Éditer .env avec vos paramètres

# 4. Lancer le backend
npm run server

# 5. Dans un autre terminal, lancer le frontend
npm run dev

# ✅ Application sur http://localhost:5173
# ✅ API sur http://localhost:3001
```

---

## 📋 Ce qu'il faut savoir

### Mode localStorage ✅
- Fonctionne immédiatement
- Données dans le navigateur
- Parfait pour tester
- Pas de configuration

### Mode MariaDB ✅
- Persistance des données
- Multi-utilisateurs
- Production
- Nécessite configuration

---

## 🎯 Prochaines étapes

1. **Tester l'application**
   - Ajouter des utilisateurs
   - Créer des événements
   - Gérer les salles

2. **Personnaliser**
   - Modifier les groupes (voir README.md)
   - Ajouter votre logo
   - Ajuster les couleurs si besoin

3. **Configurer la BDD** (optionnel)
   - Voir MARIADB_SETUP.md pour le guide complet

---

## 📚 Documentation

- **README.md** - Documentation complète
- **MARIADB_SETUP.md** - Configuration BDD détaillée

---

## ❓ Problèmes fréquents

### Port 5173 déjà utilisé
L'application utilisera automatiquement un autre port (5174, etc.)

### npm install échoue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Connexion BDD échoue
Vérifiez le fichier `.env` et que MariaDB est démarré

---

## 🎉 Bon démarrage !

L'application est prête à l'emploi. Commencez avec le mode localStorage, puis migrez vers MariaDB quand vous êtes prêt.

**Support** : Consultez README.md pour toutes les fonctionnalités
