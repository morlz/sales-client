<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row">
		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex">
			{{ getRowData(row, column) }}
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
		getRowData (row, column) {
			return row[column.field]
		}
	},
}
</script>

<style lang="less"></style>
