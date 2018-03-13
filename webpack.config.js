const 	webpack = require('webpack'),
		path = require('path'),
		ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
		UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
		OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin'),
		DashboardPlugin = require('webpack-dashboard/plugin'),
		WriteFilePlugin = require('write-file-webpack-plugin'),
		CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
		entry: './assets/js/app.js',
		output: {
			path: path.resolve(__dirname, './dist'),
			publicPath: 'http://cpo.internal/cpo/',
			filename: './bundle.js',
			hotUpdateChunkFilename: '_hot/hot-update.js',
			hotUpdateMainFilename: '_hot/hot-update.json'
		},
		resolve: {
			modules: [
				path.resolve('./assets/js'),
				path.resolve('./assets/sass'),
				'node_modules'
			]
		},
		module: {
				rules: [{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
                    test: /\.scss$/,
                    use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
                            fallback: 'style-loader',
                            use: ['css-loader', 'sass-loader', 'postcss-loader'],
                    }))
				},
				{
					test: /\.(png|jp(e*)g|svg|xml|icon|webmanifest)$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								name: 'assets/icons/[name].[ext]'
							}
						}
					]
                }]
			},
			plugins: [
				new ExtractTextWebpackPlugin('[name].css'),
				new DashboardPlugin,
				new WriteFilePlugin(),
				new CopyWebpackPlugin([
					{ from: './assets/icons', to: './icons' },
				])
			],
			devServer: {
				contentBase: path.resolve(__dirname, './dist'),
				publicPath: "./dist",
				historyApiFallback: true,
				inline: true,
				open: true,
				hot: true,
			},
			devtool: 'eval-source-map'
	}

module.exports = config;

if (process.env.NODE_ENV === 'production') {
		module.exports.plugins.push(
				new webpack.optimize.UglifyJsPlugin(),
				new OptimizeCSSAssets()
		);
}


/*
*
* ===============================================================================================
*
* HANDLING FILES ON DEV SERVER
*
* WriteFilePlugin
* ===============
* Forces webpack-dev-server program to write bundle files to the file system.
* This plugin has no effect when webpack program is used instead of webpack-dev-server.
*
* CopyWebpackPlugin
* =================
* Copies individual files or entire directories to the build directory.
*
* ===============================================================================================
*
*/