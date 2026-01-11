// Service de stockage des données
// Pour l'instant utilise localStorage, prêt pour migration vers API/MariaDB

const STORAGE_KEYS = {
  USERS: 'academie_users',
  SALLES: 'academie_salles',
  EVENTS: 'academie_events',
};

// Initialiser les données par défaut
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALLES)) {
    localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify([
      { id: '1', nom: 'Salle 1', capacite: 20, equipement: 'Vidéoprojecteur, Tableau' },
      { id: '2', nom: 'Salle 2', capacite: 15, equipement: 'Ordinateurs, Vidéoprojecteur' },
      { id: '3', nom: 'Salle 3', capacite: 30, equipement: 'Amphithéâtre' },
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
  }
};

// === USERS ===
export const getUsers = () => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return JSON.parse(data || '[]');
};

export const getUser = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const createUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUser = (id, userData) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const deleteUser = (id) => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  return true;
};

// === SALLES ===
export const getSalles = () => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.SALLES);
  return JSON.parse(data || '[]');
};

export const getSalle = (id) => {
  const salles = getSalles();
  return salles.find(s => s.id === id);
};

export const createSalle = (salleData) => {
  const salles = getSalles();
  const newSalle = {
    id: Date.now().toString(),
    ...salleData,
    createdAt: new Date().toISOString(),
  };
  salles.push(newSalle);
  localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify(salles));
  return newSalle;
};

export const updateSalle = (id, salleData) => {
  const salles = getSalles();
  const index = salles.findIndex(s => s.id === id);
  if (index !== -1) {
    salles[index] = { ...salles[index], ...salleData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify(salles));
    return salles[index];
  }
  return null;
};

export const deleteSalle = (id) => {
  const salles = getSalles();
  const filtered = salles.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify(filtered));
  return true;
};

// === EVENTS ===
export const getEvents = () => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return JSON.parse(data || '[]');
};

export const createEvent = (eventData) => {
  const events = getEvents();
  const newEvent = {
    id: Date.now().toString(),
    ...eventData,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  return newEvent;
};

export const updateEvent = (id, eventData) => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...eventData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[index];
  }
  return null;
};

export const deleteEvent = (id) => {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
  return true;
};

// Exporter toutes les données
export const exportData = () => {
  return {
    users: getUsers(),
    salles: getSalles(),
    events: getEvents(),
    exportedAt: new Date().toISOString(),
  };
};

// Importer toutes les données
export const importData = (data) => {
  if (data.users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
  }
  if (data.salles) {
    localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify(data.salles));
  }
  if (data.events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
  }
};
