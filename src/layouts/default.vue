<template>
<div class="AppWrapper">
	<q-ajax-bar :delay="200"/>
	<q-window-resize-observable @resize="app_view_resize" />

	<transition name="fadeZoom" appear key="mainTransition">
		<q-layout
			view="lhh Lpr lff"
			v-if="logined"
			ref="layout"
			class="AppWrapper__layout"
		>
			<q-layout-header :class="{ 'AppWrapper__headerNoShadow' : !app_layout_headerShadow }">
				<app-header/>
			</q-layout-header>

			<q-layout-drawer
				side="left"
				v-model="menuLeftOpen"
				:content-style="menuWrapperStyle">
				<app-menu/>
			</q-layout-drawer>

			<q-page-container class="AppWrapper__container">
				<router-view />
			</q-page-container>
		</q-layout>
	</transition>

	<transition name="fadeZoom" appear key="authTransition">
		<div class="appMainAuth" v-if="!logined">
			<app-main-auth/>
		</div>
	</transition>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {
	openURL,
	QAjaxBar,
	QWindowResizeObservable
} from 'quasar'

import AppMenu from '@/components/AppMenu'
import AppHeader from '@/components/AppHeader'
import AppMainAuth from '@/pages/main/auth'


export default {
	data() {
		return {
			menuLeftOpen: true,
			layoutLoaded: false,
			layoutLoadedCheckInterval: false,
		}
	},
	components: {
		AppMenu,
		AppHeader,
		AppMainAuth,
		QAjaxBar,
		QWindowResizeObservable
	},
	watch: {
		local_nav_open (n) {
			this.nav_openLeftSet(n)
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
		menuWrapperStyle () {
			return {
				width: !this.app_view_desktop ? '300px' : '80px',
				overflow: 'visible'
			}
		}
	},
	methods: {
		openURL,
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


.AppWrapper {
    height: 100vh;

	&__layout {

	}

	&__container {

	}

	&__headerNoShadow {
		box-shadow: none;
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
