<template>
	<q-scroll-area>
		<q-list>
			<app-menu-item :content="{ name: 'menu', childs: nav_items }"/>
		</q-list>
	</q-scroll-area>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import AppMenuItem from '@/components/AppMenuItem'
import { QScrollArea } from 'quasar'


export default {
	props: {

	},
	components: {
		AppMenuItem,
		QScrollArea
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'nav_items',
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
