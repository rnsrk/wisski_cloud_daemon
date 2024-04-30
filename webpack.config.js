const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/bin/daemon.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ejs', '.tsx', '.ts', '.js'],
      modules: [
        path.resolve(__dirname, 'src'),
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    watch: isDevelopment,
    watchOptions: {
      ignored: [
        'node_modules/**',
        'logs/**',
        ],

    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/templates', to: 'templates' },
          { from: 'src/public', to: 'public' },
        ],
      }),
    ],
    // Add any other configuration options specific to development or production here
  };
};
