<template>
<div class="AppWrapper">
	<q-ajax-bar :delay="200"/>
	<q-window-resize-observable @resize="app_view_resize" />

	<transition name="fadeZoom" appear key="mainTransition">
		<q-layout
			view="lhh Lpr lff"
			v-if="logined && auth_can(1, 'App')"
			ref="layout"
			class="AppLayout"
		>
			<q-layout-header :class="{ 'no-shadow' : !app_layout_headerShadow }">
				<app-header/>
			</q-layout-header>

			<q-layout-drawer
				side="left"
				v-model="menuLeftOpen"
				:content-style="menuWrapperStyle">
				<app-menu/>
			</q-layout-drawer>

			<q-page-container>
				<router-view :key="$route.fullPath"/>
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
import { AuthMixin } from '@/mixins'

export default {
	components: {
		AppMenu,
		AppHeader,
		AppMainAuth,
		QAjaxBar,
		QWindowResizeObservable
	},
	mixins: [AuthMixin],
	data() {
		return {
			menuLeftOpen: true,
			layoutLoaded: false,
			layoutLoadedCheckInterval: false,
		}
	},
	watch: {
		local_nav_open (n) {
			this.nav_openLeftSet(n)
		},
		nav_open (n) {
			this.menuLeftOpen = !this.menuLeftOpen
		},
		logined (n) {
			this.menuLeftOpen = n
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
	created () {
		this.layoutLoadedCheckInterval = setInterval(() => {
			if (!this.$refs.layout) return
			clearTimeout(this.layoutLoadedCheckInterval)
			this.layoutLoaded = true
		}, 30)
	}
}
</script>


<style lang="stylus">
.AppContent
	background #eee
	&__inner
		margin 10px
		box-sizing border-box


.no-shadow
	box-shadow: none;

.AppLayout
	height 100vh


//@media screen and (max-width: 768px)


</style>
