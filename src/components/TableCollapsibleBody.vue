<template>
<div class="tableCollapsible__body">
	<table-collapsible-row v-for="row, index in rows" :key="index" :row="row" @open="openHandler(index)" ref="rows">
		<div class="tableCollapsible__rowColumnStart">
			<slot name="start" :row="row"/>
		</div>

		<div class="tableCollapsible__bodyColumn" v-for="column, cIndex in columns" :key="cIndex">
			{{ getFieldData(row, column) }}
		</div>

		<div class="buttons tableCollapsible__rowColumnEnd">
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
			type: Array,
			default: a => []
		},
		accordion: {
			type: Boolean,
			default: a => false
		}
	},
	components: {
		TableCollapsibleRow
	},
	methods: {
		getFieldData: (row, { field }) => field.split(".").reduce((prev, el) => (prev[el] || ""), row),
		openHandler (index) {
			if (this.$refs.rows && this.accordion)
				this.$refs.rows.map((vm, vmIndex) => index != vmIndex ? vm.$emit('wannaClose'): null)
		}
	},
}
</script>

<style lang="less">

</style>
