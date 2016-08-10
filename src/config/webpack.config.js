"use strict";

const webpack = require("webpack");

module.exports = [{
    entry: {
        app: "./src/jsClient/jsx/Entry.jsx"
    },
    output: {
        publicPath: "../../build",
        path: `${__dirname}/../../build`,
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {test: /\.less/, loaders: ["style-loader", "css-loader", "less-loader"] },
            {test: /\.jsx/, loader: "babel-loader", query: {cacheDirectory: true, presets: ["es2015", "react"] }},
            {test: /\.js/, loader: "babel-loader", query: {cacheDirectory: true, presets: ["es2015", "react"] }}
        ]
    },
    resolve: ["", ".less", ".js", ".jsx"]
}]
