const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        'leaflet.elevation': './src/index.jsx',
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
    },
    mode: isProd ? 'production' : 'development',
    // only set devtool if not building for production
    devtool: !isProd && 'source-map',
    devServer: {
        contentBase: '.',
        host: 'localhost',
        port: 9000,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        fix: true,
                    },
                },
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }),
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader',
            },
            {
                test: /\.(png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js', '.css', '.scss'],
        alias: {
            'chart.js': 'chart.js/dist/Chart.js',
        },
    },
    plugins: [
        // create CSS files for each entry ( if applicable )
        new ExtractTextPlugin('[name].css'),
        // get notified of success/error on build
        new WebpackNotifierPlugin(),
        // used to check if building for production
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
};
