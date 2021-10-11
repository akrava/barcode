const path = require("path");

module.exports = {
    resolve: {
        extensions: [".tsx", ".ts"],
    },
    devtool: "source-map",
    entry: "./src/main.ts",
    target: "electron-main",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    node: {
        __dirname: false,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
};
