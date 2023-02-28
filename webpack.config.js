const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, args) => {
  const envFile = path.resolve(__dirname, `.env.${args.mode}`);
  return {
    mode: 'development',
    entry: ['@babel/polyfill', './src/index.jsx'],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
    },
    devServer: {
      port: 3000,
      static: './development',
      historyApiFallback: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
      }),
      new DotenvWebpackPlugin({
        path: envFile,
        safe: true,
        systemvars: true,
        silent: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[id].[chunkhash].css',
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '/',
              },
            },
            'css-loader',
            'sass-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpeg|gif|ico|jpg|woff(2)?|eot|ttf|otf|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
              },
            },
          ],
        },
        {
          test: /\.(jsx|js)?$/,
          exclude: /node-modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
  };
};
