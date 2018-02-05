<template>
<div class="tableCollapsible">
	<table-collapsible-head :columns="columns">
		<template slot="start" slot-scope="props">
			<slot name="startH"/>
		</template>

		<template slot="end">
			<slot name="buttons" :row="{}"/>
		</template>
	</table-collapsible-head>

	<table-collapsible-body :columns="columns" :rows="rows" :accordion="accordion">
		<template slot="start" slot-scope="props">
			<slot name="start" :row="props.row"/>
		</template>

		<template slot-scope="props">
			<slot :row="props.row"/>
		</template>

		<template slot="end" slot-scope="props">
			<slot name="buttons" :row="props.row"/>
		</template>
	</table-collapsible-body>

	<template v-if="footer">
		<div class="separator-g" />
		<table-collapsible-row>
			<slot name="footer"/>
		</table-collapsible-row>
	</template>
</div>
</template>

<script>
import TableCollapsibleHead from '@/components/TableCollapsibleHead.vue'
import TableCollapsibleBody from '@/components/TableCollapsibleBody.vue'
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
		footer: {
			type: Boolean,
			default: a => false
		},
		accordion: {
			type: Boolean,
			default: a => false
		}
	},
	components: {
		TableCollapsibleHead,
		TableCollapsibleBody,
		TableCollapsibleRow
	},
}
</script>


<style lang="less"></style>
