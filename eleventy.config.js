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

module.exports = function (eleventyConfig) {
  // L'administration est recopiée telle quelle, jamais interprétée
  eleventyConfig.ignores.add('src/admin/**');

  eleventyConfig.addFilter('markdown', (t) => (t ? md.render(String(t)) : ''));
  eleventyConfig.addFilter('adresse', adresse);

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
