<template>
<div class="tableCollapsible__head">
	<table-collapsible-row :head="true">
		<div class="tableCollapsible__headColumn" v-for="column, index in columns" :key="index">
			{{ column.label }}
		</div>
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
		}
	},
	data() {
		return {}
	},
	components: {
		TableCollapsibleRow
	},
}
</script>


<style lang="less"></style>
