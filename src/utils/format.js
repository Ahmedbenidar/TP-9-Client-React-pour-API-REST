// Formatage monetaire francais : 12500.75 -> "12 500,75 MAD".
export function formatMontant(valeur, devise = 'MAD') {
  const nombre = Number(valeur);
  if (Number.isNaN(nombre)) return '-';
  return `${nombre.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${devise}`;
}

// 2024-01-15 -> 15/01/2024
export function formatDate(iso) {
  if (!iso) return '-';
  const [annee, mois, jour] = String(iso).split('-');
  if (!annee || !mois || !jour) return String(iso);
  return `${jour}/${mois}/${annee}`;
}

// Classe Bootstrap associee a chaque type de compte.
export function classeType(type) {
  switch (type) {
    case 'EPARGNE':
      return 'badge text-bg-success';
    case 'PROFESSIONNEL':
      return 'badge text-bg-dark';
    case 'COURANT':
    default:
      return 'badge text-bg-primary';
  }
}

// L'API refuse une reference vide : on en propose une au format maison
// (BQ-annee-6 chiffres) que l'utilisateur reste libre de modifier.
export function genererReference() {
  const annee = new Date().getFullYear();
  const alea = Math.floor(100000 + Math.random() * 900000);
  return `BQ-${annee}-${alea}`;
}
