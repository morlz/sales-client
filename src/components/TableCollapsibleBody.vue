<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row" @open="openHandler(index)" ref="rows" :border-open="borderOpen">
		<slot name="start" :row="row" class="tableCollapsible__rowColumnStart"/>

		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex">
			{{ getFieldData(row, column) }}
		</div>

		<slot name="end" class="tableCollapsible__rowColumnEnd" :row="row"/>

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
		getFieldData: (row, { field, fields }) => {
			if (field)
				return field.split(".").reduce((prev, el) => (prev[el] || ""), row)
			if (fields)
				return fields.map(field => field.split(".").reduce((prev, el) => (prev[el] || ""), row)).join(' ')
		},
		openHandler (index) {
			if (this.$refs.rows && this.accordion)
				this.$refs.rows.map((vm, vmIndex) => index != vmIndex ? vm.$emit('wannaClose'): null)
		}
	},
	mounted () {

	}
}
</script>

<style lang="less">

</style>
