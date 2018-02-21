<template>
<div class="tableWrapper">
	<div class="tableCoreWrapper">
		<table>
			<thead>
				<tr>
					<th v-if="lineNumbers && !minify" class="tableIndex">№</th>
					<th v-for="column, index in columns" @click="thClick(column, index)" :key="index" ref="ths"
						:width="columnWidths.find(el => el.index == index) ? columnWidths.find(el => el.index == index).width + 'px' : 'auto'">

						{{ column.label }}
						<i :class="sortableIconClass(column, index)" />
					</th>
				</tr>
				<tr v-if="!minify">
					<th v-if="lineNumbers && !minify" class="tableIndex"/>
					<th v-for="column, index in columnsSearchFields">
						<el-input
							v-model="search[column.field]"
							class="searchByField"
							suffix-icon="el-icon-search"
							:key="index"
							v-if="column.type == 'search'"
							:disabled="column.search === false"/>
						<el-select
							v-model="search[column.fields && column.fields.output ? column.fields.output : column.field]"
							class="searchByField"
							:key="index"
							value=""
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
				<tr v-for="row, index in sortedRows" :key="index" :data-index="index" class="hoverShow">
					<td v-if="lineNumbers && !minify" class="tableIndex" @click="clickHandler($event, row, 0)">{{ index + 1 }}</td>
					<td v-for="column, columnIndex in columns" :class="column.type" @click="clickHandler($event, row, columnIndex)">
						<slot :name="column.field" :row="row" :column="column">
							<div v-if="column.type != 'array'">{{ getFieldData(row, column.field) }}</div>
							<tabless-popover
								v-if="column.type == 'array'"
								:one="getFieldData(row, column.field).length < 2"
								:arr="getFieldData(row, column.field)"
								:fields="column.fields"
								:label="column.label"
								/>
						</slot>
					</td>
					<td class="buttons" v-if="local_buttonsCondition(row)">
						<el-button
							size="small"
							@click.stop="button.click($event, row)"
							v-for="button, index in buttonRedused"
							:key="index"
							:class="button.class"
							:type="button.type"
							v-loading="button.loading && button.loading.items && button.loading.items.includes( getFieldData(row, button.loading.field) )"
						>
							{{ button.name }}
						</el-button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>



<script>
//<div class="thDelimiter" @mousedown.stop="delimiterMouseDown($event, index)" v-if="false"/>
import tablessPopover from '@/components/tableSSPopover'
import {
	QInput
} from 'quasar'

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
	components: {
		tablessPopover,
		QInput
	},
	data () {
		return {
			sort: {
				columnIndex: -1,
				type: "asc"
			},
			search: {},
			searchInputTimeout: false,
			filterChangeFirst: true,
			delimiter: {
				mooving: -1
			},
			columnWidths: []
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
				sortColumn: this.sort.columnIndex != -1 ?
					this.columns[this.sort.columnIndex].type == 'array' ?
						this.columns[this.sort.columnIndex].field + '.' + this.columns[this.sort.columnIndex].fields[0] :
						this.columns[this.sort.columnIndex].field
					 : -1
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
							sortDataA = this.getFieldData(a, sortField),
							sortDataB = this.getFieldData(b, sortField),
							fieldA = typeof sortDataA == 'string' ? sortDataA.toLowerCase() : sortDataA,
							fieldB = typeof sortDataB == 'string' ? sortDataB.toLowerCase() : sortDataB

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

				if (column.type == 'array')
					return { ...column, type: 'search', field: `${column.field}.${column.fields[0]}`}

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
		getFieldData: (row, field) => field.split(".").reduce((prev, el) => (prev[el] || ""), row),
		getFieldArrayCount: arr => arr.length,
		delimiterMouseMoveHandler (e) {
			if (this.delimiter.mooving == -1) return
			let moving = this.columnWidths.find(el => el.index == this.delimiter.mooving)
			moving.width = moving.width + e.movementX
		},
		delimiterMouseDown (e, index) {
			if (!this.columnWidths.find(el => el.index == index))
				this.columnWidths.push({ index, width: this.$refs.ths[index].offsetWidth })

			this.delimiter.mooving = index
			window.addEventListener('mouseup', this.delimiterMouseUp, { once: true })
		},
		delimiterMouseUp (e) {
			this.delimiter.mooving = -1
		}
	},
	mounted () {
		this.applyFilters()
		setTimeout(() => {
			console.log(this);
		}, 1000)
		//window.addEventListener('mousemove', this.delimiterMouseMoveHandler)
	},
	beforeDestroy() {
		//window.removeEventListener('mousemove', this.delimiterMouseMoveHandler)
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
	                    transition: color 0.3s ease-in-out;
	                    border-bottom: 2px solid #f4f4f4;
						position: relative;
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
						.thDelimiter {
							position: absolute;
							height: 100%;
							background: red;
							width: 3px;
							top: 0;
							right: 0;
							z-index: 500;
							cursor: move;
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

.hoverHide {
	opacity: 0;
	pointer-events: none;
	transition: all 0.3s ease-in-out;
}
.hoverShow:hover {
	.hoverHide {
		opacity: 1;
		pointer-events: all;
	}
}
</style>
