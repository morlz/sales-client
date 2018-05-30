// Configuration for your app
const path = require('path')
const util = require('util')
const webpack = require('webpack')

const config = {
	dev: {
		distDir: path.resolve(__dirname, 'dist'),
		filesPath: path.resolve(__dirname, 'dist'),
		indexPath: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	prod: {
		distDir: path.join('..', 'sales-server-test', 'web'),
		filesPath: path.resolve(__dirname, '..', 'sales-server', 'web', 'assets'),
		indexPath: path.resolve(__dirname, '..', 'sales-server', ''),
		publicPath: path.join('web', 'assets')
	}
}

module.exports = function(ctx) {
	const options = config[ctx.dev ? 'dev' : 'prod']

	return {
		// app plugins (/src/plugins)
		plugins: [
			'i18n',
			'axios',
			'ElementUI',
			'routerSync',
			'FastGridArea',
			'VueGoogleMaps',
			'moment',
			'three'
		],
		css: [
			'app.styl',
			'icons.less'
		],
		extras: [
			//ctx.theme.mat ? 'roboto-font' : null,
			'material-icons',
			// 'ionicons',
			// 'mdi',
			'fontawesome'
		],
		supportIE: true,
		/*
		vendor: {
			add: [],
			remove: []
		},
		*/
		build: {
			scopeHoisting: true,
			vueRouterMode: 'hash',
			//publicPath: options.publicPath,
			//distDir: options.distDir,
			minify: true,
			gzip: true,
			// analyze: true,
			// extractCSS: false,
			// useNotifier: false,
			extendWebpack(cfg) {
				/*
				cfg.output = {
					...cfg.output,
					path: options.filesPath,
					publicPath: options.publicPath,
				}

				for (var prop in cfg.plugins)
					if (cfg.plugins.hasOwnProperty(prop))
						if (cfg.plugins[prop].constructor.name === 'HtmlWebpackPlugin')
							cfg.plugins[prop].options.filename = path.join(options.indexPath, 'index.html')


				console.log(cfg.output, cfg)

				*/
				cfg.resolve.alias['@'] = path.resolve('src')
				cfg.resolve.alias['three.examples'] = path.join(__dirname, 'node_modules/three/examples/js')

				cfg.plugins.push(new webpack.ProvidePlugin({ 'THREE': 'three' }))

				//cfg.resolve.alias
				//console.log(util.inspect(cfg, { depth: null }));
			}
		},
		devServer: {
			// https: true,
			// port: 8080,
			host: '0.0.0.0',
			open: true, // opens browser window automatically
			proxy: {
				'/web': {
					//target: 'http://sales-test.ladyagroup.ru/nsl',
					target: 'http://127.0.0.1/sales-server/',
					changeOrigin: true
				},
				'/tiss': {
					target: 'http://localhost/',
					changeOrigin: true
				}
			}
		},
		// framework: 'all' --- includes everything; for dev only!
		framework: {
			components: [
				'QLayout',
				'QLayoutHeader',
				'QLayoutDrawer',
				'QPageContainer',
				'QPage',
				'QToolbar',
				'QToolbarTitle',
				'QBtn',
				'QIcon',
				'QList',
				'QListHeader',
				'QItem',
				'QItemMain',
				'QItemSide',
				'QItemTile',
				'QItemSeparator',
				'QCollapsible',
				'QCard',
				'QCardMain',
				'QCardActions',
				'QCardMedia',
				'QCardTitle',
				'QCardSeparator',
				'QSelect',
				'QInput',
				'QField',
				'QInnerLoading',
				'QSpinnerBall',
				'QTabs',
				'QTab',
				'QTabPane',
				'QTooltip',
				'QPopover',
				'QModal',
				'QModalLayout',
				'QCheckbox',
				'QToggle',
				'QDatetime',
				'QScrollArea'
			],
			directives: [
				'Ripple',
				'CloseOverlay',
				'Scroll'
			],
			// Quasar plugins
			plugins: [
				'Notify',
				'LocalStorage',
				'Dialog',
				'Loading'
			],
			i18n: 'ru'
		},
		// animations: 'all' --- includes all animations
		animations: [
			'zoomInRight',
			'zoomOutRight'
		],
		pwa: {
			cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
			manifest: {
				// name: 'Quasar App',
				// short_name: 'Quasar-PWA',
				// description: 'Best PWA App in town!',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#ffffff',
				theme_color: '#027be3',
				icons: [{
						'src': 'statics/icons/icon-128x128.png',
						'sizes': '128x128',
						'type': 'image/png'
					},
					{
						'src': 'statics/icons/icon-192x192.png',
						'sizes': '192x192',
						'type': 'image/png'
					},
					{
						'src': 'statics/icons/icon-256x256.png',
						'sizes': '256x256',
						'type': 'image/png'
					},
					{
						'src': 'statics/icons/icon-384x384.png',
						'sizes': '384x384',
						'type': 'image/png'
					},
					{
						'src': 'statics/icons/icon-512x512.png',
						'sizes': '512x512',
						'type': 'image/png'
					}
				]
			}
		},
		cordova: {
			// id: 'org.cordova.quasar.app'
		},
		electron: {
			extendWebpack(cfg) {
				// do something with cfg
			},
			packager: {
				// OS X / Mac App Store
				// appBundleId: '',
				// appCategoryType: '',
				// osxSign: '',
				// protocol: 'myapp://path',

				// Window only
				// win32metadata: { ... }
			}
		},

		// leave this here for Quasar CLI
		starterKit: '1.0.2'
	}
}
