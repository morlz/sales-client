<template>
	<table class="salesTwoTable" :style="{ display: noVisible ? 'none' : 'block' }">
		<thead>
			<tr>
				<td v-for="column, index in columns" :key="index">
					<div :title="column.title" @click="reports_salesTwo_groupByFieldSet(column.field)">{{ column.name }}</div>
				</td>
			</tr>
		</thead>

		<tbody>
			<tr v-for="item, index in row" :key="index">
				<td v-for="column, index in columns">
					<div :title="item[column.field]">{{ item[column.field] }}</div>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {} from 'quasar'

export default {
	props: {
		columns: {
			type: Array,
			required: true
		},
		row: {
			type: [Object, Array],
			required: true
		},
		noVisible: {
			type: Boolean,
			default: a => false
		}
	},
	methods: {
		...mapMutations('reports/salesTwo', [
			'reports_salesTwo_groupByFieldSet'
		]),
	},
}
</script>


<style lang="less">
.nth-child-width(@index, @width) {
	&:nth-child(@{index}) > div {
		width: @width;
	}
}

.salesTwoTable {
	table-layout: fixed;
	border: 0;
	border-collapse: collapse;
	thead {
		text-align: center;
		color: rgba(0,0,0,.54);
		user-select: none;
		cursor: pointer;
		font-size: 12px;
	}

	tbody {
		td {
			text-align: center;
		}
		tr {
			transition: all 0.15s ease-in-out;
			&:hover {
				background: #ecf5ff;
			}
		}
	}

	td {
		padding: 4px;
		border: 1px solid #ededed;
		.nth-child-width(1, 100px);
		.nth-child-width(2, 80px);
		.nth-child-width(3, 160px);
		.nth-child-width(4, 130px);
		.nth-child-width(5, 150px);
		.nth-child-width(6, 100px);
		.nth-child-width(7, 60px);
		.nth-child-width(8, 130px);
		.nth-child-width(9, 130px);
		.nth-child-width(10, 130px);
		.nth-child-width(11, 40px);
		.nth-child-width(12, 70px);
		.nth-child-width(13, 70px);
		.nth-child-width(14, 70px);
	}

	td > div {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
