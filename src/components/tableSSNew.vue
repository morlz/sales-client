<template>
	<div class="tableSS">
		<q-slide-transition>
			<div v-show="showHeader" class="tableSS__header">
				<div class="tableSS__actions" :class="{ 'tableSS__actions-selected' : selectedCount }">
					<div class="tableSS__selectedCount" v-if="selectedCount">Выбрано {{ selectedCount }} шт.</div>
					<div class="tableSS__rowsCount" v-else>{{ rows.length }} строк.</div>
					<slot name="selected" :selected="selected" :count="selectedCount"/>
				</div>

				<div class="tableSS__head" :style="rowStyle">
					<div v-if="lineNumbers && !minify" class="tableSS__lineNumber">№</div>

					<q-checkbox v-model="selectAll" v-if="selectable" class="tableSS__checkbox"/>

					<div
						class="tableSS__item-head"
						v-for="column, index in columns"
						@click="thClick(column, index)"
						ref="ths">
						<i :class="sortableIconClass(column, index)" />
						{{ column.label }}
					</div>

					<div class="tableSS__item-head tableSS__item-buttons" v-if="$scopedSlots.buttons">
						<slot name="buttons"/>
					</div>
				</div>

				<div class="tableSS__search" :style="rowStyle">
					<div v-if="lineNumbers && !minify" class="tableSS__lineNumber"/>

					<div v-if="selectable" class="tableSS__checkbox"/>

					<div class="tableSS__item-search" v-for="column, index in columnsSearchFields">
						<slot name="search">
							<q-input
								v-model="search[column.fields && column.fields.output ? column.fields.output : column.field]"
								:key="index"
								v-if="column.type == 'search'"
								:disabled="column.search === false"/>

							<q-select
								v-if="column.type == 'select'"
								v-model="search[column.fields && column.fields.output ? column.fields.output : column.field]"
								:key="index"
								:filter="column.filterable"
								:options="formatSelectOptions(column)"
								@change="selectChange($event, column)"
							/>
						</slot>
					</div>

					<div class="tableSS__item-head tableSS__item-buttons" v-if="$scopedSlots.buttons">
						<slot name="buttons"/>
					</div>
				</div>
			</div>
		</q-slide-transition>

		<tabless-clusterize :content="items" :item-height="itemHeight" class="tableSS__main" v-if="big" ref="main" :style="mainStyle" @mousewheel.native="scrollHandler">
			<div
				class="tableSS__row"
				slot-scope="row"
				:style="rowStyle"
				:key="row.itemKey"
				:class="{ 'tableSS__row-selected': selected[row.index] }"
				@click="clickHandler($event, row.item, row.index)"
			>
				<template v-if="row.item && row.item.rowType == 'row'">
					<div v-if="lineNumbers && !minify" class="tableSS__lineNumber"/>

					<q-checkbox :value="!!selected[row.index]" @input="changeSelectedRow($event, row.index)" v-if="selectable" class="tableSS__checkbox"/>

					<div class="tableSS__item" v-for="column, index in columns">
						{{ column.rowType }}
						<slot :name="column.field" :row="row.item" :column="column">
							<div v-if="column.type != 'array' && column.type != 'html'">{{ getFieldData(row.item, column.field, column.format) }}</div>
							<div v-if="column.type == 'html'" v-html="getFieldData(row.item, column.field, column.format)"/>
							<tabless-popover
								v-if="column.type == 'array'"
								:one="getFieldData(row.item, column.field, column.format).length < 2"
								:arr="getFieldData(row.item, column.field, column.format)"
								:column="column"
								:fields="column.fields"
								:label="column.label"
								/>
						</slot>
					</div>

					<div class="tableSS__buttons" v-if="local_buttonsCondition(row.item)">
						<slot name="buttons" :row="row.item">
							<el-button
								size="small"
								@click.stop="button.click($event, row.item)"
								v-for="button, index in buttonRedused"
								:key="index"
								:class="button.class"
								:type="button.type"
								v-loading="button.loading && button.loading.items && button.loading.items.includes( getFieldData(row.item, button.loading.field) )"
							>
								{{ button.name }}
							</el-button>
						</slot>
					</div>
				</template>
			</div>

			<infinite-loading slot="end" :distance="2000" @infinite="infiniteHandler" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<q-spinner-ball :size="50" slot="spinner" class="spinner"/>
			</infinite-loading>
		</tabless-clusterize>


		<div class="tableSS__main" v-if="!big" @mousewheel="scrollHandler" :style="mainStyle">
			<div
				class="tableSS__row"
				v-for="item, index in items"
				:style="rowStyle"
				:key="index"
				:class="{ 'tableSS__row-selected': selected[index] }"
				@click="clickHandler($event, item, index)"
			>
				<template v-if="item && item.rowType == 'row'">
					<div v-if="lineNumbers && !minify" class="tableSS__lineNumber"/>

					<q-checkbox :value="!!selected[index]" @input="changeSelectedRow($event, index)" v-if="selectable" class="tableSS__checkbox"/>

					<div class="tableSS__item" v-for="column, index in columns">
						{{ column.rowType }}
						<slot :name="column.field" :row="item" :column="column">
							<div v-if="column.type != 'array' && column.type != 'html'">{{ getFieldData(item, column.field, column.format) }}</div>
							<div v-if="column.type == 'html'" v-html="getFieldData(item, column.field, column.format)"/>
							<tabless-popover
								v-if="column.type == 'array'"
								:one="getFieldData(item, column.field, column.format).length < 2"
								:arr="getFieldData(item, column.field, column.format)"
								:column="column"
								:fields="column.fields"
								:label="column.label"
								/>
						</slot>
					</div>

					<div class="tableSS__buttons" v-if="local_buttonsCondition(item)">
						<slot name="buttons" :row="item">
							<el-button
								size="small"
								@click.stop="button.click($event, item)"
								v-for="button, index in buttonRedused"
								:key="index"
								:class="button.class"
								:type="button.type"
								v-loading="button.loading && button.loading.items && button.loading.items.includes( getFieldData(item, button.loading.field) )"
							>
								{{ button.name }}
							</el-button>
						</slot>
					</div>
				</template>
			</div>

			<infinite-loading slot="end" :distance="2000" @infinite="infiniteHandler" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<q-spinner-ball :size="50" slot="spinner" class="spinner"/>
			</infinite-loading>
		</div>
	</div>
