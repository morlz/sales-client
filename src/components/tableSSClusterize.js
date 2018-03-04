const throttle = require('lodash.throttle')

let cache = []

export default {
	props: {
		content: {
			type: Array,
			required: true
		},
		chunkSize: {
			type: Number,
			default: a => 30
		},
		itemHeight: {
			type: [String, Number],
			required: true
		},
		outerRenderCount: {
			type: [String, Number],
			default: a => 3
		}
	},
	watch: {
		content(n) {
			console.log('create cache')

			let timeStart = Date.now()

			cache = [...n]

			let time = Date.now() - timeStart

			if (time < 1000)
				console.log('cache created in', time.toFixed(), 'ms')
			else
				console.log('cache created in', (time / 1e3).toFixed(3), 's')


			this.$forceUpdate()
		}
	},
	render(h) {
		let timeStart = Date.now()
		let domEl = document.getElementById('clusterize')

		let chunkSize = this.chunkSize,
			itemsCount = this.content.length,
			chunksCount = Math.ceil(itemsCount / chunkSize),
			outerRenderCount = this.outerRenderCount,
			chunkHeight = chunkSize * this.itemHeight

		let offsetFromStart = Math.floor((domEl ? domEl.scrollTop : 0) / chunkHeight),
			showCount = Math.ceil((domEl ? domEl.offsetHeight : 0) / chunkHeight),
			offsetFromEnd = chunksCount - offsetFromStart - showCount

		if (showCount > chunksCount)
			showCount = chunksCount

		let items = []
		//fill normal
		for (let chunk = offsetFromStart - outerRenderCount; chunk < offsetFromStart + showCount + outerRenderCount; chunk++)
			for (let item = 0; item < chunkSize; item++)
				if (chunk * chunkSize + item < itemsCount && chunk * chunkSize + item >= 0) items.push(chunk * chunkSize + item)


		let scrollHandler = e => this.$forceUpdate(),
			cachedSlot = this.$scopedSlots.default

		let res = h(
			'div', {
				class: 'clusterize',
				style: {
					overflowY: 'auto',
					transfom: 'translateZ(0)'
				},
				on: {
					scroll: throttle(scrollHandler, 300, { trailing: true })
				},
				domProps: {
					id: 'clusterize'
				}
			}, [
				h(
					'div', {
						class: 'clusterize__scroll',
						style: {
							marginTop: (offsetFromStart - outerRenderCount < 0 ? 0 : offsetFromStart - outerRenderCount) * chunkHeight + 'px',
							marginBottom: (offsetFromEnd - outerRenderCount > chunksCount ? chunksCount : offsetFromEnd - outerRenderCount) * chunkHeight + 'px'
						},
						ref: 'scroll'
					},
					items.map(
						current => cachedSlot({
							item: cache[current],
							index: current
						})
					)
				)
			]
		)

		let time = Date.now() - timeStart

		if (time < 1000)
			console.log('rendered in', time.toFixed(), 'ms')
		else
			console.log('rendered in', (time / 1e3).toFixed(3), 's')

		return res
	}
}
