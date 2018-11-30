const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rootPath = path.resolve(__dirname, '../');
// let isDevServer = process.env.WEBPACK_SERVE ? true : false;
let plugins = [
	new CleanWebpackPlugin(['dist'], {
		root: path.resolve(rootPath)
	}),
	/* compile主page */
	new HtmlWebpackPlugin({
		template: 'src/index.ejs',
		hash: true,
		filename: path.resolve(rootPath, 'site/index.html'),
		env: process.env.MK_ENV || 'development',
		inject: 'head'
	}),		
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),	
	new MiniCssExtractPlugin({
		filename: 'mkbs-style.css',		
	})
]

let config = {
	entry: ['components/index.js'],
	output: {
		filename: 'js/bundle.[hash:16].js',		
		path: path.resolve(rootPath, 'dist')
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
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
					// {
					// 	loader: 'style-loader'
					// },
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
					{
						loader: 'style-loader'
					},			
					{
						loader: 'css-loader', // translates CSS into CommonJS												
					}
				]
			}		
		]
	},
	resolve: {
		alias: {
			'root': path.resolve(rootPath, 'src')
		},
		extensions: ['.js', '.jsx', '.less']
	}
}
module.exports = config;