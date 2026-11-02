import axios from 'axios';
import API_BASE_URL from '../config';

// Instance partagee : une seule origine, donc un seul endroit a faire evoluer
// quand l'API change d'environnement.
const clientHttp = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Transforme une erreur axios en message lisible pour l'utilisateur.
export function messageDErreur(erreur) {
  if (erreur.response) {
    const corps = erreur.response.data;
    if (corps && typeof corps === 'object') {
      if (corps.message) return `${corps.message} (${corps.code || erreur.response.status})`;
      if (corps.erreur) return `${corps.erreur} (${erreur.response.status})`;
    }
    return `Le serveur a repondu ${erreur.response.status}`;
  }
  if (erreur.request) return "Le serveur est injoignable. L'API est-elle demarree sur le port 8082 ?";
  return erreur.message || 'Erreur inconnue';
}

// Petit delai retire : le serveur repond en quelques millisecondes en local.
clientHttp.interceptors.response.use(
  (reponse) => reponse,
  (erreur) => Promise.reject(erreur)
);

export default clientHttp;