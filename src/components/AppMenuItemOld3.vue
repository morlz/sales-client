<template>
<q-collapsible :icon="content.icon" :label="content.name" v-model="show">
	<q-list>
		<app-menu-item v-for="child, index in content.childs":key="index" :content="child" />
	</q-list>
</q-collapsible>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

export default {
	name: 'AppMenuItem',
	props: {
		content: {
			type: Object,
			requred: true
		}
	},
	data() {
		return {
			show: true
		}
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'nav_open',
			'app_view_mobile',
		]),
	},
	methods: {

	},
	mounted () {

	}
}
</script>


<style lang="less">

</style>
