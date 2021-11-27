//plugins for webpack
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';
import { URL } from 'url';
const formatFullPath = path => process.platform === 'win32' ? path.substr(1) : path

export default {
    // output: {
    //     filename: 'bundle.js'
    // },
    resolve: {
        extensions: [".scss", ".js", ".jsx", ".tsx", ".ts"],
        plugins: []
    },
    module: {
        rules: [
            {
                //this is another webpack 5 feature you don't get with CRA on webpack 4.  It can automatically pull any 
                //files we reference and spit them out as assets in the output folder.  In webpack 4 you had to use file loader, url loader, and so on
                //no more with webpack 5, much simpler.
                test: /\.(woff(2)?|ttf|eot|svg|jpg|jpeg|png|gif|pdf)(\?v=\d+\.\d+\.\d+)?$/, //here we tell webpack that all fonts, images, pdfs are are asset/resource
                type: 'asset/resource'
            },
            {
                test: /\.(scss|sass)$/, //tell webpack how to process scss and sass files
                // include: [
                //     paths.src,
                //     paths.nodemodules //our vendor files etc will resolve files from node_modules so we need to tell webpack sass to include node_modules
                // ],
                use: [ //use tells this rule what loaders to use, loaders are used in a last to first order.  So the last loader is processed first, then the loader above it, till the first loader.
                    {
                        //note, in production you should use a css extractor here instead but extracting css is slow so using style-loader is much faster in development
                        loader: 'style-loader', // docs -> https://webpack.js.org/loaders/style-loader/
                        options: {
                            esModule: false,
                            insert: 'head'
                        }
                    },
                    {
                        loader: 'css-loader', //docs -> https://www.npmjs.com/package/css-loader
                        options: {
                            modules: false, //disable modules, this build isn't using styled components in react
                            esModule: false,  //disable es module syntax
                            sourceMap: true //Enables/Disables generation of source maps
                        }
                    },
                    {
                        loader: 'postcss-loader', //docs -> https://github.com/webpack-contrib/postcss-loader
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',

                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title: 'Your App Name Here',
            // fileName: 'index.html',
            // inject: 'body', //tell html webpack plugin where to inject scripts, body places them at end of body
            // publicPath: '/',
            // hash: true,
            // cache: true,
            // showErrors: true
        }),
        new WasmPackPlugin({
            crateDirectory: formatFullPath(new URL('.', import.meta.url).pathname),
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
    },
    devServer: {
        port: '8080',
    },
}