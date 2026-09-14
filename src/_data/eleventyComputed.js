/* Raccourcis mis à la disposition de chaque gabarit.

   « t » rassemble les textes de la langue de la page : les fichiers rangés
   dans _data/textes/ arrivent sous la forme textes.accueil = { fr: …, en: … },
   et l'on n'en garde ici que la branche utile, de sorte que le gabarit écrive
   simplement t.accueil.souverainete.titre.

   « adresse_fr » et « adresse_en » donnent l'adresse de la même page dans
   chacune des deux langues, ce qui sert à l'adresse canonique et aux liens de
   traduction. */
module.exports = {
  t: (data) => {
    const langue = data.langue || 'fr';
    const out = {};
    Object.entries(data.textes || {}).forEach(([page, branches]) => {
      out[page] = branches[langue] || branches.fr || {};
    });
    return out;
  },
  adresse_fr: (data) => {
    if (data.adresse_fr_forcee) return data.adresse_fr_forcee;
    const a = (data.adresses || {})[data.page_cle];
    return a ? a.fr : '/';
  },
  adresse_en: (data) => {
    if (data.adresse_en_forcee) return data.adresse_en_forcee;
    const a = (data.adresses || {})[data.page_cle];
    return a ? a.en : '/en/';
  },
};
