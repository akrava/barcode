const path = require("path");

module.exports = {
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        mainFields: ["main", "module", "browser"],
    },
    entry: {
        app: "./src/app/app.tsx",
        renderer: "./src/app/renderer.ts"
    },
    target: "electron-renderer",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "."),
            publicPath: "/",
        },
        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 4000,
        proxy: {
            '/dist/app': {
                target: 'http://localhost:4000',
                pathRewrite: { '^/dist/app': '' },
            }
        }
    },
    output: {
        path: path.resolve(__dirname, "dist/app"),
        filename: "[name].js",
    }
};
