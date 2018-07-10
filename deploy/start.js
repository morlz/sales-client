const {
	deploy
} = require('sftp-sync-deploy')
const auth = require('./config')
const moment = require('moment')

function log () {
	let args = Array.from(arguments)
	args.unshift(moment().format('YYYY MMMM DD HH:mm:ss:SSSS'))
	args.unshift(`deploy:start`)
	console.log.apply(null, args)
}

const config = Object.assign({
	localDir: 'dist/spa-mat', // Required, Absolute or relative to cwd.
	remoteDir: '/var/www/sales/client' // Required, Absolute path only.
}, auth)


let options = {
	dryRun: false, // Enable dry-run mode. Default to false
	exclude: [ // exclude patterns (glob)
		'node_modules'
	],
	excludeMode: 'remove', // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
	forceUpload: false // Force uploading all files, Default to false(upload only newer files).
}

log(`start`)

deploy(config, options)
	.then(() => log('success!'))
	.catch(err => log('error! ', err))
