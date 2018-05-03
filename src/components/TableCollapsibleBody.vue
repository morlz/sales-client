<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row" @open="openHandler(index)" ref="rows" :border-open="borderOpen">
		<div class="tableCollapsible__rowColumnStart" v-if="$scopedSlots.start({ row: {} })">
			<slot name="start" :row="row"/>
		</div>

		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex" v-html="getFieldData(row, column, index)"/>

		<div class="tableCollapsible__rowColumnEnd" v-if="$scopedSlots.end({ row: {} })">
			<slot name="end" :row="row"/>
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
			type: [Array, Object],
			default: a => []
		},
		accordion: {
			type: Boolean,
			default: a => false
		},
		borderOpen: {
			type: Boolean,
			default: a => false
		}
	},
	components: {
		TableCollapsibleRow
	},
	methods: {
		getFieldData: (row, column, index) => {
			if (column.field == 'index')
				return index

			let res

			if (column.field)
				res = column.field.split(".").reduce((prev, el) => (prev[el] || ""), row)

			if (column.fields)
				res = column.fields.map(field => field.split(".").reduce((prev, el) => (prev[el] || ""), row)).join(' ')

			if (column.format && typeof column.format.get === 'function')
				res = column.format.get(res, row)

			return res
		},
		openHandler (index) {
			if (this.$refs.rows && this.accordion)
				this.$refs.rows.map((vm, vmIndex) => index != vmIndex ? vm.$emit('wannaClose'): null)
		}
	}
}
</script>

<style lang="less">

</style>
