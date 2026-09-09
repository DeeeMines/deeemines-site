/* Les actualités qui méritent une page à elles seules : celles dont le champ
   « corps » est rempli. Les autres restent de simples entrées dans la liste. */

const actualites = require('./actualites.json');

function adresse(texte) {
  return String(texte)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

module.exports = function () {
  const fr = actualites.fr.articles || [];
  const en = actualites.en.articles || [];
  return fr
    .map((a, i) => ({ fr: a, en: en[i] || a, slug: a.slug || adresse(a.titre) }))
    .filter((x) => x.fr.corps && String(x.fr.corps).trim() !== '');
};
