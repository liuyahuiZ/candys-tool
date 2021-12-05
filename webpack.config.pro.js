const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LocalServer = require('./tools/localServer');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextWebapckPlugin = require("extract-text-webpack-plugin");
// const cssExtract = new ExtractTextWebapckPlugin('css/index.css');
const sassExtract = new ExtractTextWebapckPlugin('css/cssbundle.css');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    chunkFilename: '[name].[chunkhash].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new HtmlWebpackPlugin()
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'src','index.html'),
      filename:'index.html',
      chunks:['index'],
      hash:true,//防止缓存
      minify:{
          removeAttributeQuotes:true//压缩 去掉引号
      }
    }),
    new webpack.optimize.SplitChunksPlugin({
      chunks: "all",
      minSize: 30000,
      minChunks: 5,
      maxAsyncRequests: 3,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
            chunks: "all",
            minChunks: 30
        }
      }
    }),
    // new BundleAnalyzerPlugin(),
    // cssExtract,
    sassExtract
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /(\.jp(e)g|\.png|\.gif|\.svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {}
        }
      }, 
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]',
              outputPath: './css/fonts/',
              publicPath: 'fonts/'
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        // use:cssExtract.extract({
        //   use:'css-loader'
        // })
      },
      {
        test: /\.scss$/,
        // use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
        use: sassExtract.extract({
          use:['css-loader','sass-loader']
        })
      }
    ]
  },
  resolve: {
    alias: {
      neo: path.resolve(__dirname, 'src/neo/index'),
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      api: path.resolve(__dirname, 'src/App/api'),
      utils: path.resolve(__dirname, 'src/App/utils'),
      config:path.resolve(__dirname, 'src/App/config'),
      context: path.resolve(__dirname, 'src/App/page/context')
    }
  }
}