import { formatMontant } from '../utils/format';

// Bandeau de synthese : quatre chiffres lus depuis /banque/comptes/statistiques.
function IndicateursBanque({ stats }) {
  if (!stats) return null;

  const cartes = [
    { libelle: 'Comptes', valeur: stats.nombreComptes, icone: 'bi-collection' },
    { libelle: 'Solde total', valeur: formatMontant(stats.soldeTotal), icone: 'bi-cash-stack' },
    { libelle: 'Solde moyen', valeur: formatMontant(stats.soldeMoyen), icone: 'bi-graph-up' },
    { libelle: 'Solde maximal', valeur: formatMontant(stats.soldeMax), icone: 'bi-trophy' }
  ];

  return (
    <div className="row g-3 mb-4">
      {cartes.map((carte) => (
        <div className="col-6 col-lg-3" key={carte.libelle}>
          <div className="card carte h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="indicateur-libelle">{carte.libelle}</span>
                <i className={`bi ${carte.icone} text-success`} aria-hidden="true" />
              </div>
              <div className="indicateur-valeur mt-2">{carte.valeur}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IndicateursBanque;