const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@portal/shared-ui': path.resolve(__dirname, '../shared-ui/src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'host_app',
        remotes: {
          profile_mf: isProduction
            ? 'profile_mf@/profile/remoteEntry.js'
            : 'profile_mf@http://localhost:3001/remoteEntry.js',
          notifications_mf: isProduction
            ? 'notifications_mf@/notifications/remoteEntry.js'
            : 'notifications_mf@http://localhost:3002/remoteEntry.js',
          reports_mf: isProduction
            ? 'reports_mf@/reports/remoteEntry.js'
            : 'reports_mf@http://localhost:3003/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.2.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
          'react-router-dom': { singleton: true, requiredVersion: '^6.21.1' },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Enterprise Portal',
      }),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      client: {
        overlay: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
};
