<template>
<div id="q-app">
	<router-view />
</div>
</template>

<script>
import mixins from '@/mixins'
import {
	mapActions,
	mapGetters
} from 'vuex'

export default {
	name: 'App',
	mixins: [mixins],
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
			'app_init'
		])
	},
	created () {
		this.app_init()
	}
}
</script>

<style>
</style>
