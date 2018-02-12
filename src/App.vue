<template>
	<div id="q-app">
		<app-layout>
			<icons slot="icons"/>
			<global-styles slot="styles"/>
			<app-menu slot="menu"/>
			<app-header slot="header"/>

			<transition name="fade" key="routerTransition">
				<router-view/>
			</transition>

			<main-auth slot="auth"/>
		</app-layout>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters
} from 'vuex'

import AppMenu from '@/components/AppMenu.vue'
import AppHeader from '@/components/AppHeader.vue'
import mainAuth from '@/components/pages/main/auth.vue'
import icons from '@/components/icons.vue'
import globalStyles from '@/components/globalStyles.vue'
import mixins from '@/components/mixins'
import AppLayout from '@/components/AppLayout'

export default {
	mixins: [mixins],
	name: 'app',
	components: {
		AppLayout,
		AppMenu,
		AppHeader,
		mainAuth,
		icons,
		globalStyles
	},
	watch: {
		logined (n) {
			if (!n) return
			if (this.auth_can(1, "TaskType")) this.task_getTypes()
			if (this.auth_can(1, "PreorderStatus")) this.preorder_getStatuses()
		}
	},
	computed: {
		...mapGetters([
			'logined',
		])
	},
	methods: {
		...mapActions([
			'task_getTypes',
			'preorder_getStatuses',
			'auth_init',
			'event_createHandlers',
			'app_init'
		])
	},
	mounted() {
		this.app_init()
	}
}
</script>

<style lang="less">
#q-app {
	height: 100%;
}
</style>
