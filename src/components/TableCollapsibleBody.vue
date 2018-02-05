<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row">
		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex">
			{{ getFieldData(row, column) }}
		</div>

		<div class="buttons">
			<slot name="buttons" :row="row"/>
		</div>

		<template slot="content" slot-scope="props">
			<slot :row="props.row"/>
		</template>
	</table-collapsible-row>
</div>
</template>

<script>
import TableCollapsibleRow from '@/components/TableCollapsibleRow.vue'

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
	components: {
		TableCollapsibleRow
	},
	methods: {
		getFieldData: (row, { field }) => field.split(".").reduce((prev, el) => (prev[el] || ""), row)
	},
}
</script>

<style lang="less">

</style>
