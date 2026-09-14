/* Chaque article est publié deux fois, en français et en anglais, à son adresse
   propre. On aplatit ici les deux listes en une seule, où chaque entrée porte sa
   langue, l'article, et l'identifiant commun aux deux versions. */
const actualites = require('./actualites.json');

module.exports = function () {
  const out = [];
  ['fr', 'en'].forEach((langue) => {
    (actualites[langue].articles || []).forEach((art, i) => {
      if (!art.corps) return;                       // pas de page complète
      const jumeau = (actualites.fr.articles || [])[i] || art;
      out.push({ langue, art, slug: jumeau.slug });
    });
  });
  return out;
};
