const path = require("path");
// const webpack = require("webpack");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        mainFields: ["main", "module", "browser"],
        // fallback: { 
        //     // "zlib": require.resolve("browserify-zlib"),
        //     // "stream": require.resolve("stream-browserify"),
        //     // "path": require.resolve("path-browserify"),
        //     "fs": false
        // }
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
    },
    // plugins: [
	// 	new NodePolyfillPlugin()
	// ]
    // plugins: [
    //     new webpack.DefinePlugin({
    //         // 'process.env.NODE_ENV': JSON.stringify('production'),
    //         'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
    //         'process.type': JSON.stringify(process.type),
    //         'process.version': JSON.stringify(process.version),
    //     })
    // ]
};
