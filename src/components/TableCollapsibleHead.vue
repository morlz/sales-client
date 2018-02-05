<template>
<div class="tableCollapsible__head">
	<table-collapsible-row>
		<div class="tableCollapsible__headColumn" v-for="column, index in columns" :key="index">
			{{ column.label }}
		</div>
	</table-collapsible-row>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QCollapsible
} from 'quasar'

import TableCollapsibleRow from '@/components/TableCollapsibleRow.vue'

export default {
	props: {
		columns: {
			type: Array,
			required: true
		}
	},
	data() {
		return {}
	},
	components: {
		TableCollapsibleRow
	},
	watch: {

	},
	computed: {

	},
	methods: {

	},
}
</script>


<style lang="less">

</style>
