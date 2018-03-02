<template>
<div class="clusterize" @scroll="throttledScroll">
	<slot name="start-outer"/>

	<div class="clusterize__scroll" ref="scroll" :style="scrollStyles">
		<slot name="start-inner"/>

		<template v-for="index in visibleClusterIndexesFiltred">
			<div class="clusterize__cluster">
				<slot v-for="item, itemIndex in clusters[index]" :item="item" :index="index * clusterSize + itemIndex"/>
			</div>
		</template>

		<slot name="end-inner"/>
	</div>

	<slot name="end-outer"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

const throttle = require('lodash.throttle')

export default {
	props: {
		content: {
			type: Array,
			required: true
		},
		clusterSize: {
			type: Number,
			default: a => 30
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
	data() {
		return {
			scrollTop: 0,
			parentHeight: 0,
			childHeight: 0
		}
	},
	computed: {
		clusters () {
			let clusters = []

			for (var i = 0; i < this.content.length; i += this.clusterSize) {
				let cluster = []
				for (var j = 0; (j < this.clusterSize && j + i < this.content.length); j++)
					cluster.push(this.content[i + j])

				clusters.push(cluster)
			}

			return clusters
		},
		clusterHeight () {
			return this.itemHeight * this.clusterSize
		},
		viewPortStart () {
			return this.scrollTop
		},
		viewPortEnd () {
			return this.scrollTop + this.parentHeight
		},
		visibleClusterIndexes () {
			let tmp = []

			for (var index = 0; index < Math.ceil(this.content.length / this.clusterSize); index++) {
				let startIndex = index - this.outerRenderCount,
					endIndex = index + this.outerRenderCount

				let clusterStart = startIndex * this.clusterHeight,
					clusterEnd = endIndex * this.clusterHeight

				let res = (clusterStart <= this.viewPortEnd && clusterEnd >= this.viewPortEnd) ||
						(clusterEnd >= this.viewPortStart && clusterStart <= this.viewPortStart) ||
						(clusterStart >= this.viewPortStart && clusterEnd <= this.viewPortEnd)

				tmp.push(res)
			}

			return tmp
		},
		visibleClusterIndexesFiltred () {
			let tmp = []
			this.visibleClusterIndexes.forEach((el, index) => el ? tmp.push(index) : null)
			return tmp
		},
		throttledScroll () {
			return throttle(this.scroll, 300)
		},
		scrollStyles () {
			let tmp = [...this.visibleClusterIndexes],
				paddingTop = tmp.indexOf(true) * this.clusterHeight,
				paddingBottom = tmp.reverse().indexOf(true) * this.clusterHeight

			return {
				paddingTop: paddingTop >= 0 ? paddingTop + 'px' : 0,
				paddingBottom: paddingBottom >= 0 ? paddingBottom + 'px' : 0,
			}
		}
	},
	methods: {
		scroll (e) {
			if (!this.$el) return
			this.scrollTop = this.$el.scrollTop
			this.parentHeight = this.$el.offsetHeight
			if (!this.$refs.scroll) return
			this.childHeight = this.$refs.scroll.offsetHeight
		}
	},
	mounted () {
		this.scroll()
	}
}
</script>


<style lang="less">

</style>
