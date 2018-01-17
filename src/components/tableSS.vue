<template>
<div class="tableWrapper">
	<div class="tableCoreWrapper">
		<table>
			<thead>
				<tr>
					<th v-if="lineNumbers && !minify" class="tableIndex">№</th>
					<th v-for="column, index in columns" @click="thClick(column, index)" :key="index">
						{{ column.label }}
						<i :class="sortableIconClass(column, index)" />
					</th>
				</tr>
				<tr v-if="!minify">
					<th v-if="lineNumbers && !minify" class="tableIndex"></th>
					<th v-for="column, index in columnsSearchFields">
						<el-input v-model="search[column.field]" class="searchByField" suffix-icon="el-icon-search" :key="index" v-if="column.type == 'search'"/>
						<el-select
							v-model="search[column.field]"
							class="searchByField"
							:key="index"
							v-if="column.type == 'select'"
							:filterable="column.filterable"
							@change="selectChange($event, column)"
						>
							<el-option v-for="option, optionIndex in column.data"
								:key="optionIndex"
								:label="column.fields && column.fields.label ? option[column.fields.label] : option.label"
								:value="column.fields && column.fields.value ? option[column.fields.value] : option.value"/>
						</el-select>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row, index in sortedRows" :key="index" :data-index="index">
					<td v-if="lineNumbers && !minify" class="tableIndex" @click="clickHandler($event, row, 0)">{{ index + 1 }}</td>
					<td v-for="column, columnItem in columns" :class="column.type" @click="clickHandler($event, row, columnItem)"> {{ getFieldData(row, column.field) }} </td>
					<td>
						<td class="buttons" v-if="local_buttonsCondition(row)">
							<el-button
								size="small"
								@click="button.click($event, props)"
								v-for="button, index in buttonRedused"
								:key="index"
								:class="button.class"
							>
								{{ button.name }}
							</el-button>
						</td>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>



<script>

export default {
	props: {
		data: {
			type: Array,
			default: () => ([])
		},
		fieldDescription: {
			type: Array,
			default: () => ([])
		},
		onClick: {
			type: Function
		},
		buttons: {
			type: Array
		},
		minify: {
			type: Boolean,
			default: false
		},
		filters: {
			default: () => ({})
		},
		buttonsCondition: {
			type: Function
		},
		lineNumbers: {
			type: Boolean,
			default: false
		},
		sortable: {
			type: Boolean,
			default: true
		},
		localSort: {
			type: Boolean,
			default: true
		},
		selectFields: {
			type: Array,
			default: () => ([])
		}
	},
	data () {
		return {
			sort: {
				columnIndex: -1,
				type: "asc"
			},
			search: {},
			searchInputTimeout: false,
			filterChangeFirst: true
		}
	},
	watch: {
		filters () {
			this.applyFilters()
		},
		formatedSort(n) {
			this.$emit("sortChange", n)
		},
		searchFields(n) {
			if (this.searchInputTimeout) clearTimeout(this.searchInputTimeout)

			this.searchInputTimeout = setTimeout(() => {
				if (this.filterChangeFirst) {
					this.filterChangeFirst = false
					return
				}
				this.$emit("filter", n)
			}, 8e2)
		}
	},
	computed: {
		buttonRedused() {
			return this.buttons || []
		},
		searchFields() {
			let obj = {}
			for (var prop in this.search) {
				if (this.search.hasOwnProperty(prop) && this.search[prop] && this.search[prop].length) {
					obj[prop] = this.search[prop]
				}
			}
			return obj
		},
		formatedSort() {
			return {
				sortType: this.sort.type,
				sortColumn: this.sort.columnIndex != -1 ? this.columns[this.sort.columnIndex].field : -1
			}
		},
		columns() {
			return this.fieldDescription.map(el => Object.assign({}, el))
		},
		rows() {
			return this.data || []
		},
		sortedRows() {
			if (this.sort.columnIndex == -1)
				return this.rows.map(el => {
					el.gender === 1 ? 'Мужской' : 'Женский'
					return el
				})

				let data = this.rows

				if (this.localSort)
					data.sort((a, b) => {
						let sortField = this.columns[this.sort.columnIndex].field,
							returnRez = rez => {
								return this.sort.type == 'asc' ? rez : -rez
							},
							fieldA = typeof a[sortField] == 'string' ? a[sortField].toLowerCase() : a[sortField],
							fieldB = typeof b[sortField] == 'string' ? b[sortField].toLowerCase() : b[sortField]

						if (fieldA < fieldB)
							return returnRez(-1)

						if (fieldA > fieldB)
							return returnRez(1)

						return 0
					})

			return data.map(el => {
				el.gender === 1 ? 'Мужской' : 'Женский'
				return el
			})
		},
		columnsSearchFields() {
			this.columns.map(({ field }) => {
				if (this.search[field] == undefined)
					this.search = Object.assign({ [field] : "" }, this.search)
			})

			return this.columns.map((column, index) => {
				let selectField = this.selectFields.find(el => el.field == column.field || el.index == index)

				return selectField ? { ...column, ...selectField, type: "select" } : { ...column, type: "search" }
			})
		}
	},
	methods: {
		local_buttonsCondition (row) {
			if (typeof this.buttonsCondition != 'function') return true
			return this.buttonsCondition(row)
		},
		clickHandler(e, row, index) {
			if (typeof this.onClick == 'function')
				this.onClick(e, row, index)

			this.$emit("onClick", e, row, index)
		},
		sortableIconClass(column, index) {
			let sortedByCurrent = index == this.sort.columnIndex
			return {
				'sortIcon': true,
				'el-icon-sort-down': this.sort.type == 'asc',
				'el-icon-sort-up': this.sort.type == 'desc',
				'sortByThisIcon': sortedByCurrent
			}
		},
		thClick(column, index) {
			if (this.sort.columnIndex == index) this.switchSortType()
			this.sort.columnIndex = index
		},
		switchSortType() {
			this.sort.type = this.sort.type == 'asc' ? 'desc' : 'asc'
		},
		selectChange (e, column) {
			this.$emit('select', Object.assign(column, { value: e }))
		},
		applyFilters () {
			if (!this.filters) return

			for (var prop in this.filters)
				if (this.filters.hasOwnProperty(prop) && this.search[prop] != this.filters[prop])
					this.search[prop] = this.filters[prop]
		},
		getFieldData (row, field) {
			return field.split(".").reduce((prev, el) => (prev[el] || ""), row)
		}
	},
	mounted () {
		this.applyFilters()
	}
}
</script>



