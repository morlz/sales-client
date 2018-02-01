<template>
	<div id="q-app">
		<app-layout>
			<icons slot="icons"/>
			<global-styles slot="styles"/>
			<main-menu slot="menu"/>
			<main-header slot="header"/>

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

import mainMenu from '@/components/mainMenu.vue'
import mainHeader from '@/components/header.vue'
import mainAuth from '@/components/pages/main/auth.vue'
import icons from '@/components/icons.vue'
import globalStyles from '@/components/globalStyles.vue'
import mixins from '@/components/mixins'
import appLayout from '@/components/appLayout'

export default {
	mixins: [mixins],
	name: 'app',
	components: {
		appLayout,
		mainMenu,
		mainHeader,
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
	computed: mapGetters([
		'logined'
	]),
	methods: {
		...mapActions([
			'task_getTypes',
			'preorder_getStatuses',
			'auth_init',
			'event_createHandlers'
		])
	},
	mounted() {
		this.event_createHandlers()
		this.auth_init()
	}
}
</script>

<style lang="less">
</style>
