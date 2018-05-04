<template>
<div class="InfiniteTable">
	<div class="InfiniteTable__head InfiniteTableHead" :style="{ transform: `translate(-${scrollReal.left}px, ${head ? '0' : '-100%'})` }">
		<div class="InfiniteTableHead__searches">
			<div :style="{ width: `${widths[0]}px` }" v-if="$scopedSlots.buttons"/>
			<infinite-table-column
				v-for="column, index in table.columns"
				:key="index"
				:column="column"
				:width="widths[index + (+!!$scopedSlots.buttons)]"
				:sort="sort"
				:select="selectFields[ column.field ]"
				:filters="filters"
				@sort="handleSort($event, index)"
				@input="handleSearch"/>
		</div>
	</div>

	<virtual-scroller
		class="InfiniteTable__scroll"
		:items="table.rows"
		item-height="51"
		content-tag="table"
		ref="scroll"
		emit-update
		@update="chunkRenderHandler"
		@scroll.native="throttledScrollHandler">
		<tr slot-scope="props" ref="trs" @click="rowClickHandler($event, props.item, props.itemIndex)">
			<td>
				<div class="InfiniteTable__buttons">
					<slot name="buttons" :row="props.item"/>
				</div>
			</td>

			<td v-for="column, cIndex in table.columns" :title="column.getValue(props.item)" :key="cIndex">
				<div :style="column.style">
					<div v-html="column.getValue(props.item)"/>
				</div>
			</td>
		</tr>
	</virtual-scroller>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import { QScrollArea, Scroll } from 'quasar'
import { InfiniteTable, InfiniteRow, InfiniteColumn } from '@/lib/InfiniteTable'
import throttle from 'lodash.throttle'
import InfiniteTableColumn from '@/components/InfiniteTableColumn'
import { VirtualScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { tween } from 'popmotion'

export default {
	components: {
		QScrollArea,
		VirtualScroller,
		InfiniteTableColumn
	},
	directives: {
		Scroll
	},
	props: {
		columns: {
			type: Array,
			required: true
		},
		rows: {
			type: Array,
			default: a => []
		},
		complete: Boolean,
		selectable: Boolean,
		scrollFire: {
			type: Number,
			default: a => 100
		},
		selectFields: {
			type: Object,
			default: a => ({})
		},
		filterValues: Object
	},
	data() {
		return {
			table: {},
			head: true,
			scroll: {
				left: 0
			},
			scrollReal: {
				left: 0
			},
			widths: [],
			sort: {
				direction: false,
				column: -1
			},
			filters: {},
			infinite: {
				send: false
			},
			filterTimeout: false,
			first: true,
			indexes: {
				start: 0,
				end: 0
			}
		}
	},
	watch: {
		columns (n) {
			this.table.columns = n
		},
		rows (n) {
			this.table.rows = n
			this.$nextTick(this.updateViewport)
			this.$nextTick(this.checkForMore)
		},
		sort (n) {
			this.$emit('sort', {
				sortColumn: this.table.columns[n.column].field,
				sortType: n.direction ? 'asc' : 'desk'
			})
		},
		formatedFilters (n) {
			if (this.first)
				return this.first = false

			if (this.filterTimeout)
				clearTimeout(this.filterTimeout)

			this.filterTimeout = setTimeout(a => this.filterTimeout = this.$emit('filter', n), 500)
		},
		filterValues (n) {
			this.first = true
			this.setFilters({ ...JSON.parse(JSON.stringify(n)) })
		},
		'scroll.left' (to) {
			tween({ from: this.scrollReal.left, to, duration: 100 })
				.start(v => this.scrollReal.left = v)
		}
	},
	computed: {
		throttledScrollHandler () {
			return throttle(this.scrollHandler, 100, { trailing: true })
		},
		sortIcon () {
			return this.sort.direction ? 'sort-amount-up' : 'sort-amount-downs'
		},
		formatedFilters () {
			return Object.keys(this.filters).reduce((prev, key) => this.filters[key] ? { ...prev, [key]: this.filters[key] }  : prev, {})
		}
	},
	methods: {
		scrollHandler (e) {
			if (!this.$refs.scroll) return
			this.scroll.left = 	this.$refs.scroll.$el.scrollLeft
		},
		chunkRenderHandler (start, end) {
			this.updateViewport()

			let n = { start, end }
			if (n == this.indexes) return
			this.indexes = n
			this.checkForMore()
		},
		updateViewport () {
			if (!this.$refs.trs) return
			let el = this.$refs.trs
			if (!el) return

			this.widths = Object.values(el.querySelectorAll('td')).map(el => el.offsetWidth)
		},
		handleSearch (payload) {
			this.filters = { ...this.filters, ...payload }
		},
		handleSort (e, column) {
			this.sort = {
				column,
				direction: this.sort.column === column ? !this.sort.direction : false
			}
		},
		rowClickHandler (e, row, index) {
			this.$emit('click', e, this.table.rows[index], index)
		},
		moreContent () {
			this.$emit('infinite', {
				loaded: a => this.infinite.send = false,
				complete: a => a
			})
		},
		checkForMore () {
			if (this.infinite.send || this.complete)
				return

			if (this.rows.length - this.indexes.end < this.scrollFire)
				this.moreContent()
		},
		setFilters (n) {
			const getVal = field => n && n[field] ? n[field] : ''
			this.filters = this.columns.reduce((prev, el) => (this.$set(prev, el.field, getVal(el.field)), prev), { ...n })
		}
	},
	mounted () {
		this.$nextTick(this.updateViewport)
	},
	created () {
		this.setFilters(this.filterValues)
		this.table = new InfiniteTable(this.columns, this.rows)
	}
}
</script>


<style lang="stylus">
$header-height = 50px

.InfiniteTable
	min-width 100%
	position relative
	overflow hidden
	height 100%

	&__head
		position absolute
		top 0
		left 0
		height $header-height
		z-index 1000

	&__scroll
		height calc(100% - 50px)
		overflow auto
		transform translateZ(0)
		margin-top $header-height
		.item-container
			width max-content
			min-width 100%

	&__buttons
		display flex
		> i
			display inline-block
			color rgb(2, 123, 227)
			padding 10px
			font-size 24px
			transition background .2s ease-in-out
			background rgba(0, 0, 238, 0)
			&:hover
				background rgba(0, 0, 238, 0.15)

	table
		//table-layout fixed
		//width 100%
		border-collapse collapse
		tr
			cursor pointer
			transition background .2s ease-in-out
			td
				border-bottom 1px solid #e0e0e0

				&:first-child
					padding-left 5px

				&:last-child
					padding-right 5px

				> div
					margin 0 3px
					box-sizing border-box
					height 50px
					line-height 50px
					min-width 50px
					overflow hidden
					> div
						display inline-block
						vertical-align middle
						line-height 20px

			&:hover
				background rgba(51, 122, 183, .1)


.InfiniteTableHead
	background #fff
	border-bottom 1px solid #e0e0e0
	&__searches
		padding 0 3px
		height 50px
		display grid
		grid-auto-flow column
		align-items end
		padding 0 0 5px 0

</style>
