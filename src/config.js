// Point de configuration unique : toutes les URL de l'API passent par ici.
// En developpement, /banque est relaye vers le backend Spring par le serveur Vite.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/banque';

// Chemins relatifs : ils sont concatenees au baseURL de l'instance axios.
export const CHEMINS = {
  comptes: '/comptes',
  statistiques: '/comptes/statistiques'
};

// Les trois categories exposees par l'API, avec leur libelle lisible.
export const TYPES_COMPTE = [
  { valeur: 'COURANT', libelle: 'Courant' },
  { valeur: 'EPARGNE', libelle: 'Epargne' },
  { valeur: 'PROFESSIONNEL', libelle: 'Professionnel' }
];

export default API_BASE_URL;