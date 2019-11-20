const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: "body"
});

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
        publicPath: "/",
        proxy: {
            "/products": {
                target: "https://api-cloud.aboutyou.de/v1",
                secure: false,
                changeOrigin: true
            },
            "/filters": {
                target: "https://api-cloud.aboutyou.de/v1",
                secure: false,
                changeOrigin: true
            }
        }
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
            utils: path.resolve(__dirname, "src/utils/"),
        },
        extensions: [".ts", ".tsx", ".js", ".json", ".css", ".pcss"]
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
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
        ],
    },
    plugins: [HtmlWebpackPluginConfig]
};
