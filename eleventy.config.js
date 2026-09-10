const MarkdownIt = require('markdown-it');
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

  eleventyConfig.addFilter('markdown', (t) => (t ? md.render(String(t)) : ''));
  eleventyConfig.addFilter('adresse', adresse);
  eleventyConfig.addFilter('lecteur', lecteur);

  // Fichiers recopiés tels quels dans le site construit
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });
  eleventyConfig.addPassthroughCopy({ 'src/og.jpg': 'og.jpg' });
  eleventyConfig.addPassthroughCopy({ 'src/hero.mp4': 'hero.mp4' });
  eleventyConfig.addPassthroughCopy({ 'src/hero-poster.jpg': 'hero-poster.jpg' });

  return {
    dir: { input: 'src', output: '_site', data: '_data', includes: '_includes' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
