<template>
<div class="tableCollapsible">
	<table-collapsible-head :columns="columns" />
	<table-collapsible-body :columns="columns" :rows="rows">
		<template slot-scope="props">
			<slot :row="props.row"/>
		</template>
	</table-collapsible-body>
</div>
</template>

<script>

//
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QCollapsible
} from 'quasar'

import TableCollapsibleHead from '@/components/TableCollapsibleHead.vue'
import TableCollapsibleBody from '@/components/TableCollapsibleBody.vue'

export default {
	props: {
		columns: {
			type: Array,
			required: true
		},
		rows: {
			type: Array,
			default: a => []
		}
	},
	data() {
		return {}
	},
	components: {
		TableCollapsibleHead,
		TableCollapsibleBody
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
