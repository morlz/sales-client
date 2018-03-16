<template>
	<div id="q-app">
		<q-ajax-bar :delay="200"/>
		<app-layout>
			<app-icons slot="icons"/>
			<app-styles slot="styles"/>
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
import AppIcons from '@/components/AppIcons.vue'
import AppStyles from '@/components/AppStyles.vue'
import mixins from '@/components/mixins'
import AppLayout from '@/components/AppLayout'

import { QAjaxBar } from 'quasar'

export default {
	mixins: [mixins],
	name: 'app',
	components: {
		AppLayout,
		AppMenu,
		AppHeader,
		mainAuth,
		AppIcons,
		AppStyles,
		QAjaxBar
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

.AppContent {
	background-color: #EEEEEE;
	height: 100%;
	width: 100%;

	&__headerTabs {
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);
	}
}
</style>
