/*  */

/**
 * esbuild base bundler config file
 * - Entry point set at runtime
 * - File output set at runtime
 * - Define is set at runtime
 * - minify overridden at runtime, based on debug flag
 * - sourcemap overridden at runtime, based on debug flag
 */
module.exports = {
  bundle: true,
  minify: true,
  sourcemap: false,
  resolveExtensions: ['.ts', '.js', '.mjs'],
  loader: {
    '.js': 'jsx',
    '.css': 'css',
    '.eot': 'dataurl',
    '.svg': 'dataurl',
    '.ttf': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl'
  },
  target: 'es2022',
  alias: {},
  banner: {}
};
