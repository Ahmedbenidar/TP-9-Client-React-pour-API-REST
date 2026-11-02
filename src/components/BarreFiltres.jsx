import { TYPES_COMPTE } from '../config';

// Filtres envoyes tels quels a l'API : type, intervalle de solde, titulaire, actifs.
function BarreFiltres({ filtres, onChange, onReinitialiser, chargement }) {
  const modifier = (champ) => (evenement) => {
    const valeur = evenement.target.type === 'checkbox'
      ? evenement.target.checked
      : evenement.target.value;
    onChange({ ...filtres, [champ]: valeur });
  };

  return (
    <div className="card carte mb-4">
      <div className="card-header d-flex align-items-center gap-2">
        <i className="bi bi-funnel" aria-hidden="true" />
        <span>Filtres de recherche</span>
        {chargement && (
          <span className="spinner-border spinner-border-sm text-success ms-auto" role="status">
            <span className="visually-hidden">Chargement</span>
          </span>
        )}
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label small fw-semibold" htmlFor="filtre-titulaire">
              Titulaire
            </label>
            <input
              id="filtre-titulaire"
              type="text"
              className="form-control"
              placeholder="Nom contenu dans..."
              value={filtres.titulaire}
              onChange={modifier('titulaire')}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-2">
            <label className="form-label small fw-semibold" htmlFor="filtre-type">
              Type
            </label>
            <select
              id="filtre-type"
              className="form-select"
              value={filtres.type}
              onChange={modifier('type')}
            >
              <option value="">Tous</option>
              {TYPES_COMPTE.map((t) => (
                <option key={t.valeur} value={t.valeur}>{t.libelle}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small fw-semibold" htmlFor="filtre-min">
              Solde min
            </label>
            <input
              id="filtre-min"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="0"
              value={filtres.soldeMin}
              onChange={modifier('soldeMin')}
            />
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small fw-semibold" htmlFor="filtre-max">
              Solde max
            </label>
            <input
              id="filtre-max"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="Sans limite"
              value={filtres.soldeMax}
              onChange={modifier('soldeMax')}
            />
          </div>

          <div className="col-12 col-lg-3 d-flex align-items-end gap-2">
            <div className="form-check me-auto">
              <input
                id="filtre-actifs"
                type="checkbox"
                className="form-check-input"
                checked={filtres.actifsSeulement}
                onChange={modifier('actifsSeulement')}
              />
              <label className="form-check-label small" htmlFor="filtre-actifs">
                Actifs seulement
              </label>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onReinitialiser}>
              <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
              Reinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarreFiltres;