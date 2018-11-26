const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rootPath = path.resolve(__dirname, '../');
let isDevServer = process.env.WEBPACK_SERVE ? true : false;
let plugins = [
	new CleanWebpackPlugin(['dist'], {
		root: path.resolve(rootPath),
		allChunks: true
	}),
	/* compile主page */
	// new HtmlWebpackPlugin({
	// 	template: 'src/index.ejs',
	// 	hash: true,
	// 	filename: path.resolve(rootPath, 'site/index.html'),
	// 	env: process.env.MK_ENV || 'development',
	// 	inject: 'head'
	// }),		
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
]

let config = {
	entry: [`${rootPath}/index.js`],
	output: {
		filename: 'js/bundle.[hash:16].js',
		path: path.resolve(rootPath, 'dist')
	},	
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components|lib|tools)/,
				use: {
					loader: 'babel-loader',
				},
				resolve: {
					extensions: ['.js', '.jsx'],
				}
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader', // translates CSS into CommonJS						
					},
					{
						loader: 'less-loader', // compiles Less to CSS						
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader', // translates CSS into CommonJS												
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			'root': path.resolve(rootPath, 'componnets/style')
		},
		extensions: ['.js', '.jsx', '.less']
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(rootPath),
			allChunks: true
		}),
        new MiniCssExtractPlugin({
            filename: '[name].css'
		}),
		
    ]
}
module.exports = config;