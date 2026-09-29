/* Les partenaires rangés par nature de relation.

   Le regroupement se fait ici plutôt que dans le gabarit : Nunjucks ne sait
   pas filtrer une liste dans une boucle, et la gymnastique nécessaire serait
   illisible. Un logo dont le groupe n'est pas reconnu, par exemple parce qu'il
   vient d'être ajouté depuis l'administration sans qu'on ait choisi son
   groupe, se range en fin de bandeau et reste donc toujours visible. */

const partenaires = require('./partenaires.json');

const ORDRE = ['recherche', 'reseaux', 'industrie'];

module.exports = function () {
  const groupes = ORDRE.map((cle) => ({ cle, logos: [] }));
  const autres = { cle: 'autres', logos: [] };
  (partenaires.logos || []).forEach((logo) => {
    const g = groupes.find((x) => x.cle === logo.groupe) || autres;
    g.logos.push(logo);
  });
  if (autres.logos.length) groupes.push(autres);
  return groupes.filter((g) => g.logos.length);
};
