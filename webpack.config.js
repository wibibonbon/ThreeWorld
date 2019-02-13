var webpack = require("webpack");

var path = require("path");

var config = {
    target: "web",
    debug: true,
    devtool: "source-map",
    entry: {
        main: "./source/scripts/main"
    },
    output: {
        path: "./build",
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    node: {  // this is for pixi.js
        fs: "empty"
    },
    resolve: {
        modulesDirectories: ['web_modules', 'bower_components', 'node_modules']
    },
    module: {
        loaders: [
            { test: /\.css/, loader: "style-loader!css-loader" },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
            { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel?optional[]=runtime&stage=0'},
            { test: /\.png/, loader: "url-loader?limit=100000&mimetype=image/png" },
            { test: /\.gif/, loader: "url-loader?limit=100000&mimetype=image/gif" },
            { test: /\.jpg/, loader: "file-loader" },
            { test: /\.json/, loader: "json-loader" },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        //new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            __DEV__: true
        })
    ]
};
module.exports = config;