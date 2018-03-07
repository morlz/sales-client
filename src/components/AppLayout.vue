<template>
<div class="appWrapper">
	<slot name="icons"/>
	<slot name="styles"/>

	<q-window-resize-observable @resize="app_view_resize" />

	<transition name="fadeZoom" appear key="mainTransition">
		<q-layout
			view="lhh LpR lff"
			v-if="logined"
			:left-style="menuWrapperStyle"
			:left-class="{ menuWrapper: true }"
			:header-class="{ 'app__headerNoShadow' : !app_layout_headerShadow }"
			v-model="open"
			ref="layout"
			class="app"
		>
			<slot name="menu" slot="left"/>
			<slot name="header" slot="header"/>

			<div class="app__content">
				<slot/>
			</div>

			<slot name="footer" slot="footer"/>
		</q-layout>
	</transition>

	<transition name="fadeZoom" appear key="authTransition">
		<div class="appMainAuth" v-if="!logined">
			<slot name="auth"/>
		</div>
	</transition>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QLayout, QWindowResizeObservable } from 'quasar'

export default {
	data() {
		return {
			layoutLoaded: false,
			layoutLoadedCheckInterval: false,
		}
	},
	components: {
		QLayout,
		QWindowResizeObservable
	},
	watch: {
		local_nav_open (n) {
			this.nav_openLeftSet(n)
		},
		nav_open (n) {
			if (this.app_view_desktop) return
			if (!this.layoutLoaded) return
			if (this.$refs.layout.leftState.openedSmall != n.left)
				this.$refs.layout.leftState.openedSmall = n.left

			let pos = n.left ? 0 : -300
			if (this.$refs.layout.leftState.position != pos)
				this.$refs.layout.leftState.position = pos

			if (this.$refs.layout.backdrop.percentage != +n.left)
				this.$refs.layout.backdrop.percentage = +n.left

			if (this.$refs.layout.backdrop.touchEvent != true)
				this.$refs.layout.backdrop.touchEvent = true
		}
	},
	computed: {
		...mapGetters([
			'logined',
			'nav_open',
			'app_view_mobile',
			'app_view_desktop',
			'app_layout_headerShadow'
		]),
		open: {
			get () {
				return this.nav_open
			},
			set (n) {
				this.nav_openSet(n)
			}
		},
		local_nav_open () {
			if (!this.layoutLoaded)
				return false

			return this.$refs.layout.leftState.openedSmall
		},
		menuWrapperStyle () {
			return {
				width: !this.app_view_desktop ? '300px' : '80px'
			}
		}
	},
	methods: {
		...mapMutations([
			'nav_openSet',
			'app_view_resize',
			'nav_openLeftSet'
		])
	},
	mounted() {
		this.layoutLoadedCheckInterval = setInterval(() => {
			if (!this.$refs.layout) return
			clearTimeout(this.layoutLoadedCheckInterval)
			this.layoutLoaded = true
		}, 30)
	}
}
</script>


<style lang="less">
.menuWrapper {
	overflow: visible;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
}

.layout-aside.fixed {
	z-index: 3000;
}

.mainWrapper {
	padding: 10px;
}


.appWrapper {
    height: 100%;
    .app {
		&__content {
			height: 100%;
			overflow: auto;
		}

		&__headerNoShadow {
			box-shadow: none;
		}
    }

	.layout-page-container {
		height: calc(100% ~"-" 50px);
	}
}



@media screen and (max-width: 768px) {
	.appWrapper {
		.app {
			.logo {
				display: none;
			}
			.mainContentWrapper {
				width: 100%;
			}
		}
	}
}
</style>
