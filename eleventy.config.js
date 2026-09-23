const MarkdownIt = require('markdown-it');
/* Hauteur d'affichage d'un logo partenaire.

   Tous les logos partageaient la même hauteur maximale. Un logo très large
   couvrait alors une surface bien supérieure à celle d'un logo carré, et
   paraissait deux fois plus important. On corrige en faisant dépendre la
   hauteur des proportions du fichier : plus un logo est large, plus on le
   raccourcit. L'exposant 0,42 est un compromis entre l'égalité des hauteurs,
   qui avantage les logos larges, et l'égalité des surfaces, qui écrase trop
   les logos en bandeau. */
function mesureImage(chemin) {
  const fs = require('fs');
  const t = fs.readFileSync(chemin);
  if (t.length < 24) return null;
  if (t.toString('ascii', 1, 4) === 'PNG') {
    return { l: t.readUInt32BE(16), h: t.readUInt32BE(20) };
  }
  // Un logo déposé en JPEG se mesurait autrefois comme nul, et le gabarit
  // repliait alors sur une hauteur fixe qui le faisait paraître deux fois
  // trop grand. On lit donc aussi l'en-tête JPEG, segment par segment.
  if (t[0] === 0xFF && t[1] === 0xD8) {
    let i = 2;
    while (i + 9 < t.length) {
      if (t[i] !== 0xFF) { i++; continue; }
      const marque = t[i + 1];
      const cadre = marque >= 0xC0 && marque <= 0xCF &&
                    marque !== 0xC4 && marque !== 0xC8 && marque !== 0xCC;
      if (cadre) return { h: t.readUInt16BE(i + 5), l: t.readUInt16BE(i + 7) };
      if (marque === 0xD8 || (marque >= 0xD0 && marque <= 0xD9)) { i += 2; continue; }
      i += 2 + t.readUInt16BE(i + 2);
    }
  }
  return null;
}
/* « taille » est le réglage manuel, en pourcentage, que propose
   l'administration : 100 laisse le calcul automatique tel quel, 80 rend le
   logo plus discret, 130 le remonte. Il sert aux cas que les proportions
   seules n'attrapent pas, par exemple un mot-symbole noir et gras qui pèse
   plus lourd à l'œil qu'un logo pâle de mêmes dimensions. */
function hauteurLogo(image, taille) {
  const path = require('path');
  const facteur = Math.min(250, Math.max(40, Number(taille) || 100)) / 100;
  try {
    const m = mesureImage(path.join(__dirname, 'src', String(image).replace(/^\//, '')));
    if (!m || !m.h) return Math.round(30 * facteur * 10) / 10;
    const proportion = m.l / m.h;
    return Math.round(46 / Math.pow(proportion, 0.42) * facteur * 10) / 10;
  } catch (e) { return Math.round(30 * facteur * 10) / 10; }
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

/* Transforme un titre en adresse lisible : « Le procédé est breveté »
   devient « le-procede-est-brevete ». */
function adresse(texte) {
  return String(texte)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // accents
    .toLowerCase()
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/* Transforme un lien de vidéo, tel qu'on le copie depuis la barre d'adresse,
   en adresse d'intégration utilisable dans un cadre. Accepte YouTube, Vimeo
   et Dailymotion. Renvoie une chaîne vide si le lien n'est pas reconnu :
   le gabarit affiche alors un simple bouton vers la vidéo. */
function lecteur(lien) {
  const u = String(lien || '').trim();
  if (!u) return '';
  let m;
  if ((m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/)))
    return 'https://www.youtube-nocookie.com/embed/' + m[1];
  if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
    return 'https://player.vimeo.com/video/' + m[1];
  if ((m = u.match(/dailymotion\.com\/video\/([\w]+)/)))
    return 'https://www.dailymotion.com/embed/video/' + m[1];
  // Storyfox : l'adresse de prévisualisation s'affiche directement dans un cadre
  if (/app\.storyfox\.io\/preview\/public\//.test(u)) return u;
  return '';
}

module.exports = function (eleventyConfig) {
  // L'administration est recopiée telle quelle, jamais interprétée
  eleventyConfig.ignores.add('src/admin/**');

  eleventyConfig.addFilter('hauteurLogo', hauteurLogo);
  eleventyConfig.addFilter('markdown', (t) => (t ? md.render(String(t)) : ''));
  eleventyConfig.addFilter('adresse', adresse);
  eleventyConfig.addFilter('lecteur', lecteur);
  // Un retour à la ligne saisi dans l'administration doit se voir à l'écran :
  // sans cela le navigateur le réduit à une espace et les phrases se collent.
  eleventyConfig.addFilter('sauts', (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>'));
  // La même valeur, mise à plat, pour les endroits qui n'admettent qu'une ligne
  eleventyConfig.addFilter('uneLigne', (t) => String(t == null ? '' : t)
    .replace(/\s*\r?\n\s*/g, ' ').replace(/"/g, '&quot;').trim());

  // Fichiers recopiés tels quels dans le site construit
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });
  eleventyConfig.addPassthroughCopy({ 'src/og.jpg': 'og.jpg' });
  eleventyConfig.addPassthroughCopy({ 'src/og-en.jpg': 'og-en.jpg' });
  eleventyConfig.addPassthroughCopy({ 'src/_headers': '_headers' });
  eleventyConfig.addPassthroughCopy({ 'src/_redirects': '_redirects' });
  eleventyConfig.addPassthroughCopy({ 'src/old': 'old' });
  // Les pages de l'archive sont recopiées telles quelles : Eleventy ne doit
  // pas les traiter comme des gabarits, sans quoi elles sortiraient en double.
  eleventyConfig.ignores.add('src/old/**');
  eleventyConfig.addPassthroughCopy({ 'src/hero.mp4': 'hero.mp4' });
  eleventyConfig.addPassthroughCopy({ 'src/hero-poster.jpg': 'hero-poster.jpg' });

  return {
    dir: { input: 'src', output: '_site', data: '_data', includes: '_includes' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
