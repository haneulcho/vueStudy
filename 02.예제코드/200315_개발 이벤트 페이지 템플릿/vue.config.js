const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const EV_CONFIG = require('./src/config/event.config.js')
const TextReplaceHtmlWebpackPlugin = require('text-replace-html-webpack-plugin')

module.exports = {
	publicPath: '',
	indexPath: EV_CONFIG.fileName.html,
	filenameHashing: false,
	productionSourceMap: false,
	configureWebpack: {
		devtool: 'source-map',
		output: {
			filename: EV_CONFIG.fileName.js
		},
		optimization: {
			splitChunks: false
		}
	},
	css: {
		extract: true
	},
	devServer: {
		proxy: {
			'/api': {
				target: process.env.VUE_APP_API_WEBMW_URL,
				changeOrigin: true
			}
		}
	},

	chainWebpack: config => {
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		const apiClient = process.env.VUE_APP_API_CLIENT
		types.forEach(type =>
			addStyleResource(config.module.rule('scss').oneOf(type))
		)
		console.log(apiClient)
		config.resolve.alias.set(
			'~', path.resolve(__dirname, `src/${apiClient}`)
		)
		config.plugins.delete('preload')
		config.plugins.delete('prefetch')
		config
			.plugin('extract-css')
			.tap(([options, ...args]) => [
				Object.assign({}, options, {
					filename: EV_CONFIG.fileName.css,
					publicPath: (devMode) ? '' : EV_CONFIG.filePath.css
				}),
				...args
			])

		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => ({
				...options,
				limit: -1,
				fallback: {
					loader: 'file-loader',
					options: {
						publicPath: (devMode) ? EV_CONFIG.folderName : EV_CONFIG.filePath.image,
						outputPath: EV_CONFIG.folderName,
						name: '[path][name].[ext]',
						context: 'src/assets'
					}
				}
			}))

		config.module
			.rule('scss')
			.oneOf('vue')
			.use('resolve-url-loader')
			.loader('resolve-url-loader')
			.before('sass-loader')
			.end()
			.use('sass-loader')
			.loader('sass-loader')
			.tap(options => ({
				...options,
				publicPath: (devMode) ? '' : EV_CONFIG.filePath.css
			}))

		config
			.plugin('html')
			.tap(([options, ...args]) => [
				Object.assign({}, options, {
					minify: false,
					cache: false,
					template: path.resolve(__dirname, `./public/${EV_CONFIG.fileName.html}`),
					jsPublicPath: EV_CONFIG.filePath.js,
					cssPublicPath: EV_CONFIG.filePath.css,
					title: EV_CONFIG.opengraph.title,
					desc: EV_CONFIG.opengraph.desc,
					author: EV_CONFIG.opengraph.author,
					copyright: EV_CONFIG.opengraph.copyright,
					keywords: EV_CONFIG.opengraph.keywords,
					url: EV_CONFIG.opengraph.url,
					image: EV_CONFIG.opengraph.image,
					gameStartLogId: EV_CONFIG.gameInfo.logId,
					gameStartLogName: EV_CONFIG.gameInfo.logName
				}),
				...args
			])

		if (!devMode) {
			config
				.plugin('replace-string')
				.use(TextReplaceHtmlWebpackPlugin)
				.tap(([options, ...args]) => [
					Object.assign({}, options, {
						replacementArray: [
							{
								searchString: EV_CONFIG.fileName.css,
								replace: `${EV_CONFIG.filePath.css}/${EV_CONFIG.fileName.css}`
							},
							{
								searchString: EV_CONFIG.fileName.js,
								replace: `${EV_CONFIG.filePath.js}/${EV_CONFIG.fileName.js}`
							}
						]
					}),
					...args
				])
		}
	}
}

function addStyleResource(rule) {
	rule
		.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/styles/functions/*.scss'),
				path.resolve(__dirname, './src/styles/mixins/*.scss'),
				path.resolve(__dirname, './src/styles/variables/*.scss')
			]
		})
}