<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row" @open="openHandler(index)" ref="rows" :border-open="borderOpen">
		<div class="tableCollapsible__rowColumnStart" v-if="$scopedSlots.start({ row: {} })">
			<slot name="start" :row="row"/>
		</div>

		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex"> 
			{{ getFieldData(row, column, index) }}
		</div>

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
		getFieldData: (row, { field, fields }, index) => {
			if (field == 'index')
				return index

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
		console.log('rows', this.rows);
	}
}
</script>

<style lang="less">

</style>
