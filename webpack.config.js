// https://dev.to/pixelgoo/how-to-configure-webpack-from-scratch-for-a-basic-website-46a5
// Webpack uses this to work with directories
const path = require('path');

// Plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globImporter = require("node-sass-glob-importer");

module.exports = (env, argv) => {
  const production = argv.mode === "production";
  const config = {
    entry: './src/js/main.js',
    output: {
      path: path.resolve(__dirname, 'assets'),
      filename: 'application.js',
      publicPath: '' // Path added to the start of URL processed by file-loader
    },
    mode: argv.mode || "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          // Apply rule for .sass, .scss or .css files
          test: /\.(sa|sc|c)ss$/,
          // Set loaders to transform files.
          // Loaders are applying from right to left(!)
          // The first loader will be applied after others
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              // This loader resolves url() and @imports inside CSS
              loader: "css-loader",
            },
            {
              // Then we apply postCSS fixes like autoprefixer and minifying
              loader: "postcss-loader"
            },
            {
              // First we transform SASS to standard CSS
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sassOptions: {
                  importer: globImporter()
                }
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png|jpg|webp)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '.' // Directory added to after publicPath before filename in file-loader URLs
            }
          }]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "application.css"
      })
    ]
  };
  // Only clean the dist folder for a production build,
  // as webpack --watch doesn't regenerate all files such as fonts
  if(production){
    config.plugins.unshift(new CleanWebpackPlugin())
  }
  return config;
};