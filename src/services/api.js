// Service API pour communiquer avec le backend MariaDB
// Remplace le localStorage par des appels HTTP

// URL de l'API backend - À configurer selon votre environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur API');
  }
  return response.json();
};

// =====================================================
// USERS
// =====================================================

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return handleResponse(response);
};

export const getUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  return handleResponse(response);
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// =====================================================
// SALLES
// =====================================================

export const getSalles = async () => {
  const response = await fetch(`${API_URL}/salles`);
  return handleResponse(response);
};

export const createSalle = async (salleData) => {
  const response = await fetch(`${API_URL}/salles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(salleData),
  });
  return handleResponse(response);
};

export const updateSalle = async (id, salleData) => {
  const response = await fetch(`${API_URL}/salles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(salleData),
  });
  return handleResponse(response);
};

export const deleteSalle = async (id) => {
  const response = await fetch(`${API_URL}/salles/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// =====================================================
// EVENTS
// =====================================================

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  return handleResponse(response);
};

export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  return handleResponse(response);
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// =====================================================
// SHAREPOINT
// =====================================================

export const getSharePointSites = async () => {
  const response = await fetch(`${API_URL}/sharepoint`);
  return handleResponse(response);
};

export const createSharePointSite = async (siteData) => {
  const response = await fetch(`${API_URL}/sharepoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(siteData),
  });
  return handleResponse(response);
};

export const updateSharePointSite = async (id, siteData) => {
  const response = await fetch(`${API_URL}/sharepoint/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(siteData),
  });
  return handleResponse(response);
};

export const deleteSharePointSite = async (id) => {
  const response = await fetch(`${API_URL}/sharepoint/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// =====================================================
// GROUPES GIR
// =====================================================

export const getGroupesGIR = async () => {
  const response = await fetch(`${API_URL}/groupes-gir`);
  return handleResponse(response);
};

export const createGroupeGIR = async (groupeData) => {
  const response = await fetch(`${API_URL}/groupes-gir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupeData),
  });
  return handleResponse(response);
};

export const updateGroupeGIR = async (id, groupeData) => {
  const response = await fetch(`${API_URL}/groupes-gir/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupeData),
  });
  return handleResponse(response);
};

export const deleteGroupeGIR = async (id) => {
  const response = await fetch(`${API_URL}/groupes-gir/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// =====================================================
// NOTES
// =====================================================

export const getNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  return handleResponse(response);
};

export const saveNotes = async (content) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
};

// =====================================================
// EXPORT / IMPORT (conservé pour compatibilité)
// =====================================================

export const exportData = async () => {
  const [users, salles, events] = await Promise.all([
    getUsers(),
    getSalles(),
    getEvents(),
  ]);
  return { users, salles, events };
};

export const importData = async (data) => {
  // Cette fonction peut être implémentée si nécessaire
  // Pour l'instant, on utilisera l'import CSV côté client
  console.log('Import via CSV recommandé');
};
