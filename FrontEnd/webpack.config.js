var path = require('path');
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD_ENV || '0');
 
module.exports = {
  target: "web",
  debug: true,
  entry: './app.js',
  devtool: "source-map",
  // output: { path: __dirname, filename: 'bundle.js' },
output: { path: __dirname + "/build", filename: 'bundle.js' },

  node: {
    fs: "empty"
  },

  resolve: {
    extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx', '.json', 'index.json'],
    modulesDirectories: ['web_modules', 'bower_components', 'node_modules']
  },

  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
//    noParse: /forge\.js/,
    loaders: [
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
      { test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['es2015', 'react']}}
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : [ 
    new webpack.DefinePlugin({
            __DEV__: true
    })
  ]
};