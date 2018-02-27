<template>
	<q-list class="items scroll" no-border>
		<q-item>
			<q-item-main>123123</q-item-main>
		</q-item>
	</q-list>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import tabless from '@/components/tableSS.vue'
import TableCollapsible from '@/components/TableCollapsible.vue'
import { QBtn, QIcon, QList, QItem, QItemMain, QItemSide } from 'quasar'


export default {

	components: {
		TableCollapsible,
		tabless,
		QBtn,
		QIcon,
		QList,
		QItem,
		QItemMain,
		QItemSide
	},
	methods: {
		...mapActions([

		]),
	},
	computed: {
		...mapGetters([

		]),
	}
}
</script>


<style lang="less">
</style>
