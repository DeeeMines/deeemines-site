module.exports = function (eleventyConfig) {
  // L'administration est recopiée telle quelle, jamais interprétée
  eleventyConfig.ignores.add('src/admin/**');

  // Fichiers recopiés tels quels dans le site construit
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });
  eleventyConfig.addPassthroughCopy({ 'src/og.jpg': 'og.jpg' });
  eleventyConfig.addPassthroughCopy({ 'src/hero.mp4': 'hero.mp4' });
  eleventyConfig.addPassthroughCopy({ 'src/hero-poster.jpg': 'hero-poster.jpg' });
  eleventyConfig.addPassthroughCopy({ 'src/_redirects': '_redirects' });

  return {
    dir: { input: 'src', output: '_site', data: '_data', includes: '_includes' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
