const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //for HTML
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //for CSS
const CopyWebpackPlugin = require("copy-webpack-plugin"); //for copy any files

let mode = 'development';
//change mode
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

module.exports = {
    entry: {
        main: './src/index.js',
    },
    //source-map added
    // devtool: (mode === "development") ? 'source-map' : false,

    output: {
        filename: "[name]-bundle.js",
        path: path.resolve(__dirname, 'dist'),
        clean: true, //delete folder dist
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true,
        open: true,
        compress: true,
        port: 3000,
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    //for support template literals & generate code
                    postprocessor: (content, loaderContext) => {
                        const isTemplateLiteralSupported = content[0] === "`";

                        return content
                            .replace(/<%=/g, isTemplateLiteralSupported ? `\${` : '" +')
                            .replace(/%>/g, isTemplateLiteralSupported ? "}" : '+ "');
                    },
                    //minimize html
                    minimize: false,
                },
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            [
                            "@babel/preset-env",
                                {
                                "useBuiltIns": "entry",
                                "corejs": "3.41"
                                }
                            ]
                        ]
                    }
                }
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin(
            {
                title: "Visible",
                template: './src/index.html',
                filename: 'index.html',
                minify: {
                    collapseWhitespace: false,
                    removeComments: true
                },
                inject: 'body',
            }
        ),
        new MiniCssExtractPlugin(
            {
                filename: 'main.css'
            }
        ),
    ],
}
