const {
	deploy
} = require('sftp-sync-deploy')
const auth = require('./config')

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

deploy(config, options)
	.then(() => console.log('success!'))
	.catch(err => console.error('error! ', err))
