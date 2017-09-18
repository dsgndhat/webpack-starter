const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');

let config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './public'), // output path
    filename: 'output.js' // output filename
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.jpeg', '.jpg', '.gif', '.png'], // resolve thes ext
    alias: { // create aliases
      images: path.resolve(__dirname, 'src/assets/images')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/, // files ending with .js
        exclude: /node_modules/, // exclude the node_modules directory
        loader: 'babel-loader' // use this (babel-core) loader
      },
      {
        test: /\.scss$/, // files ending with scss
        use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({ // call our plugin with extract method and HMR styles
          use: ['css-loader', 'sass-loader', 'postcss-loader'], // use these loaders
          fallback: 'style-loader' // fallback for any css not extracted
        })), // end extract
      },
      {
        test: /\.jsx$/, // all files ending with .jsx
        loader: 'babel-loader', // use babel-loader for all .jsx files
        exclude: /node_modules/ // omit searching node_modules for files
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', { // images loader
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        }],
        exclude: /node_modules/,
        include: __dirname,
      },
    ] // end rules
  },
  plugins: [
    new ExtractTextWebpackPlugin('styles.css') // call the ExtractTextWebpackPlugin constructor and name our css files
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './public'), // directory to server html
    historyApiFallback: true, // fallback to /index.html for SPA
    inline: true, // inline mode (set to false to disable including client scripts like livereload)
    open: true, // open default browser
    compress: true, // enable gzip compression
    hot: true // enable HMR feature
  },
  devtool: 'eval-source-map', // enable devtool for better debugging
}

module.exports = config;

if (process.env.NODE_ENV  === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
    new OptimizeCSSAssets() // call the css optimizer
  );
}
