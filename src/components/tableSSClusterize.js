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
			this.createCache(n)
		}
	},
	computed: {
		scrollHandlerThrottled () {
			return throttle(this.scrollHandler, 300, {
				trailing: true
			})
		}
	},
	methods: {
		createCache (n) {
			cache = [...(n || this.content)]
			this.$forceUpdate()
		},
		scrollHandler () {
			this.$forceUpdate()
		}
	},
	mounted () {
		this.createCache()
	},
	render(h) {
		let domEl = document.getElementById('clusterize'),
			cachedSlot = current => typeof current !== 'object' ?
						this.$scopedSlots.default({
							item: cache[current],
							index: current
						})
					:	current

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
		for (let chunk = offsetFromStart - outerRenderCount; chunk < offsetFromStart + showCount + outerRenderCount; chunk++)
			for (let item = 0; item < chunkSize; item++)
				if (chunk * chunkSize + item < itemsCount && chunk * chunkSize + item >= 0) items.push(chunk * chunkSize + item)

		items.push(this.$slots.end)

		return h(
			'div', {
				class: 'clusterize',
				style: {
					overflowY: 'auto',
					transform: 'translateZ(0)'
				},
				on: {
					scroll: this.scrollHandlerThrottled
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
					items.map(current => cachedSlot(current))
				)
			]
		)
	}
}
