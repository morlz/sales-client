<template>
<div class="tableCollapsible" :class="{ 'tableCollapsible-mobile': app_view_mobile }">
	<table-collapsible-head :columns="columns">
		<template slot="start" slot-scope="props">
			<slot name="startH"/>
		</template>

		<template slot="end">
			<slot name="end" :row="{}"/>
		</template>
	</table-collapsible-head>

	<table-collapsible-body :columns="columns" :rows="rows" :accordion="accordion" :borderOpen="borderOpen" @click="$emit('click', $event)">
		<template slot="start" slot-scope="props" v-if="$scopedSlots.start">
			<slot name="start" :row="props.row"/>
		</template>

		<template slot-scope="props">
			<slot :row="props.row"/>
		</template>

		<template slot="end" slot-scope="props" v-if="$scopedSlots.end">
			<slot name="end" :row="props.row"/>
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
import { mapGetters } from 'vuex'
import TableCollapsibleHead from '@/components/TableCollapsibleHead'
import TableCollapsibleBody from '@/components/TableCollapsibleBody'
import TableCollapsibleRow from '@/components/TableCollapsibleRow'

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
		footer: {
			type: Boolean,
			default: a => false
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
		TableCollapsibleHead,
		TableCollapsibleBody,
		TableCollapsibleRow
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		])
	}
}
</script>


<style lang="less">
.tableCollapsible {
	&-mobile {

	}
}
</style>
