/* Construit le dictionnaire français -> anglais utilisé par le site.
   Il assemble deux sources :
     - statique.json : les textes qui vivent dans le gabarit et ne sont pas
       modifiables depuis l'admin ;
     - les fichiers de contenu, en parcourant en parallèle leur branche "fr"
       et leur branche "en".
   Les clés sont normalisées (espaces multiples ramenés à un seul), exactement
   comme le fait le script du site au moment de basculer en anglais. */

const statique   = require('./statique.json');
const contenu    = require('./contenu.json');
const equipe     = require('./equipe.json');
const actualites = require('./actualites.json');

const norme = (t) => String(t).replace(/\s+/g, ' ').trim();

/* Parcourt deux structures de même forme et enregistre chaque couple de
   chaînes rencontré. Les valeurs qui ne sont pas du texte affiché
   (URL, pourcentage, chemin d'image) sont ignorées. */
const IGNORE = new Set(['linkedin', 'avancement', 'photo', 'image', 'lien']);

function paires(fr, en, out, cle) {
  if (fr === null || fr === undefined) return;
  if (Array.isArray(fr)) {
    fr.forEach((v, i) => paires(v, Array.isArray(en) ? en[i] : undefined, out, cle));
    return;
  }
  if (typeof fr === 'object') {
    Object.keys(fr).forEach((k) => paires(fr[k], en ? en[k] : undefined, out, k));
    return;
  }
  if (typeof fr !== 'string' || typeof en !== 'string') return;
  if (IGNORE.has(cle)) return;
  const k = norme(fr);
  if (!k || k === norme(en)) return;   // rien à traduire
  out[k] = en;
}

module.exports = function () {
  const out = {};
  Object.keys(statique).forEach((k) => { out[norme(k)] = statique[k]; });
  paires(contenu.fr,    contenu.en,    out);
  paires(equipe.fr,     equipe.en,     out);
  paires(actualites.fr, actualites.en, out);
  return out;
};
