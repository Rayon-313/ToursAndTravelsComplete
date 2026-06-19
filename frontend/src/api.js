const API_BASE = '/api';

const getToken = () => localStorage.getItem('adminToken');

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message);
  }
  return res.json();
};

export const getAssetUrl = (path) => path || '';

export const api = {
  // Auth
  login: (username, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(handleResponse),

  verifyToken: () =>
    fetch(`${API_BASE}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Home
  getHome: () =>
    fetch(`${API_BASE}/home`).then(handleResponse),
  updateHome: (data) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    return fetch(`${API_BASE}/home`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(handleResponse);
  },

  // Destinations
  getDestinations: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const data = await fetch(`${API_BASE}/destinations${q ? '?' + q : ''}`).then(handleResponse);
    return (data || []).map((d) => ({
      ...d,
      title: d.title || d.name,
      priceValue: d.priceValue || 0,
      description: d.description || '',
      itinerary: d.itinerary || [],
    }));
  },
  getAllDestinations: () =>
    fetch(`${API_BASE}/destinations/all`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),
  getDestination: (id) =>
    fetch(`${API_BASE}/destinations/${id}`).then(handleResponse),
  createDestination: (data, mainImage, cardImage) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (mainImage) fd.append('mainImage', mainImage);
    if (cardImage) fd.append('cardImage', cardImage);
    return fetch(`${API_BASE}/destinations`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  updateDestination: (id, data, mainImage, cardImage) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (mainImage) fd.append('mainImage', mainImage);
    if (cardImage) fd.append('cardImage', cardImage);
    return fetch(`${API_BASE}/destinations/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  deleteDestination: (id) =>
    fetch(`${API_BASE}/destinations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Stories
  getStories: () => fetch(`${API_BASE}/stories`).then(handleResponse),
  createStory: (data, image) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (image) fd.append('image', image);
    return fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  updateStory: (id, data, image) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (image) fd.append('image', image);
    return fetch(`${API_BASE}/stories/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  deleteStory: (id) =>
    fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Gallery
  getGallery: () => fetch(`${API_BASE}/gallery`).then(handleResponse),
  createGalleryItem: (data, image) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (image) fd.append('image', image);
    return fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  updateGalleryItem: (id, data, image) => {
    const fd = new FormData();
    fd.append('data', JSON.stringify(data));
    if (image) fd.append('image', image);
    return fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: fd,
    }).then(handleResponse);
  },
  deleteGalleryItem: (id) =>
    fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Filters
  getFilters: () => fetch(`${API_BASE}/filters`).then(handleResponse),
  createFilter: (data) =>
    fetch(`${API_BASE}/filters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateFilter: (id, data) =>
    fetch(`${API_BASE}/filters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteFilter: (id) =>
    fetch(`${API_BASE}/filters/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // About
  getAbout: () => fetch(`${API_BASE}/about`).then(handleResponse),
  updateAbout: (data) =>
    fetch(`${API_BASE}/about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Contact
  getContact: () => fetch(`${API_BASE}/contact`).then(handleResponse),
  updateContact: (data) =>
    fetch(`${API_BASE}/contact`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
