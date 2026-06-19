import { baseDestinations as staticDestinations, getDestinationTripDetails as staticTripDetails, getDestinationImage as staticGetImage, regions as staticRegions, budgetMin as staticBudgetMin, budgetMax as staticBudgetMax, sortByCountryAndDuration as staticSort } from './components/destinationData';

const API_BASE = '/api';

const fetchApi = async (url) => {
  try {
    const res = await fetch(`${API_BASE}${url}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const getDestinations = async (type) => {
  const data = await fetchApi(`/destinations${type ? `?type=${type}` : ''}`);
  if (data && data.length > 0) {
    return data.map((d, i) => ({
      ...d,
      key: `dest-${d._id || i}`,
      image: d.mainImage || d.cardImage,
      title: d.title || d.name,
      priceValue: d.priceValue || 0,
      description: d.description || '',
      itinerary: d.itinerary || [],
      source: 'api',
    }));
  }
  return staticDestinations.map((d, i) => ({
    ...d,
    key: `base-${i}`,
    reviewIndex: i,
    source: 'static',
  }));
};

export const getTrendingDestinations = async () => {
  const all = await getDestinations();
  const featuredRegions = ['Indonesia', 'Singapore', 'Dubai', 'Bhutan', 'Nepal', 'Trek'];
  const labels = ['Popular', 'Hot Deal', 'Popular', 'Cultural', 'Hot Deal', 'Popular'];
  return featuredRegions.map((region, index) => {
    const dest = all.find((d) => d.region === region);
    return dest ? { ...dest, label: labels[index], featured: index === 2 } : null;
  }).filter(Boolean);
};

export const getChooseDestinations = async () => {
  const all = await getDestinations();
  const choiceRegions = ['Vietnam', 'Thailand', 'Singapore', 'Dubai', 'Bhutan', 'Nepal'];
  const labels = ['Popular', 'Hot Deal', 'Cultural', 'Popular', 'Hot Deal', 'Cultural'];
  const countryLevel = new Set(['Vietnam', 'Nepal']);
  return choiceRegions.map((region, index) => {
    const dest = all.find((d) => d.region === region);
    return dest ? {
      ...dest,
      title: countryLevel.has(region) ? region : dest.title,
      duration: countryLevel.has(region) ? '' : dest.duration,
      price: countryLevel.has(region) ? '' : dest.price,
      isCountryLevel: countryLevel.has(region),
      label: labels[index],
    } : null;
  }).filter(Boolean);
};

export const getStories = async () => {
  const data = await fetchApi('/stories');
  if (data && data.length > 0) {
    return data.map((s) => ({
      id: s._id,
      title: s.title,
      date: s.date || '',
      price: s.price || '',
      description: s.description || '',
      image: s.image,
      stats: s.stats?.length ? s.stats : [
        { label: 'Travelers', value: '2 Adults' },
        { label: 'Stay', value: '7 Days' },
        { label: 'Status', value: 'Completed' },
      ],
      source: 'api',
    }));
  }
  return null;
};

export const getGallery = async () => {
  const data = await fetchApi('/gallery');
  if (data && data.length > 0) {
    return data.map((g) => ({
      image: g.image,
      title: g.title,
      category: g.category,
    }));
  }
  return null;
};

export const getHomeContent = async () => {
  const data = await fetchApi('/home');
  return data || null;
};

export const getAboutContent = async () => {
  const data = await fetchApi('/about');
  return data || null;
};

export const getContactContent = async () => {
  const data = await fetchApi('/contact');
  return data || null;
};

export const getComments = async (rating) => {
  const data = await fetchApi(`/comments${rating ? `?rating=${rating}` : ''}`);
  return data || null;
};

export { staticDestinations, staticGetImage, staticRegions, staticBudgetMin, staticBudgetMax, staticSort, staticTripDetails };
