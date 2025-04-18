import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import definePlugin from "./common/definePlugin";

const prodConfig: webpack.Configuration = {
    mode: 'production',
    entry: path.resolve('src', 'index.tsx'),
    output: {
        filename: 'js/[name]_[contenthash].js',
        path: path.resolve('dist'),
        publicPath: '/',
        clean: true,
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin()],
    },
    stats: {
        preset: 'normal',
        modules: false,
    },
    performance: {
        hints: false,
    },
    devtool: false,
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
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                include: /templates/,
            },
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /node_modules/,
                    maxSize: 150000,
                    name: 'vendors',
                    chunks: 'initial',
                },
            },
        },
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
};

export default prodConfig;

