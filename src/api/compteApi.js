import clientHttp from './clientHttp';
import { CHEMINS } from '../config';

// L'API enveloppe la collection dans une cle "compte" : on la deballe ici une
// seule fois, pour que les composants ne manipulent que des tableaux.
function deballerLot(donnees) {
  if (Array.isArray(donnees)) return donnees;
  if (donnees && Array.isArray(donnees.compte)) return donnees.compte;
  return [];
}

export async function listerComptes(filtres = {}) {
  const parametres = {};
  if (filtres.type) parametres.type = filtres.type;
  if (filtres.soldeMin !== '' && filtres.soldeMin != null) parametres.soldeMin = filtres.soldeMin;
  if (filtres.soldeMax !== '' && filtres.soldeMax != null) parametres.soldeMax = filtres.soldeMax;
  if (filtres.titulaire) parametres.titulaire = filtres.titulaire;
  if (filtres.actifsSeulement) parametres.actifsSeulement = true;

  const reponse = await clientHttp.get(CHEMINS.comptes, { params: parametres });
  return deballerLot(reponse.data);
}

export async function statistiques() {
  const reponse = await clientHttp.get(CHEMINS.statistiques);
  return reponse.data;
}

export async function creerCompte(compte) {
  const reponse = await clientHttp.post(CHEMINS.comptes, compte);
  return reponse.data;
}

export async function remplacerCompte(id, compte) {
  const reponse = await clientHttp.put(`${CHEMINS.comptes}/${id}`, compte);
  return reponse.data;
}

export async function changerStatut(id, actif) {
  const reponse = await clientHttp.patch(`${CHEMINS.comptes}/${id}/statut`, null, {
    params: { actif }
  });
  return reponse.data;
}

export async function supprimerCompte(id) {
  await clientHttp.delete(`${CHEMINS.comptes}/${id}`);
}