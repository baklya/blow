const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: "body"
});

const CopyPluginConfig = new CopyPlugin([
    { from: 'src/textures', to: 'textures' },
]);

module.exports = {
    mode: "development",
    context: __dirname,
    devServer: {
    contentBase: path.join(__dirname, "output"),
        compress: true,
        host: "0.0.0.0",
        port: 8080,
        historyApiFallback: true,
        open: true,
        publicPath: "/"
    },
    entry: {
        main: "./src/index.tsx",
    },
    output: {
        path: path.join(__dirname, "output"),
        filename: "app.bundle.js"
    },
    resolve: {
        alias: {
            store: path.resolve(__dirname, "src/store/"),
            textures: path.resolve(__dirname, "src/textures/"),
            cursors: path.resolve(__dirname, "src/cursors/"),
        },
        extensions: [".ts", ".tsx", ".js", ".json", ".css", ".pcss", ".png"]
    },
    module: {
        rules: [
            {
                test: /\.pcss$/,
                use: [
                    "style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    "postcss-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
                 exclude: /node_modules/
            },

            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
        ],
    },
    plugins: [
        HtmlWebpackPluginConfig,
        CopyPluginConfig
    ]
};
