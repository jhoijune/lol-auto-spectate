const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'async-node',
  entry: { index: './dist/index.js', init: './dist/init.js' },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
          globOptions: {
            ignore: [
              '**/pictures/**',
              '**/overlay/**',
              '**/correct.txt',
              '**/prolist.txt',
            ],
          },
        },
      ],
    }),
  ],
  externals: [nodeExternals()],
};