<style lang="less">
.tableWrapper {
    width: 100%;
    box-sizing: border-box;
	.tableCoreWrapper {
		//width: 100%;
	    //overflow-x: auto;
	    table {
	        width: 100%;
	        table-layout: auto;
	        border-spacing: 0;
	        thead {
	            tr {
	                th {
						user-select: none;
						cursor: pointer;
	                    white-space: nowrap;
	                    padding: 5px;
	                    color: #337ab7;
	                    transition: all 0.3s ease-in-out;
	                    border-bottom: 2px solid #f4f4f4;
	                    &:hover {
	                        color: rgb(114, 175, 210);
	                        > .sortIcon {
	                            opacity: 1;
	                        }
	                    }
	                    .sortIcon {
	                        opacity: 0;
	                        transition: all 0.3s ease-in-out;
	                    }
	                    .sortByThisIcon {
	                        opacity: 1;
	                    }
	                    .searchByField {
							.el-input__suffix {
								pointer-events: none;
								&-inner {
									pointer-events: none;
								}
								i {
									line-height: 14px;
									cursor: default;
								}
							}
							input {
								width: 100%;
								height: 100%;
								padding: 4px;
							}
						}
	                }
	            }
	        }
	        tbody {
	            tr {
					height: 50px;
					cursor: pointer;
	                transition: all 0.3s;
	                td {
						&:first-child {
							padding-left: 10px;
						}
	                    padding: 3px;
	                    .buttons {
	                        display: grid;
	                        grid-auto-flow: column;
	                    }
	                }
	                transition: all 0.3s ease-in-out;
	                .tableIndex {
	                    vertical-align: middle;
	                    text-align: center;
	                    color: #5a5e66;
	                    font-weight: bold;
	                }
	                .number {
	                    text-align: right;
	                }
	                &:hover {
	                    background-color: rgba(51,122,183, 0.1);
	                }
	            }
	        }
	    }
	}
}
</style>
