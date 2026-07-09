// utils/dataHelpers.js

/**
 * Extrait les données d'une réponse API, gérant les objets paginés
 * @param {any} data - Les données brutes de l'API
 * @param {string} key - La clé à chercher (ex: 'expenses', 'users')
 * @returns {Array} - Un tableau de données
 */
export const extractData = (data, key = null) => {
  // Si c'est déjà un tableau
  if (Array.isArray(data)) return data;
  
  // Si c'est null ou undefined
  if (!data || typeof data !== 'object') return [];
  
  // Si c'est un objet avec une propriété paginée
  if (key && data[key] && Array.isArray(data[key])) {
    return data[key];
  }
  
  // Chercher la première propriété qui est un tableau
  const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
  if (firstArrayKey) {
    return data[firstArrayKey];
  }
  
  // Si c'est un objet simple, le convertir en tableau
  if (typeof data === 'object' && !Array.isArray(data)) {
    const values = Object.values(data);
    if (values.length > 0 && values.some(v => v && typeof v === 'object' && v._id)) {
      return values;
    }
  }
  
  return [];
};

/**
 * Vérifie si une réponse API est paginée
 */
export const isPaginated = (data) => {
  return data && typeof data === 'object' && 
         (data.total !== undefined || data.page !== undefined || data.totalPages !== undefined);
};

/**
 * Extrait les métadonnées de pagination
 */
export const getPaginationMeta = (data) => {
  if (!data || typeof data !== 'object') return null;
  return {
    total: data.total || 0,
    page: data.page || 1,
    totalPages: data.totalPages || 1,
    limit: data.limit || 10,
    hasNext: data.page < data.totalPages,
    hasPrev: data.page > 1
  };
};

/**
 * Extrait les données et les métadonnées de pagination
 */
export const extractPaginatedData = (data, key = null) => {
  return {
    data: extractData(data, key),
    pagination: getPaginationMeta(data)
  };
};

/**
 * Gère les erreurs d'API de manière uniforme
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || `Erreur ${error.response.status}`,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Le serveur ne répond pas. Vérifiez votre connexion.',
      data: null
    };
  } else {
    return {
      status: -1,
      message: error.message || 'Une erreur inattendue est survenue.',
      data: null
    };
  }
};

/**
 * Vérifie si une valeur est un tableau et retourne un tableau vide si ce n'est pas le cas
 */
export const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};

/**
 * Formatte une date pour l'affichage
 */
export const formatDate = (date, locale = 'fr-FR') => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Formatte une date et heure
 */
export const formatDateTime = (date, locale = 'fr-FR') => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Formatte un montant en devise
 */
export const formatCurrency = (amount, currency = '€', locale = 'fr-FR') => {
  if (amount === undefined || amount === null) return `0.00 ${currency}`;
  try {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
  } catch {
    return `0.00 ${currency}`;
  }
};

/**
 * Retourne la couleur d'un statut
 */
export const getStatusColor = (status) => {
  const colors = {
    'Approuvée': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Approuvé': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Rejeté': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Payé': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'En attente': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'default': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };
  return colors[status] || colors.default;
};