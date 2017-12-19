<template>
<div class="tableWrapper">
	<table-core
		:columns="columns"
		:rows="rows"
		:lineNumbers="true"
		:sortable="true"
		:onClick="clickHandler"
		:minify="minify"
		@sortChange="sortChange"
		@filterChange="filterChange">
		<template slot="table-row-after" slot-scope="props" v-if="buttonRedused.length">
			<td class="buttons">
				<el-button size="small" @click="button.click($event, props)" v-for="button, index in buttonRedused" :key="index" :class="button.class">{{ button.name }}</el-button>
			</td>
		</template>
	</table-core>
</div>
</template>



<script>

/*
<vue-good-table :columns="columns" :rows="rows" :sortable="true" :lineNumbers="true" :onClick="clickHandler" ref="goodTable">
	<div slot="emptystate">
		Список пуст.
	</div>
	<template slot="table-row-after" slot-scope="props" v-if="buttonRedused.length">
		<td class="buttons">
			<el-button size="small" @click="button.click($event, props)" v-for="button, index in buttonRedused" :key="index" :class="button.class">{{ button.name }}</el-button>
		</td>
	</template>
</vue-good-table>
*/


/*
 *	data:Array of object
 *		anyField => string
 *
 *	fieldDescription:Array of object
 *		name => string,
 *		label => string
 *
 */

import tableCore from '@/components/tableCore.vue'

export default {
	props: ['data', 'fieldDescription', 'onClick', 'buttons', 'minify'],
	components: {
		tableCore
	},
	computed: {
		buttonRedused() {
			return this.buttons || []
		},
		columns() {
			return this.fieldDescription.map(el => Object.assign({
				filterable: true
			}, el))
		},
		rows() {
			return this.data || []
		}
	},
	methods: {
		sortChange(row) {
			this.$emit("sortChange", row)
		},
		filterChange(row) {
			this.$emit("filter", row)
		},
		addGettersData (data) {
			let n = {}
			for (var prop in data) {
				if (data.hasOwnProperty(prop)) {
					n[prop] = data[prop]
				}
			}
			return n
		},
		clickHandler (e, row, index) {
			this.$emit("onClick", e, row, index)
			if (typeof this.onClick == 'function') this.onClick(e, row, index)
		}
	}
}
</script>



<style lang="less">
.tableWrapper {
    width: 100%;
    box-sizing: border-box;
	/*
	.good-table {
		.responsive {
			overflow-x: auto;
			table {
				td, th {
					font-size: 16px;
					border: 0;
					background-color: transparent;
				}
				tr {
					transition: all 0.3s ease-in-out;
					&:hover {
						background-color: #f5f5f5;
					}
				}
				td {
					padding: 5px;
					vertical-align: middle;
				}
				.buttons {
					display: grid;
					grid-auto-flow: column;
					justify-content: flex-end;
				}
				th:not(.line-numbers) {
					border-bottom: 2px solid #f4f4f4;
				}
				thead {
					th {
						color: #337ab7;
						transition: all 0.3s ease-in-out;
						&:hover {
							color: rgb(114, 175, 210);
						}
					}
				}
			}
		}
	}
	*/
}
</style>
