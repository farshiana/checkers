const webpack                 = require('webpack');
const path                    = require('path');
const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Visualizer              = require('webpack-visualizer-plugin');
const OfflinePlugin           = require('offline-plugin');

const ENV = process.env.NODE_ENV;
const dev = (ENV === "dev");

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: ({ resource }) => /node_modules/.test(resource),
	}),

	new webpack.optimize.CommonsChunkPlugin('manifest'),

	new ExtractTextPlugin({
		filename : 'style.css',
		allChunks: true
	}),

	new HtmlWebpackPlugin({
		hash       : true,
		template   : 'src/index.ejs',
		environment:  ENV
	}),

	// Global variables
	new webpack.DefinePlugin({
		ENV: JSON.stringify(ENV)
	}),

	// Global modules
	new webpack.ProvidePlugin({
		Constants: [path.resolve(__dirname, 'src/constants'), 'default']
	})
];

if(dev){
	plugins.push(new Visualizer());
}else{
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},

			parallel: {
				cache  : true,
				workers: 2
			}
		}),

		new OptimizeCssAssetsPlugin(),

		new OfflinePlugin()
	);
}

module.exports = {

	entry: {
		bundle: './src/main.js'
	},

	output: {
		path      : path.join(__dirname, 'dist'),
		filename  : '[name]' + (dev ? '': '.[chunkhash:8]') + '.js',
		publicPath: ""
	},

	resolve: {

		alias: {
			Source    : path.resolve(__dirname, 'src'),
			Components: path.resolve(__dirname, 'src/components'),
			Helpers   : path.resolve(__dirname, 'src/helpers'),
			Models    : path.resolve(__dirname, 'src/models'),
			Assets    : path.resolve(__dirname, 'src/assets')
		},
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},

			{
				test: /\.(css|scss)$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader', 'postcss-loader']
				})
			},

			{
				test: /\.styl$/,
				loader: ['style-loader', 'css-loader', 'stylus-loader']
			},

			{
				test: /\.(jpe?g|png|gif)$/,
				loader: 'file-loader',
				options: {
					name: '[path]/[name].[ext]?[hash]',
					context: 'src'
				}
			},

			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader'
				}
			},

			{
				test: /manifest.json$/,
				loader: 'file-loader',
				options: {
					name: 'manifest.json?[hash]'
				}
			}
		]
	},

	plugins: plugins
};