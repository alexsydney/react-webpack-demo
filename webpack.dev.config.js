/* 
  IMPORTANT: 
    - You must not use both devtool (deprecated) and SourceMapDevToolPlugin.
    - SourceMapDevToolPlugin include/test/exclude filters by output filename not by module.
    - UglifyJsPlugin must be before SourceMapDevToolPlugin.
    - UglifyJsPlugin must have `sourceMap: true` set to generate source maps.
  Reference: https://github.com/webpack/webpack/issues/4388
*/

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const SourceMapDevToolPlugin = require('source-map-dev-tool-plugin');

const BUILD_DIR = path.resolve(__dirname, 'src/client/public');
const APP_DIR = path.resolve(__dirname, 'src/client/app');

module.exports = {
  entry: { app: APP_DIR + '/js/index.js'},
  output: {
    path: BUILD_DIR,
    // publicPath: BUILD_DIR,
    filename: '[name]-bundle.js'
  },
  plugins: [
    // Copy to build folder
    new CopyWebpackPlugin([
      { from: APP_DIR + "/index.html", to: BUILD_DIR + "/index.html" }
    ]),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i, // Test to match files against
      // include: path.resolve(__dirname, 'src/js'),
      exclude: /node_modules/,
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        output: {
          beautify: false
        },
        warnings: false
      }
    }),
    // https://webpack.github.io/docs/list-of-plugins.html
    // https://webpack.github.io/docs/list-of-plugins.html#sourcemapdevtoolplugin
    // https://webpack.js.org/plugins/source-map-dev-tool-plugin/
    // https://survivejs.com/webpack/building/source-maps/#-sourcemapdevtoolplugin-and-evalsourcemapdevtoolplugin-
    new webpack.SourceMapDevToolPlugin({
      test: /\.js($|\?)/i,
      filename: '[name]-bundle.js.map'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_DIR + '/js',
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};