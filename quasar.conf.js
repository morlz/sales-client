module.exports = function(ctx) {
	console.log(ctx)

	return {
		framework: 'all',
		build: {
			extendWebpack(ctx)
		}
	}
}
