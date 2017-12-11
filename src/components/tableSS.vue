
Таблица с поиском и сортировкой

<template>
<div class="tableWrapper">
	<vue-good-table :columns="columns" :rows="rows" :sortable="true" :lineNumbers="true" :onClick="clickHandler" ref="goodTable">
		<div slot="emptystate">
			Список пуст.
		</div>
	</vue-good-table>
</div>
</template>



<script>
/*
 *	data:Array of object
 *		anyField => string
 *
 *	fieldDescription:Array of object
 *		name => string,
 *		label => string
 *
 */

export default {
	props: ['data', 'fieldDescription', 'onClick'],
	data () {
		return {
			mounted: false
		}
	},
	watch: {
		columnFilters (n) {
			this.$emit("filter", n)
		},
		filteredRows (n) {
			this.$emit("filteredRows", n)
		},
		sorts (n) {
			this.$emit("sortChange", n)
		}
	},
	computed: {
		columns() {
			return this.fieldDescription.map(el => Object.assign({
				filterable: true
			}, el))
		},
		rows() {
			return this.data
		},
		columnFilters () {
			if (!this.mounted) return false
			if (!this.$children.length) return {}
			return this.addGettersData(this.$refs.goodTable.$data.columnFilters)
		},
		filteredRows () {
			if (!this.mounted) return false
			if (!this.$children.length) return {}
			return this.addGettersData(this.$refs.goodTable.$data.filteredRows)
		},
		sorts () {
			if (!this.mounted) return false
			if (!this.$children.length) return {}
			let { sortType, sortColumn } = this.$refs.goodTable.$data
			return this.addGettersData({ sortType, sortColumn })
		}
	},
	methods: {
		addGettersData (data) {
			let n = {}
			for (var prop in data) {
				if (data.hasOwnProperty(prop)) {
					n[prop] = data[prop]
				}
			}
			return n
		},
		clickHandler (row, index) {
			this.$emit("onClick", row)
			//if (typeof this.onClick == 'function') this.onClick(row)
		}
	},
	mounted () {
		this.mounted = true
	}
}
</script>



<style lang="less">
.tableWrapper {
    width: 100%;
    box-sizing: border-box;
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
				}
				th {
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
}
</style>
