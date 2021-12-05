const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LocalServer = require('./tools/localServer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    proxy: {
      '/dev': {
        target: 'http://192.181.4.39:8765',
        changeOrigin: true,
        pathRewrite: {'^/dev' : ''}
      },
      '/api': {
        target: 'http://192.181.4.39:8765',
        changeOrigin: true,
        pathRewrite: {'^/api' : '/api'}
      },
      '/candy_api': {
        target: 'http://www.wetalks.cn/nodeApi', //http://localhost:2019
        changeOrigin: true,
        pathRewrite: {'^/candy_api' : '/'}
      },
      '/koa_node': {
        target: 'http://www.wetalks.cn/nodeApi', //http://47.254.39.213:2019/ http://121.89.184.22/nodeApi/
        changeOrigin: true,
        pathRewrite: {'^/koa_node' : '/'}
      }
    }
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
      minSize: 20000,
      minChunks: 5,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
            names: ['vendor'],
            filename: 'vendor.js',
            chunks: "all",
            minChunks: 30
        }
      }
    }),
    new LocalServer({
      port: 9019
    })
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
              name: 'fonts/[name].[hash:7].[ext]'
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.scss$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
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