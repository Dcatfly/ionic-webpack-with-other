var path = require('path'),
	config = require('../config'),
	utils = require('./utils'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: './src/entry'
	},
	output: {
		path: config.build.assetsRoot,
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
		filename: '[name].js'
	},

	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	module: {
		loaders: [{
			test: /\.css$/,
      loader: process.env.NODE_ENV === 'production' ? ExtractTextPlugin.extract("style-loader", 'css-loader!postcss-loader') : "style-loader!css-loader!postcss-loader"
		}, {
			test: /\.html$/,
			loader: 'html'
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.scss$/,
			loader: 'style!css!sass?outputStyle=expanded'
		}, {
			test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
			loader: 'file',
			query: {
				limit: 10000,
				publicPath: '../',
				name: utils.assetsPath('./css/font/[name].[hash:7].[ext]')
			}
		}, {
			test: /[\/]angular\.js$/,
			loader: 'exports?angular'
		}, {
			test: /[\/]ionic\.js$/,
			loader: 'exports?ionic'
		},
			{
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				loaders: [
					'url?limit=10000&name=' + utils.assetsPath('img/[name].[hash:7].[ext]'),
					'image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'

				]

			}]
	},
	postcss: [
		require('autoprefixer')({
			browsers: ['last 5 version', 'last 5 iOS versions', 'last 5 Android versions']
		})
	],
	resolve: {
		root: [
			path.join(__dirname, 'src'),
			path.join(__dirname, 'node_modules'),
		],
		moduleDirectories: [
			'node_modules'
		],
		alias: {}
	},

}
