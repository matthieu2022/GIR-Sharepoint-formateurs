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
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academie_tourisme',
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
    
    // Créer les tables si elles n'existent pas
    await createTables();
  } catch (error) {
    console.error('❌ Erreur connexion BDD:', error);
  }
};

// Créer les tables
const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Table users
    await connection.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table salles
    await connection.query(`
      CREATE TABLE IF NOT EXISTS salles (
        id VARCHAR(36) PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        capacite INT NOT NULL,
        equipement TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table events
    await connection.query(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables créées ou déjà existantes');
  } finally {
    connection.release();
  }
};

// === ROUTES USERS ===

// GET tous les users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY nom, prenom');
    res.json(rows);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

// POST créer un user
app.post('/api/users', async (req, res) => {
  try {
    const { nom, prenom, email, role, groupe, dateEntree, dateSortie, tp } = req.body;
    const id = `user_${Date.now()}`;
    
    await pool.query(
      'INSERT INTO users (id, nom, prenom, email, role, groupe, date_entree, date_sortie, tp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nom, prenom, email, role, groupe || null, dateEntree || null, dateSortie || null, tp || null]
    );
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour un user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { nom, prenom, email, role, groupe, dateEntree, dateSortie, tp } = req.body;
    
    await pool.query(
      'UPDATE users SET nom = ?, prenom = ?, email = ?, role = ?, groupe = ?, date_entree = ?, date_sortie = ?, tp = ? WHERE id = ?',
      [nom, prenom, email, role, groupe || null, dateEntree || null, dateSortie || null, tp || null, req.params.id]
    );
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE supprimer un user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === ROUTES SALLES ===

app.get('/api/salles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM salles ORDER BY nom');
    res.json(rows);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/salles/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM salles WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === ROUTES EVENTS ===

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, date, timeStart, timeEnd, type, salle, formateur, groupe, description } = req.body;
    const id = `event_${Date.now()}`;
    
    await pool.query(
      'INSERT INTO events (id, title, date, time_start, time_end, type, salle, formateur, groupe, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, date, timeStart || null, timeEnd || null, type, salle || null, formateur || null, groupe || null, description || null]
    );
    
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
});
