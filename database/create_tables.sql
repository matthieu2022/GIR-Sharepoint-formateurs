-- =====================================================
-- Base de données : admin_gestion_gir
-- Application : Académie du Tourisme - Gestion GIR
-- Version : 2.2
-- =====================================================

-- Utiliser la base de données
USE admin_gestion_gir;

-- =====================================================
-- Table : users
-- Stocke les apprenants et formateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('Apprenant', 'Formateur') NOT NULL,
    groupe VARCHAR(100),
    date_entree DATE,
    date_sortie DATE,
    tp ENUM('RHH', 'RET', 'ALT', 'GH'),
    licence_global_exam VARCHAR(255),
    etat ENUM('Actif', 'Suspendu', 'Supprimé') NOT NULL DEFAULT 'Actif',
    ordinateur_fournir ENUM('oui', 'non') DEFAULT 'oui',
    ordi_personnel ENUM('MAC', 'PC', 'Chromebook', 'Autres'),
    adresse_o365_creer ENUM('oui', 'non') DEFAULT 'non',
    mot_de_passe_o365 VARCHAR(255),
    mot_de_passe_lms VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_groupe (groupe),
    INDEX idx_etat (etat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table : salles
-- Stocke les salles du site du Rayolet
-- =====================================================
CREATE TABLE IF NOT EXISTS salles (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL,
    equipement TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table : events
-- Stocke les événements du calendrier
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_groupe (groupe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table : sharepoint
-- Stocke les sites SharePoint
-- =====================================================
CREATE TABLE IF NOT EXISTS sharepoint (
    id VARCHAR(36) PRIMARY KEY,
    etat ENUM('Actif', 'En cours', 'Suspendu', 'Archivé') NOT NULL DEFAULT 'Actif',
    nom VARCHAR(255) NOT NULL,
    url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_etat (etat),
    INDEX idx_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table : groupes_gir
-- Stocke les groupes GIR
-- =====================================================
CREATE TABLE IF NOT EXISTS groupes_gir (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date_entree DATE,
    date_sortie DATE,
    statut ENUM('Actif', 'Suspendu', 'Supprimé') NOT NULL DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nom (nom),
    INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table : notes
-- Stocke les notes du pense-bête
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content LONGTEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer une ligne vide pour les notes si elle n'existe pas
INSERT INTO notes (id, content) 
SELECT 1, '' 
WHERE NOT EXISTS (SELECT 1 FROM notes WHERE id = 1);

-- =====================================================
-- Insertion de données de test (OPTIONNEL)
-- Décommentez si vous voulez des données d'exemple
-- =====================================================

/*
-- Utilisateurs de test
INSERT INTO users (id, nom, prenom, email, role, groupe, date_entree, date_sortie, tp, etat) VALUES
('user_001', 'Dupont', 'Jean', 'jean.dupont@academie.fr', 'Apprenant', 'VTF', '2025-01-01', '2025-12-31', 'RHH', 'Actif'),
('user_002', 'Martin', 'Sophie', 'sophie.martin@academie.fr', 'Formateur', NULL, '2024-09-01', NULL, NULL, 'Actif'),
('user_003', 'Bernard', 'Luc', 'luc.bernard@academie.fr', 'Apprenant', 'AC', '2025-01-15', '2025-12-31', 'RET', 'Actif');

-- Salles de test
INSERT INTO salles (id, nom, capacite, equipement, description) VALUES
('salle_001', 'Salle Rayolet 1', 20, 'Vidéoprojecteur, Tableau blanc', 'Salle principale'),
('salle_002', 'Salle Rayolet 2', 15, 'Ordinateurs, Vidéoprojecteur', 'Salle informatique'),
('salle_003', 'Amphithéâtre Rayolet', 50, 'Vidéoprojecteur, Sonorisation', 'Amphithéâtre');

-- Groupes GIR de test
INSERT INTO groupes_gir (id, nom, date_entree, date_sortie, statut) VALUES
('gir_001', 'GIR RHH5', '2025-01-01', '2025-12-31', 'Actif'),
('gir_002', 'GIR RET3', '2024-09-01', '2025-06-30', 'Actif');

-- Sites SharePoint de test
INSERT INTO sharepoint (id, etat, nom, url, description) VALUES
('sp_001', 'Actif', 'SH | ALT VTF', 'https://sharepoint.com/site1', 'SharePoint pour le groupe VTF'),
('sp_002', 'Actif', 'SH | RHH AC', 'https://sharepoint.com/site2', 'SharePoint pour le groupe AC');
*/

-- =====================================================
-- Vérification des tables créées
-- =====================================================
SHOW TABLES;

-- =====================================================
-- Afficher la structure de chaque table
-- =====================================================
-- DESCRIBE users;
-- DESCRIBE salles;
-- DESCRIBE events;
-- DESCRIBE sharepoint;
-- DESCRIBE groupes_gir;
-- DESCRIBE notes;
