import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import definePlugin from "./common/definePlugin";

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}


const devConfig: Configuration = {
    mode: 'development',
    entry: path.resolve('src', 'index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
        publicPath: '/',
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin()],
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
                include: /src/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin(),
        definePlugin,
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('templates', 'template.hbs'),
            favicon: path.resolve('public', 'favicon.png'),
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve('dist'),
        },
        port: 8080,
        historyApiFallback: true,
        hot: true,
        open: true,
    },
};

export default devConfig;
