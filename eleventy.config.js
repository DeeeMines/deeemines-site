const MarkdownIt = require('markdown-it');
/* Hauteur d'affichage d'un logo partenaire.

   Tous les logos partageaient la même hauteur maximale. Un logo très large
   couvrait alors une surface bien supérieure à celle d'un logo carré, et
   paraissait deux fois plus important. On corrige en faisant dépendre la
   hauteur des proportions du fichier : plus un logo est large, plus on le
   raccourcit. L'exposant 0,42 est un compromis entre l'égalité des hauteurs,
   qui avantage les logos larges, et l'égalité des surfaces, qui écrase trop
   les logos en bandeau. */
function mesurePng(chemin) {
  const fs = require('fs');
  const tampon = fs.readFileSync(chemin);
  if (tampon.length < 24) return null;
  if (tampon.toString('ascii', 1, 4) !== 'PNG') return null;
  return { l: tampon.readUInt32BE(16), h: tampon.readUInt32BE(20) };
}
function hauteurLogo(image) {
  const path = require('path');
  try {
    const m = mesurePng(path.join(__dirname, 'src', String(image).replace(/^\//, '')));
    if (!m || !m.h) return 40;
    const proportion = m.l / m.h;
    return Math.round(46 / Math.pow(proportion, 0.42) * 10) / 10;
  } catch (e) { return 40; }
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
