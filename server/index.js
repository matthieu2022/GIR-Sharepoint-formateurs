import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration BDD MariaDB
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin_gestion_gir',
  password: process.env.DB_PASSWORD || 'Neosphere2021*',
  database: process.env.DB_NAME || 'admin_gestion_gir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialiser la connexion BDD
const initDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Connexion à MariaDB établie');
    console.log(`📊 Base de données: ${dbConfig.database}`);
    
    // Tester la connexion
    const connection = await pool.getConnection();
    console.log('✅ Test de connexion réussi');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur connexion BDD:', error);
    process.exit(1);
  }
};

// =====================================================
// ROUTES USERS
// =====================================================

// GET tous les users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY nom, prenom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET un user
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur GET user:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST créer un user
app.post('/api/users', async (req, res) => {
  try {
    const { 
      nom, prenom, email, role, groupe, dateEntree, dateSortie, tp,
      licenceGlobalExam, etat, ordinateurFournir, ordiPersonnel, 
      adresseO365Creer, motDePasseO365, motDePasseLMS
    } = req.body;
    
    const id = `user_${Date.now()}`;
    
    await pool.query(
      `INSERT INTO users (
        id, nom, prenom, email, role, groupe, date_entree, date_sortie, tp,
        licence_global_exam, etat, ordinateur_fournir, ordi_personnel,
        adresse_o365_creer, mot_de_passe_o365, mot_de_passe_lms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, nom, prenom, email, role, groupe || null, dateEntree || null, 
        dateSortie || null, tp || null, licenceGlobalExam || null, 
        etat || 'Actif', ordinateurFournir || 'oui', ordiPersonnel || null,
        adresseO365Creer || 'non', motDePasseO365 || null, motDePasseLMS || null
      ]
    );
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erreur POST user:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour un user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { 
      nom, prenom, email, role, groupe, dateEntree, dateSortie, tp,
      licenceGlobalExam, etat, ordinateurFournir, ordiPersonnel, 
      adresseO365Creer, motDePasseO365, motDePasseLMS
    } = req.body;
    
    await pool.query(
      `UPDATE users SET 
        nom = ?, prenom = ?, email = ?, role = ?, groupe = ?, 
        date_entree = ?, date_sortie = ?, tp = ?,
        licence_global_exam = ?, etat = ?, ordinateur_fournir = ?, 
        ordi_personnel = ?, adresse_o365_creer = ?,
        mot_de_passe_o365 = ?, mot_de_passe_lms = ?
      WHERE id = ?`,
      [
        nom, prenom, email, role, groupe || null, dateEntree || null, 
        dateSortie || null, tp || null, licenceGlobalExam || null,
        etat || 'Actif', ordinateurFournir || 'oui', ordiPersonnel || null,
        adresseO365Creer || 'non', motDePasseO365 || null, motDePasseLMS || null,
        req.params.id
      ]
    );
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur PUT user:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE supprimer un user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE user:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ROUTES SALLES
// =====================================================

app.get('/api/salles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM salles ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET salles:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/salles', async (req, res) => {
  try {
    const { nom, capacite, equipement, description } = req.body;
    const id = `salle_${Date.now()}`;
    
    await pool.query(
      'INSERT INTO salles (id, nom, capacite, equipement, description) VALUES (?, ?, ?, ?, ?)',
      [id, nom, capacite, equipement || null, description || null]
    );
    
    const [rows] = await pool.query('SELECT * FROM salles WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erreur POST salle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/salles/:id', async (req, res) => {
  try {
    const { nom, capacite, equipement, description } = req.body;
    
    await pool.query(
      'UPDATE salles SET nom = ?, capacite = ?, equipement = ?, description = ? WHERE id = ?',
      [nom, capacite, equipement || null, description || null, req.params.id]
    );
    
    const [rows] = await pool.query('SELECT * FROM salles WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur PUT salle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/salles/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM salles WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE salle:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ROUTES EVENTS
// =====================================================

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET events:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, date, timeStart, timeEnd, type, salle, formateur, groupe, description } = req.body;
    const id = `event_${Date.now()}`;
    
    await pool.query(
      `INSERT INTO events (id, title, date, time_start, time_end, type, salle, formateur, groupe, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, date, timeStart || null, timeEnd || null, type, salle || null, formateur || null, groupe || null, description || null]
    );
    
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erreur POST event:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE event:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ROUTES SHAREPOINT
// =====================================================

app.get('/api/sharepoint', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sharepoint ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET sharepoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sharepoint', async (req, res) => {
  try {
    const { etat, nom, url, description } = req.body;
    const id = `sp_${Date.now()}`;
    
    await pool.query(
      'INSERT INTO sharepoint (id, etat, nom, url, description) VALUES (?, ?, ?, ?, ?)',
      [id, etat || 'Actif', nom, url || null, description || null]
    );
    
    const [rows] = await pool.query('SELECT * FROM sharepoint WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erreur POST sharepoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sharepoint/:id', async (req, res) => {
  try {
    const { etat, nom, url, description } = req.body;
    
    await pool.query(
      'UPDATE sharepoint SET etat = ?, nom = ?, url = ?, description = ? WHERE id = ?',
      [etat || 'Actif', nom, url || null, description || null, req.params.id]
    );
    
    const [rows] = await pool.query('SELECT * FROM sharepoint WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur PUT sharepoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sharepoint/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sharepoint WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE sharepoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ROUTES GROUPES GIR
// =====================================================

app.get('/api/groupes-gir', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM groupes_gir ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET groupes-gir:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/groupes-gir', async (req, res) => {
  try {
    const { nom, dateEntree, dateSortie, statut } = req.body;
    const id = `gir_${Date.now()}`;
    
    await pool.query(
      'INSERT INTO groupes_gir (id, nom, date_entree, date_sortie, statut) VALUES (?, ?, ?, ?, ?)',
      [id, nom, dateEntree || null, dateSortie || null, statut || 'Actif']
    );
    
    const [rows] = await pool.query('SELECT * FROM groupes_gir WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erreur POST groupe-gir:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/groupes-gir/:id', async (req, res) => {
  try {
    const { nom, dateEntree, dateSortie, statut } = req.body;
    
    await pool.query(
      'UPDATE groupes_gir SET nom = ?, date_entree = ?, date_sortie = ?, statut = ? WHERE id = ?',
      [nom, dateEntree || null, dateSortie || null, statut || 'Actif', req.params.id]
    );
    
    const [rows] = await pool.query('SELECT * FROM groupes_gir WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur PUT groupe-gir:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/groupes-gir/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM groupes_gir WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE groupe-gir:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ROUTES NOTES
// =====================================================

app.get('/api/notes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = 1');
    if (rows.length === 0) {
      res.json({ content: '' });
    } else {
      res.json({ content: rows[0].content });
    }
  } catch (error) {
    console.error('Erreur GET notes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { content } = req.body;
    
    await pool.query(
      'INSERT INTO notes (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = ?',
      [content, content]
    );
    
    res.json({ content, success: true });
  } catch (error) {
    console.error('Erreur POST notes:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// Route de test
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: dbConfig.database,
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// Route pour le statut de la BDD (pour la sidebar)
// =====================================================

app.get('/api/database/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Récupérer les statistiques
    const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [sallesCount] = await pool.query('SELECT COUNT(*) as count FROM salles');
    const [eventsCount] = await pool.query('SELECT COUNT(*) as count FROM events');
    const [sharepointCount] = await pool.query('SELECT COUNT(*) as count FROM sharepoint');
    const [groupesGIRCount] = await pool.query('SELECT COUNT(*) as count FROM groupes_gir');
    
    // Récupérer la taille de la BDD
    const [dbSize] = await pool.query(`
      SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
      FROM information_schema.TABLES
      WHERE table_schema = ?
    `, [dbConfig.database]);
    
    // Récupérer la version MySQL/MariaDB
    const [version] = await pool.query('SELECT VERSION() as version');
    
    connection.release();
    
    res.json({
      status: 'connected',
      database: dbConfig.database,
      host: dbConfig.host,
      version: version[0].version,
      size_mb: dbSize[0].size_mb || 0,
      tables: {
        users: usersCount[0].count,
        salles: sallesCount[0].count,
        events: eventsCount[0].count,
        sharepoint: sharepointCount[0].count,
        groupes_gir: groupesGIRCount[0].count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur statut BDD:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Démarrer le serveur
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
    console.log(`📊 Base de données: ${dbConfig.database}`);
    console.log(`🔐 Utilisateur: ${dbConfig.user}`);
    console.log(`✅ Prêt à recevoir des requêtes`);
  });
});
