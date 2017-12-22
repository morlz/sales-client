<template>
<div class="tableCoreWrapper">
	<table>
		<thead>
			<tr>
				<th v-if="lineNumbers && !minify" class="tableIndex">№</th>
				<th v-for="column, index in columns" @click="thClick(column, index)" :key="index">
					{{ column.label }}
					<i v-if="sortable" :class="sortableIconClass(column, index)" />
				</th>
			</tr>
			<tr v-if="!minify">
				<th v-if="lineNumbers && !minify" class="tableIndex"></th>
				<th v-for="column, index in columnsSearchFields">
					<el-input v-model="search[column.field]" class="searchByField" suffix-icon="el-icon-search" :key="index" />
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row, index in sortedRows" :key="index" :data-index="index">
				<td v-if="lineNumbers && !minify" class="tableIndex" @click="clickHandler($event, row, 0)">{{ index + 1 }}</td>
				<td v-for="column, columnItem in columns" :class="column.type" @click="clickHandler($event, row, columnItem)"> {{ row[column.field] }} </td>
				<td>
					<slot name="table-row-after" :row="row" />
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>



<script>
/*

is="transition-group" name="staggered-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave"


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








 *	data:Array of object
 *		anyField => string
 *
 *	fieldDescription:Array of object
 *		name => string,
 *		label => string
 *
 */


import Velocity from 'velocity-animate'

export default {
	props: ['columns', 'rows', 'lineNumbers', 'sortable', 'onClick', 'minify'],
	data() {
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
				this.$emit("filterChange", n)
			}, 8e2)
		}
	},
	computed: {
		searchFields() {
			let obj = {}
			for (var prop in this.search) {
				if (this.search.hasOwnProperty(prop) && this.search[prop].length) {
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
		sortedRows() {
			if (this.sort.columnIndex == -1)
				return this.rows.map(el => {
					el.gender === 1 ? 'Мужской' : 'Женский'
					return el
				})

			return this.rows.sort((a, b) => {
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
			}).map(el => {
				el.gender === 1 ? 'Мужской' : 'Женский'
				return el
			})
		},
		columnsSearchFields() {
			this.columns.map(({ field }) => {
				if (this.search[field] == undefined) this.search = Object.assign({ [field] : "" }, this.search)
			})
			return this.columns
		},
		columnIndex () {
			return this.sort.columnIndex
		}
	},
	methods: {
		clickHandler(e, row, index) {
			if (typeof this.onClick == 'function') {
				this.onClick(e, row, index)
			}
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
		beforeEnter: function(el) {
			el.style.opacity = 0
			el.classList.add("noShown")
		},
		enter: function(el, done) {
			let index
			el.parentNode.querySelectorAll(".noShown").forEach((item, itemIndex) => {
				if (item == el) index = itemIndex
			})
			var delay = index * 25
			setTimeout(function() {
				Velocity(
					el, {
						opacity: 1
					}, {
						complete: () => {
							el.classList.remove("noShown")
							el.classList.add("shown")
							done()
						}
					}
				)
			}, delay)
		},
		leave: function(el, complete) {
			Velocity(
				el, {
					opacity: 0
				}, {
					complete
				}
			)
		}
	}
}
</script>



<style lang="less">
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
</style>
