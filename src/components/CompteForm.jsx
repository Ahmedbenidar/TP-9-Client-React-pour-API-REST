import { useState, useEffect } from 'react';
import { TYPES_COMPTE } from '../config';
import { genererReference } from '../utils/format';

// Formulaire unique pour la creation et la modification.
// Le composant est controle : chaque champ alimente un objet "compte".
const VIDE = {
  numeroCompte: '',
  titulaire: '',
  agence: '',
  solde: '',
  devise: 'MAD',
  dateCreation: '',
  type: 'COURANT',
  actif: true
};

function formulaireVide() {
  return { ...VIDE, numeroCompte: genererReference(), dateCreation: new Date().toISOString().slice(0, 10) };
}

function CompteForm({ compteEnCours, onEnregistrer, onAnnuler, enregistrement, erreur }) {
  const [compte, setCompte] = useState(formulaireVide());
  const [erreursLocales, setErreursLocales] = useState({});

  // Passage en modification : on recopie le compte selectionne dans l'etat local.
  useEffect(() => {
    if (compteEnCours) {
      setCompte({
        numeroCompte: compteEnCours.numeroCompte || '',
        titulaire: compteEnCours.titulaire || '',
        agence: compteEnCours.agence || '',
        solde: String(compteEnCours.solde ?? ''),
        devise: compteEnCours.devise || 'MAD',
        dateCreation: compteEnCours.dateCreation || '',
        type: compteEnCours.type || 'COURANT',
        actif: Boolean(compteEnCours.actif)
      });
    } else {
      setCompte(formulaireVide());
    }
    setErreursLocales({});
  }, [compteEnCours]);

  const modifier = (champ) => (evenement) => {
    const cible = evenement.target;
    const valeur = cible.type === 'checkbox' ? cible.checked : cible.value;
    setCompte((precedent) => ({ ...precedent, [champ]: valeur }));
  };

  // Validation minimale cote client : l'API revalide de toute facon.
  function verifier() {
    const trouvees = {};
    if (!compte.titulaire.trim()) trouvees.titulaire = 'Le titulaire est obligatoire';
    if (compte.solde === '' || Number(compte.solde) < 0) trouvees.solde = 'Le solde doit etre positif ou nul';
    if (!compte.dateCreation) trouvees.dateCreation = 'La date d ouverture est obligatoire';
    if (!compte.numeroCompte.trim()) trouvees.numeroCompte = 'La reference est obligatoire';
    setErreursLocales(trouvees);
    return Object.keys(trouvees).length === 0;
  }

  function soumettre(evenement) {
    evenement.preventDefault();
    if (!verifier()) return;

    // L'API attend un montant numerique et une date au format ISO.
    onEnregistrer({
      numeroCompte: compte.numeroCompte.trim() || null,
      titulaire: compte.titulaire.trim(),
      agence: compte.agence.trim() || null,
      solde: Number(compte.solde),
      devise: compte.devise,
      dateCreation: compte.dateCreation,
      type: compte.type,
      actif: compte.actif
    });
  }

  function reinitialiser() {
    setCompte(formulaireVide());
    setErreursLocales({});
    onAnnuler();
  }

  const enModification = Boolean(compteEnCours);

  return (
    <div className="card carte mb-4">
      <div className="card-header d-flex align-items-center gap-2">
        <i className={`bi ${enModification ? 'bi-pencil-square' : 'bi-plus-circle'}`} aria-hidden="true" />
        <span>{enModification ? `Modifier le compte ${compteEnCours.numeroCompte}` : 'Ouvrir un nouveau compte'}</span>
        {enModification && (
          <button type="button" className="btn btn-sm btn-outline-secondary ms-auto" onClick={reinitialiser}>
            Annuler
          </button>
        )}
      </div>
      <div className="card-body">
        {erreur && (
          <div className="alert alert-danger bandeau-erreur py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle me-1" aria-hidden="true" />
            {erreur}
          </div>
        )}

        <form onSubmit={soumettre} noValidate>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold" htmlFor="champ-titulaire">
                Titulaire <span className="text-danger">*</span>
              </label>
              <input
                id="champ-titulaire"
                type="text"
                className={`form-control ${erreursLocales.titulaire ? 'is-invalid' : ''}`}
                value={compte.titulaire}
                onChange={modifier('titulaire')}
                placeholder="Nom et prenom du titulaire"
              />
              {erreursLocales.titulaire && <div className="invalid-feedback">{erreursLocales.titulaire}</div>}
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold" htmlFor="champ-agence">
                Agence
              </label>
              <input
                id="champ-agence"
                type="text"
                className="form-control"
                value={compte.agence}
                onChange={modifier('agence')}
                placeholder="Ville - quartier"
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold" htmlFor="champ-reference">
                Reference
              </label>
              <input
                id="champ-reference"
                type="text"
                className={`form-control font-monospace ${erreursLocales.numeroCompte ? 'is-invalid' : ''}`}
                value={compte.numeroCompte}
                onChange={modifier('numeroCompte')}
                placeholder="BQ-2026-123456"
                disabled={enModification}
              />
              {erreursLocales.numeroCompte && <div className="invalid-feedback">{erreursLocales.numeroCompte}</div>}
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold" htmlFor="champ-solde">
                Solde <span className="text-danger">*</span>
              </label>
              <input
                id="champ-solde"
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${erreursLocales.solde ? 'is-invalid' : ''}`}
                value={compte.solde}
                onChange={modifier('solde')}
                placeholder="0.00"
              />
              {erreursLocales.solde && <div className="invalid-feedback">{erreursLocales.solde}</div>}
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold" htmlFor="champ-devise">
                Devise
              </label>
              <select
                id="champ-devise"
                className="form-select"
                value={compte.devise}
                onChange={modifier('devise')}
              >
                <option value="MAD">MAD</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold" htmlFor="champ-date">
                Ouverture <span className="text-danger">*</span>
              </label>
              <input
                id="champ-date"
                type="date"
                className={`form-control ${erreursLocales.dateCreation ? 'is-invalid' : ''}`}
                value={compte.dateCreation}
                onChange={modifier('dateCreation')}
              />
              {erreursLocales.dateCreation && <div className="invalid-feedback">{erreursLocales.dateCreation}</div>}
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold" htmlFor="champ-type">
                Type
              </label>
              <select
                id="champ-type"
                className="form-select"
                value={compte.type}
                onChange={modifier('type')}
              >
                {TYPES_COMPTE.map((t) => (
                  <option key={t.valeur} value={t.valeur}>{t.libelle}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2 d-flex align-items-end">
              <div className="form-check">
                <input
                  id="champ-actif"
                  type="checkbox"
                  className="form-check-input"
                  checked={compte.actif}
                  onChange={modifier('actif')}
                />
                <label className="form-check-label small" htmlFor="champ-actif">Compte actif</label>
              </div>
            </div>

            <div className="col-12 d-flex gap-2 pt-1">
              <button type="submit" className="btn btn-success" disabled={enregistrement}>
                {enregistrement
                  ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Envoi...</>
                  : <><i className={`bi ${enModification ? 'bi-check2-circle' : 'bi-plus-lg'} me-1`} aria-hidden="true" />{enModification ? 'Enregistrer' : 'Ajouter le compte'}</>}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={reinitialiser} disabled={enregistrement}>
                Vider
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompteForm;