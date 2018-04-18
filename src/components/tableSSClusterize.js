import throttle from 'lodash.throttle'
import isEqual from 'lodash.isequal'
import { QSpinnerBall } from 'quasar'


let cache = [],
	lastState = false

export default {
	props: {
		content: {
			type: Array,
			required: true
		},
		contentTag: {
			type: String,
			default: a => "div"
		},
		chunkSize: {
			type: Number,
			default: a => 4
		},
		itemHeight: {
			type: [String, Number],
			required: true
		},
		outerRenderCount: {
			type: [String, Number],
			default: a => 2
		}
	},
	watch: {
		content(n) {
			this.createCache(n)
		}
	},
	computed: {
		scrollHandlerThrottled () {
			return throttle(this.scrollHandler, 30, {
				trailing: true
			})
		}
	},
	methods: {
		createCache (n) {
			console.log('[cluster] [createCache] cache changed')
			cache = [...(n || this.content)]
			this.$forceUpdate()
		},
		scrollHandler (e) {
			let state = this.getState()
			if (!isEqual(lastState, state.items))
				this.$forceUpdate()
		},
		getState () {
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
			for (let chunk = offsetFromStart - outerRenderCount; chunk < offsetFromStart + showCount + outerRenderCount; chunk++)
				for (let item = 0; item < chunkSize; item++)
					if (chunk * chunkSize + item < itemsCount && chunk * chunkSize + item >= 0) items.push(chunk * chunkSize + item)

			let offset = {
				top: 0,
				bottom: 0
			}

			if (!items.includes(0) && items.length)
				offset.top -= 90

			if (!items.includes(cache.length - 3) && items.length)
				offset.bottom -= 90

			return {
				items,
				style: {
					marginTop: (offsetFromStart - outerRenderCount < 0 ? 0 : offsetFromStart - outerRenderCount) * chunkHeight + offset.top + 'px',
					marginBottom: (offsetFromEnd - outerRenderCount > chunksCount ? chunksCount : offsetFromEnd - outerRenderCount) * chunkHeight + offset.bottom + 'px'
				}
			}
		}
	},
	mounted () {
		this.createCache()
	},
	render(h) {
		let t = Date.now()

		const cachedSlot = current => typeof current !== 'object' ?
					this.$scopedSlots.default({
						item: cache[current],
						index: current
					})
				:	current

		const spinnerOptions = {
			class: { spinner: true },
			props: { size: 50 },
		}

		let { items, style } = this.getState()

		lastState = items

		if (!items.includes(0) && items.length)
			items.unshift( h( QSpinnerBall, spinnerOptions ) )

		if (!items.includes(cache.length - 3) && items.length)
			items.push( h( QSpinnerBall, spinnerOptions ) )

		let res = h(
			'div', {
				class: 'clusterize',
				style: {
					overflowY: 'auto',
					//transform: 'translateZ(0)'
				},
				on: {
					scroll: this.scrollHandlerThrottled
				},
				domProps: {
					id: 'clusterize'
				}
			}, [
				this.$slots.start,
				h(
					this.contentTag, {
						class: 'clusterize__scroll',
						style,
						ref: 'scroll'
					},
					items.map(current => cachedSlot(current))
				),
				this.$slots.end
			]
		)

		t = Date.now() - t

		console.log(`[cluster] [render] rendered ${items.length} items in ${t} ms ~${(1e3 / t).toFixed()} fps`)
		return res
	}
}
