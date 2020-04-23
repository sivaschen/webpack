'use strict'

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniExtractCssPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    Object.keys(entryFiles).map(index => {
            const entryFile = entryFiles[index]; 
            const match = entryFile.match(/src\/(.*)\/index\.js/);
            const pageName = match && match[1];
            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    inject: true,
                    chunks:['vendors', pageName],
                    filename: `${pageName}.html`,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            );
        });
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins} = setMPA();

module.exports = {
    entry: entry,
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    module:  {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniExtractCssPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniExtractCssPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require("autoprefixer")()]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecesion: 8
                        }
                    }
                ]
            },
            {
                test: /.(jpg|png|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name:'[name]_[hash:8].[ext]'
                        }
                    }
                ],
                
            }
        ]
    },
    plugins: [
        new MiniExtractCssPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackExternalsPlugin({
            externals:[
                {
                    module:'react',
                    entry:'http://11.url.cn/now/lib/15.1.0/react-with-addons.min.js?_bid=3123',
                    global:'React'
                },{
                    module:'react-dom',
                    entry:'http://11.url.cn/now/lib/15.1.0/react-dom.min.js?_bid=3123',
                    global:'ReactDOM'
                }
            ]
        }),
        new FriendlyErrorsWebpackPlugin(),
        function () {
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                    console.log('build error');
                    process.exit(1);
                }
            })
        }
    ].concat(htmlWebpackPlugins),
    optimization: {
      splitChunks: {
          minSize: 0,
          cacheGroups: {
              commons: {
                  name: 'commons',
                  chunks: 'all',
                  minChunks: 2
              }
          }
      }  
    },
    stats: 'errors-only'
}