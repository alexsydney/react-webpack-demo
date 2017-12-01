# Setup

* TODO 
  * [ ] - Yarn Eject to view in-built plugins
    * View Webpack project details. IMPORTANT NOTE: Cannot be reverted
      ```
      yarn run eject
      ```
    * Go into config/ directory that is generated to view Webpack in-built plugins

  * [ ] - Webpack on Lynda -
    * https://www.lynda.com/JavaScript-tutorials/Todo-app-walkthrough/604264/622879-4.html
    * https://www.lynda.com/JavaScript-tutorials/Using-source-maps-debug-minified-files/383908/426331-4.html

  * [ ] - Server incorporation - https://ltfschoen.github.io/React-Webpack-Babel-101/

* Setup environment
  ```
  git init;
  nvm ls; nvm install v8.7.0; nvm use v8.7.0
  ```

* Setup dependencies
  ```
  yarn init -y;
  yarn add --dev webpack \
                 webpack-dev-server \
                 copy-webpack-plugin \
                 babel-loader \
                 babel-core \
                 babel-preset-react-app \
                 react \
                 react-dom \
                 cross-env
  ```

* Create Babel configuration file
  ```
  {
    "presets": ["react-app"]
  }
  ```

* Create Webpack configuration file, with Source Maps.
  * References: 
    * https://github.com/babel/babel-loader
    * https://github.com/webpack-contrib/style-loader

  ```
  const path = require('path');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: APP_DIR + '/js',
          use: ['babel-loader']
        }
      ]
    }
  };
  ```

* Add scripts to use Webpack to transpile and run server
  ```
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack -p --config webpack.prod.config.js",
    "start": "cross-env NODE_ENV=development webpack-dev-server -d --watch --config webpack.dev.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  ```

* Create React App
  ```
  mkdir -p src/client/app/js/containers;
  touch src/client/app/index.html;
  touch src/client/app/js/index.js;
  touch src/client/app/js/containers/App.js;
  mkdir -p src/client/build;
  ```

* Add to src/js/index.js
  ```
  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './containers/App';

  ReactDOM.render(<App />, document.getElementById('app'))
  ```

* Add to src/js/containers/App.js
  ```
  import React from 'react';

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      return (
        <div><h1>Welcome</h1></div>
      )
    }
  }

  export default App;
  ```

* Add the following to src/client/app/index.html
  ```
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <!-- <link rel="stylesheet" href="styles.css"> -->
      <title>Hello World</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="app-bundle.js"></script>
    </body>
  </html>
  ```

* Add plugin to minify the production code JavaScript:
  
  * References: 
    * Instructions - https://webpack.js.org/plugins/uglifyjs-webpack-plugin/

  * Add dependency
    ```
    yarn add uglifyjs-webpack-plugin --dev
    ```
  
  * Add to webpack.dev.config.js
    ```
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

    module.exports = {
      plugins: [
        new UglifyJsPlugin({
          test: /\.js($|\?)/i, // Test to match files against
          include: path.resolve(__dirname, 'src/js'),
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            output: {
              beautify: false
            },
            warnings: false
          }
        })
      ]
    }
    ```

* Add ESLint
  * References:
    * Setup Guide - https://eslint.org/docs/user-guide/getting-started
  
  * Setup ESLint
    ```
    npm install eslint --save-dev
    ./node_modules/.bin/eslint --init
    ```

    * Answer questions
    ```
    ? How would you like to configure ESLint? Use a popular style guide
    ? Which style guide do you want to follow? Standard
    ? What format do you want your config file to be in? JavaScript
    ```

  * Add to package.json scripts
    ```
    "scripts": {
      "eslint": "./node_modules/.bin/eslint ./src/client/app/js/**/*.js"
    }
    ```

* Install dependencies
  ```
  yarn install
  ```

* Run server in development 

  * Build and run server
    ```
    yarn run dev
    ```
  
  * Debug in development (not minified)
    * Go to http://localhost:8080
    * Open Chrome Inspector
    * Go to Sources > Sources > top > localhost:8080 > app-bundle.js
    * Add a breakpoint in the code and refresh the page to trigger the breakpoint

* Build for Production
  * Enable source maps
    * About Source Maps - https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps
    * Chrome Inspector > Menu icon > Settings > Preferences > Sources > Enable JavaScript source maps
  
    ```
    yarn run prod
    ```

* Open in browser
  ```
  open -a "Google Chrome" http://localhost:8080
  ```

* Other
  * Visual Studio Code
    * Setup Visual Studio code so can run with `code` from command line 
      * https://code.visualstudio.com/docs/setup/mac
    * Change to tab size of 4 by overriding Workspace Settings with:
      ```
      {
        "editor.tabSize": 2,
      }
      ```
  