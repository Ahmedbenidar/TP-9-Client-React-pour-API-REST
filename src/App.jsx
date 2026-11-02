import { useState, useEffect, useCallback } from 'react';
import CompteList from './components/CompteList';
import CompteForm from './components/CompteForm';
import BarreFiltres from './components/BarreFiltres';
import IndicateursBanque from './components/IndicateursBanque';
import { listerComptes, statistiques, creerCompte, remplacerCompte, changerStatut, supprimerCompte } from './api/compteApi';
import { messageDErreur } from './api/clientHttp';

const FILTRES_VIDES = {
  titulaire: '',
  type: '',
  soldeMin: '',
  soldeMax: '',
  actifsSeulement: false
};

function App() {
  const [comptes, setComptes] = useState([]);
  const [stats, setStats] = useState(null);
  const [filtres, setFiltres] = useState(FILTRES_VIDES);
  const [compteEnCours, setCompteEnCours] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [erreurFormulaire, setErreurFormulaire] = useState('');
  const [succes, setSucces] = useState('');

  // Recharge la liste et les indicateurs. Les deux appels partent en parallele.
  const rafraichir = useCallback(async (critere) => {
    setChargement(true);
    setErreur('');
    try {
      const [liste, indicateurs] = await Promise.all([
        listerComptes(critere),
        statistiques()
      ]);
      setComptes(liste);
      setStats(indicateurs);
    } catch (e) {
      setErreur(messageDErreur(e));
      setComptes([]);
    } finally {
      setChargement(false);
    }
  }, []);

  // Les filtres sont appliques cote API, avec un court delai pour eviter
  // une requete a chaque frappe dans le champ titulaire.
  useEffect(() => {
    const minuteur = setTimeout(() => { rafraichir(filtres); }, 300);
    return () => clearTimeout(minuteur);
  }, [filtres, rafraichir]);

  // Un message de succes s'efface tout seul.
  useEffect(() => {
    if (!succes) return undefined;
    const minuteur = setTimeout(() => setSucces(''), 4000);
    return () => clearTimeout(minuteur);
  }, [succes]);

  async function enregistrer(donnees) {
    setEnregistrement(true);
    setErreurFormulaire('');
    try {
      if (compteEnCours) {
        await remplacerCompte(compteEnCours.id, donnees);
        setSucces(`Compte ${compteEnCours.numeroCompte} mis a jour`);
        setCompteEnCours(null);
      } else {
        const cree = await creerCompte(donnees);
        setSucces(`Compte ${cree.numeroCompte} cree avec l identifiant ${cree.id}`);
      }
      await rafraichir(filtres);
    } catch (e) {
      setErreurFormulaire(messageDErreur(e));
    } finally {
      setEnregistrement(false);
    }
  }

  async function basculerStatut(compte) {
    try {
      const modifie = await changerStatut(compte.id, !compte.actif);
      setSucces(`Compte ${modifie.numeroCompte} ${modifie.actif ? 'reactive' : 'desactive'}`);
      await rafraichir(filtres);
    } catch (e) {
      setErreur(messageDErreur(e));
    }
  }

  async function supprimer(compte) {
    const confirme = window.confirm(
      `Supprimer definitivement le compte ${compte.numeroCompte} de ${compte.titulaire} ?`
    );
    if (!confirme) return;
    try {
      await supprimerCompte(compte.id);
      setSucces(`Compte ${compte.numeroCompte} supprime`);
      if (compteEnCours && compteEnCours.id === compte.id) setCompteEnCours(null);
      await rafraichir(filtres);
    } catch (e) {
      setErreur(messageDErreur(e));
    }
  }

  function selectionnerPourModification(compte) {
    setCompteEnCours(compte);
    setErreurFormulaire('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <header className="app-entete">
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bank2 fs-2" aria-hidden="true" />
            <div>
              <h1>Gestion des comptes bancaires</h1>
              <p>Client React connecte a l API REST Spring sur le port 8082</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-4">
        {erreur && (
          <div className="alert alert-danger bandeau-erreur d-flex align-items-start" role="alert">
            <i className="bi bi-wifi-off me-2 mt-1" aria-hidden="true" />
            <div>
              <strong>Communication impossible avec l API.</strong>
              <div className="small">{erreur}</div>
            </div>
            <button type="button" className="btn-close ms-auto" onClick={() => rafraichir(filtres)} aria-label="Reessayer" />
          </div>
        )}

        {succes && (
          <div className="alert alert-success bandeau-succes py-2 d-flex align-items-center" role="status">
            <i className="bi bi-check-circle me-2" aria-hidden="true" />
            {succes}
          </div>
        )}

        <IndicateursBanque stats={stats} />

        <CompteForm
          compteEnCours={compteEnCours}
          onEnregistrer={enregistrer}
          onAnnuler={() => setCompteEnCours(null)}
          enregistrement={enregistrement}
          erreur={erreurFormulaire}
        />

        <BarreFiltres
          filtres={filtres}
          onChange={setFiltres}
          onReinitialiser={() => setFiltres(FILTRES_VIDES)}
          chargement={chargement}
        />

        <div className="card carte">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="bi bi-table" aria-hidden="true" />
            <span>Comptes</span>
            <span className="badge text-bg-secondary ms-1">{comptes.length}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-success ms-auto"
              onClick={() => rafraichir(filtres)}
              disabled={chargement}
            >
              <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
              Actualiser
            </button>
          </div>
          <CompteList
            comptes={comptes}
            onModifier={selectionnerPourModification}
            onBasculerStatut={basculerStatut}
            onSupprimer={supprimer}
            chargement={chargement}
          />
        </div>

        <p className="pied-page text-center mb-0">
          TP 9 - Client React pour API REST - Architecture Microservices - Ahmed Benidar
        </p>
      </main>
    </>
  );
}

export default App;