</template>



<script>
import tablessPopover from '@/components/tableSSPopover'
import tablessClusterize from '@/components/tableSSClusterize'
import InfiniteLoading from 'vue-infinite-loading'
import {
	QInput,
	QSelect,
	QSlideTransition,
	QCheckbox,
	QSpinnerBall
} from 'quasar'

export default {
	props: {
		data: {
			type: Array,
			default: a => []
		},
		fieldDescription: {
			type: Array,
			default: a => []
		},
		buttons: Array,
		buttonsCondition: Function,
		minify: {
			type: Boolean,
			default: a => false
		},
		filters: {
			default: a => ({})
		},
		lineNumbers: {
			type: Boolean,
			default: a => false
		},
		sortable: {
			type: Boolean,
			default: a => true
		},
		localSort: {
			type: Boolean,
			default: a => false
		},
		selectFields: {
			type: Array,
			default: a => []
		},
		itemHeight: {
			type: [Number, String],
			default: a => 50
		},
		infiniteLoading: {
			type: Boolean,
			default: a => false
		},
		complete: {
			type: Boolean,
			default: a => false
		},
		selectable: {
			type: Boolean,
			default: a => false
		},
		itemsBigLimit: {
			type: Number,
			default: a => 1000
		}
	},
	components: {
		tablessClusterize,
		tablessPopover,
		QInput,
		QSelect,
		QCheckbox,
		QSlideTransition,
		InfiniteLoading,
		QSpinnerBall
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
			columnWidths: [],
			selected: [],
			showHeader: true
		}
	},
	watch: {
		filters () {
			this.applyFilters()
		},
		formatedSort(n) {
			this.$emit("sort", n)
		},
		searchFields(n) {
			if (this.searchInputTimeout) clearTimeout(this.searchInputTimeout)

			this.searchInputTimeout = setTimeout(() => {
				if (this.filterChangeFirst)
					return this.filterChangeFirst = false

				for (var prop in n)
					if ( n.hasOwnProperty(prop) && n[prop] !== this.filters[prop] )
						return this.$emit("filter", n)

				for (var prop in this.filters)
					if ( this.filters.hasOwnProperty(prop) && n[prop] !== this.filters[prop] )
						return this.$emit("filter", n)
			}, 8e2)
		},
		rows (n) {
			if (this.selectable) {
				let tmp = []
				for (var i = 0; i < n.length; i++)
					tmp[i] = false

				this.selected = tmp
			}

			if (this.complete) return
			if (this.$refs.infiniteLoading)
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
		},
		currentSelected (n) {
			this.$emit('selected', n)
		}
	},
	computed: {
		mainStyle () {
			return {
				height: `calc(100%${this.showHeader ? ' - 160px' : ''})`
			}
		},
		big () {
			if (this.rows.length > this.itemsBigLimit) {
				this.$nextTick(a => {
					if (this.$refs.main && this.$refs.main.$el && this.$refs.main.$el.scrollTop == 0)
						this.$refs.main.$el.scrollTop = this.itemsBigLimit * +this.itemHeight
				})

				return true
			}


			return false
		},
		buttonRedused() {
			return this.buttons || []
		},
		searchFields() {
			let obj = {}
			for (var prop in this.search)
				if (this.search.hasOwnProperty(prop) && this.search[prop] && this.search[prop].length)
					obj[prop] = this.search[prop]

			return obj
		},
		formatedSort() {
			return {
				sortType: this.sort.type,
				sortColumn: this.sort.columnIndex != -1 ?
					this.columns[this.sort.columnIndex].type == 'array' ?
							this.columns[this.sort.columnIndex].field + '.' + this.columns[this.sort.columnIndex].fields[0]
						:	this.columns[this.sort.columnIndex].fields && this.columns[this.sort.columnIndex].fields.output ?
								this.columns[this.sort.columnIndex].fields.output
							:	this.columns[this.sort.columnIndex].field
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
			let data = this.rows.map(el => ({ ...el, columns: this.columnsSearchFields, rowType: 'row' }))

			if (this.sort.columnIndex == -1)
				return data

			if (this.localSort)
				data.sort((a, b) => {
					let sortField = this.columns[this.sort.columnIndex].field,
						returnRez = rez => this.sort.type == 'asc' ? rez : -rez,
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

			return data
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
		},
		items () {
			return this.sortedRows
		},
		rowStyle () {
			/*
			const getElWidth = el => {
				if (typeof el.width == 'array') return `minmax(${el.width[0]}px, ${el.width[1]}px) `
				if (typeof el.width == 'number') return `minmax(${el.width}px, 300px) `
				if (typeof el.width == 'string') return `${el.width} `
				return el.width + ' '
			}
			*/


			const getElWidth = el => {
				if (typeof el.width == 'array') return `${el.width[0]}px `
				if (typeof el.width == 'number') return `${el.width}px `
				if (typeof el.width == 'string') return `${el.width} `
				return el.width + ' '
			}


			let gridTemplateColumns = this.columns.reduce((prev, el) => prev + getElWidth(el), '')
			if (this.$scopedSlots.buttons)
				gridTemplateColumns += 'minmax(min-content, max-content) '
				//gridTemplateColumns += 'minmax(50px, max-content) '

			if (this.selectable)
				gridTemplateColumns = `40px ` + gridTemplateColumns
			return {
				height: `${this.itemHeight}px`,
				gridTemplateColumns,
				gridTemplateRows: `${this.itemHeight}px`
			}
		},
		selectAll: {
			get () {
				return this.selectedCount == this.rows.length && !!this.selectedCount
			},
			set (n) {
				for (var i = 0; i < this.rows.length; i++)
					this.$set(this.selected, i, n)
			}
		},
		selectedCount () {
			return this.selected.filter(el => el).length
		},
		currentSelected () {
			return this.selected.map((el, index) => el ? this.rows[index] : null).filter(el => el)
		}
	},
	methods: {
		local_buttonsCondition (row) {
			if (typeof this.buttonsCondition != 'function') return true
			return this.buttonsCondition(row)
		},
		clickHandler(e, row, index) {
			if (index < 0) return

			this.$emit("click", e, row, index)
		},
		sortableIconClass(column, index) {
			return {
				'tableSS__sortIcon': true,
				'el-icon-sort-down': this.sort.type == 'asc',
				'el-icon-sort-up': this.sort.type == 'desc',
				'tableSS__sortIcon-active': index == this.sort.columnIndex
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

			let obj = {}
			for (var prop in this.filters)
				if (this.filters.hasOwnProperty(prop) && this.search[prop] != this.filters[prop])
					obj[prop] = this.filters[prop]

			if (Object.keys(obj).length === 0) return

			this.search = { ...this.search, ...obj }
		},
		getFieldData (row, field, format = {}) {
			return this.fieldDataFormat(
				format.get,
				field.split(".").reduce((prev, el) => (prev[el] || ""), row),
				row
			)
		},
		fieldDataFormat (format, fieldData, row) {
			if (!format || typeof format != 'function')
				return fieldData

			return Array.isArray(fieldData) ?
							fieldData.map(el => this.fieldDataFormat(format, el, row))
						:	format(fieldData, row)
		},
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
		},
		formatSelectOptions: column => column.data.map(
			option => ({
				label: column.fields && column.fields.label ? option[column.fields.label] : option.label,
				value: column.fields && column.fields.value ? option[column.fields.value] : option.value
			})
		),
		infiniteHandler (e) {
			if (this.complete)
			 	return (e.loaded(), e.complete())

			if (this.infiniteLoading || !this.rows.length)
				return setTimeout(a => e.loaded(), 200)

			this.$emit('infinite', e)
		},
		changeSelectedRow (e, index) {
			this.$set(this.selected, index, e)
		},
		scrollHandler (e) {
			this.showHeader = e.wheelDeltaY > 0
		}
	},
	mounted () {
		this.applyFilters()
		//window.addEventListener('mousemove', this.delimiterMouseMoveHandler)
	},
	beforeDestroy() {
		//window.removeEventListener('mousemove', this.delimiterMouseMoveHandler)
	}
}
</script>



<style lang="less">


.tableSS {
	width: 100%;
	height: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	background: #fff;
	&__lineNumber {

	}

	&__header {
		overflow: hidden;
		width: min-content;
		min-width: 100%;
	}

	&__main {
		overflow-x: hidden;
		overflow-y: auto;
		transition: height 0.3s ease-in-out;
		transform: translateZ(0);
		width: min-content;
		min-width: 100%;
	}

	&__row {
		display: grid;
		grid-gap: 5px;
		border-bottom: 1px solid rgba(224, 224, 224, 1);
		align-content: center;
		align-items: center;
		padding: 0 15px;
		cursor: pointer;
		transition: background-color 0.3s ease-in-out,
					color 0.3s ease-in-out;

		&-selected {
			background: #F5F5F5;
		}

		&:hover {
			background: rgba(51,122,183,.1);
		}
	}

	&__item {
		text-overflow: clip;
		max-height: 100%;
		overflow: hidden;
	}

	&__item-buttons {
		height: 0;
		opacity: 0;
		pointer-events: none;
	}

	&__actions {
		height: 50px;
		display: grid;
		grid-auto-flow: column;
		justify-content: space-between;
		padding: 0 10px;
		grid-gap: 10px;
		width: max-content;
		min-width: 100%;
		align-items: center;
		transition: background-color 0.3s ease-in-out,
					color 0.3s ease-in-out;

		&-selected {
			background: #E8F0FE;
			color: #5A94F5;
		}
	}

	&__head, &__search {
		display: grid;
		white-space: nowrap;
		align-content: center;
		align-items: center;
		height: 50px;
		width: min-content;
		padding: 0 15px;
		min-width: 100%;
	}

	&__head {
		font-size: 12px;
		cursor: pointer;
		user-select: none;
		color: rgba(0, 0, 0, 0.54);

		&:hover {
			> .tableSS__sortIcon {
				opacity: 1;
			}
		}
	}

	&__item-search {
		> div {
			margin: 0;
		}
	}

	&__sortIcon {
		opacity: 0;
		transition: all 0.3s ease-in-out;

		&-active {
			opacity: 1;
		}
	}

	&__buttons {
		display: grid;
		grid-auto-flow: column;
	}

	&__checkbox {
		margin-left: 16px;
	}

	&__selectedCount, &__rowsCount {
		justify-self: start;
		margin-left: 10px;
	}

}
</style>
