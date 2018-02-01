<template>
<div class="gallery">
	<v-gallery :images="content" :index="fullScreen" @close="closeFull" />

	<div class="preview" ref="prev" :style="{ height: prevHeight + 'px' }" @click="openFull(currentVisible)">
		<img class="image"
			:src="content[currentVisible]" alt=""
			:style="{ opacity: currentOpacity }">
	</div>

	<div class="carusel" ref="carusel" :class="{ hide: content.length < 2 }">
		<div class="inner" :key="pageIndex" v-for="pageIndex in pageCount" :style="{ left: -100 * (page - pageIndex) + '%' }">
			<div class="image"
				v-for="index in imagesPerPage"
				:key="index"
				:style="{ 'background-image' : `url('${getUrl(index, pageIndex)}')` }"
				@click="selectImage(index)"
				v-if="getUrl(index, pageIndex)"/>
		</div>
	</div>

	<div class="pages" :class="{ hide: pageCount < 2 }">
		<div class="page" v-for="pageIndex in pageCount" :class="{ current: pageIndex == page }" @click="selectPage(pageIndex)"/>
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import vGallery from 'vue-gallery'

export default {
	props: {
		content: {
			type: Array,
			default: a => [],
			required: true
		}
	},
	data() {
		return {
			fullScreen: -1,
			current: 0,
			currentVisible: 0,
			currentOpacity: 1,
			currentTimer: false,
			page: 1,
			width: 0,
			prevHeight: 0
		}
	},
	components: {
		vGallery
	},
	watch: {
		current (n) {
			if (this.currentTimer)
				clearTimeout(this.currentTimer)

			this.currentTimer = setTimeout(a => {
				this.currentOpacity = 1
				this.currentVisible = n
			}, 200)

			this.currentOpacity = 0
		},
		content (n) {
			this.current = 0
			this.currentVisible = 0
			this.checkSize()
		}
	},
	computed: {
		imagesPerPage () {
			return Math.floor(this.width / (100 + 20))
		},
		pageCount () {
			if (!this.imagesPerPage) return 0
			return Math.ceil(this.content.length / this.imagesPerPage)
		}
	},
	methods: {
		getUrl (index, page) {
			return this.content[(page -1) * this.imagesPerPage + (index - 1)]
		},
		selectImage (index) {
			this.current = (this.page - 1) * this.imagesPerPage + index - 1
		},
		selectPage (index) {
			this.page = index
		},
		openFull (index) {
			this.fullScreen = index
		},
		closeFull () {
			this.fullScreen = -1
		},
		checkSize () {
			if (this.$refs.carusel) this.width = this.$refs.carusel.clientWidth
			if (this.$refs.prev) this.prevHeight = this.$refs.prev.clientWidth
		}
	},
	mounted () {
		this.checkSize()
		window.addEventListener("resize", this.checkSize)
	},
	beforeDestroy () {
		window.removeEventListener("resize", this.checkSize)
	}
}
</script>


<style lang="less">
.gallery {
	.preview {
		padding: 20px;
		width: 100%;
		display: grid;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		max-height: 500px;
		.image {
			max-width: 100%;
			max-height: 100%;
			cursor: zoom-in;
			transition: all 0.2s ease-in-out;
		}
	}

	.carusel {
		width: 100%;
		position: relative;
		height: 100px;
		trnasition: all 0.3s ease-in-out;
		.inner {
			transition: all 0.3s ease-in-out;
			position: absolute;
			top: 0;
			left: 0;
			display: grid;
			grid-auto-flow: column;
			grid-gap: 20px;
			width: 100%;
			justify-content: space-around;
			align-items: center;
			.image {
				width: 100px;
				height: 100px;
				background-position: center;
				background-size: 100%;
				cursor: pointer;
				opacity: 0.8;
				transition: all 0.3s ease-in-out;
				background-repeat: no-repeat;
				&:hover {
					opacity: 1;
				}
			}
		}
	}

	.pages {
		padding: 20px;
		display: grid;
		grid-gap: 15px;
		grid-auto-flow: column;
		justify-content: center;
		trnasition: all 0.3s ease-in-out;
		.page {
			margin: 2px;
			width: 12px;
			height: 12px;
			border-radius: 100%;
			background: #027be3;
			opacity: 0.6;
			transition: all 0.3s ease-in-out;
			cursor: pointer;
			&:hover {
				margin: 0;
				width: 16px;
				height: 16px;
				opacity: 1;
			}
		}
		.current {
			opacity: 1;
		}
	}

	.hide {
		box-sizing: border-box;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}
}
</style>
