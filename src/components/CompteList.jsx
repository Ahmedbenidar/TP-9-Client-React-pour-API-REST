import { formatMontant, formatDate, classeType } from '../utils/format';

// Tableau des comptes. Chaque ligne expose les actions de gestion :
// modifier, basculer le statut, supprimer.
function CompteList({ comptes, onModifier, onBasculerStatut, onSupprimer, chargement }) {
  if (chargement && comptes.length === 0) {
    return (
      <div className="text-center py-5 text-secondary">
        <span className="spinner-border text-success" role="status" aria-hidden="true" />
        <p className="mt-2 mb-0">Lecture des comptes depuis l'API...</p>
      </div>
    );
  }

  if (comptes.length === 0) {
    return (
      <div className="alert alert-light border text-center mb-0">
        <i className="bi bi-search me-2" aria-hidden="true" />
        Aucun compte ne correspond a ces criteres.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tableau-comptes mb-0">
        <thead>
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">Titulaire</th>
            <th scope="col">Agence</th>
            <th scope="col" className="text-end">Solde</th>
            <th scope="col">Ouverture</th>
            <th scope="col">Type</th>
            <th scope="col" className="text-center">Statut</th>
            <th scope="col" className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comptes.map((compte) => (
            <tr key={compte.id} className={compte.actif ? '' : 'ligne-inactive'}>
              <td className="font-monospace small">{compte.numeroCompte}</td>
              <td className="fw-semibold">{compte.titulaire}</td>
              <td className="small text-secondary">{compte.agence}</td>
              <td className="text-end font-monospace">{formatMontant(compte.solde, compte.devise)}</td>
              <td className="small">{formatDate(compte.dateCreation)}</td>
              <td><span className={classeType(compte.type)}>{compte.type}</span></td>
              <td className="text-center">
                {compte.actif
                  ? <span className="badge text-bg-success-subtle border border-success-subtle text-success-emphasis">Actif</span>
                  : <span className="badge text-bg-secondary">Inactif</span>}
              </td>
              <td className="text-end text-nowrap">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary me-1"
                  title="Modifier ce compte"
                  onClick={() => onModifier(compte)}
                >
                  <i className="bi bi-pencil-square" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-1"
                  title={compte.actif ? 'Desactiver ce compte' : 'Reactiver ce compte'}
                  onClick={() => onBasculerStatut(compte)}
                >
                  <i className={`bi ${compte.actif ? 'bi-pause-circle' : 'bi-play-circle'}`} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  title="Supprimer ce compte"
                  onClick={() => onSupprimer(compte)}
                >
                  <i className="bi bi-trash3" aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompteList;