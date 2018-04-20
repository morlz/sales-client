<template>
<div class="InfiniteTable">
	<div class="InfiniteTable__head InfiniteTableHead" :style="{ transform: `translate(-${scroll.left}px, ${head ? '0' : '-100%'})` }">
		<div class="InfiniteTableHead__names">
			<div v-for="column, index in table.columns" :key="index" :style="{ width: `${widths[index]}px` }" @click="handleSort($event, index)">
				{{ column.label }}
			</div>
		</div>

		<div class="InfiniteTableHead__searches">
			<div v-for="column, index in table.columns" :key="index">
				<q-input :value="filters[column.field]" @input="handleSearch($event, index)" :style="{ width: `${widths[index]}px` }"/>
			</div>
		</div>
	</div>

	<virtual-scroller class="InfiniteTable__scroll" :items="table.rows" item-height="50" content-tag="table" ref="scroll" emit-update @update="chunkRenderHandler" @scroll.native="scrollHandler">
		<tr slot-scope="props" :key="props.itemKey" ref="trs" @click="rowClickHandler($event, props.item, props.itemIndex)">
			<td v-for="column, cIndex in table.columns" :title="column.getValue(props.item)" :key="cIndex">
				<div :style="column.style">
					<div v-html="column.getValue(props.item)"/>
				</div>
			</td>

			<td>
				<div class="InfiniteTable__buttons">
					<slot name="buttons" :row="props.item"/>
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

import { VirtualScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'




export default {
	components: {
		QScrollArea,
		VirtualScroller
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
		}
	},
	data() {
		return {
			table: {},
			head: true,
			scroll: {
				left: 0
			},
			widths: [],
			sort: {
				direction: false,
				column: -1
			},
			_filters: {},
			infinite: {
				send: false
			}
		}
	},
	watch: {
		columns (n) {
			this.table.columns = n
		},
		rows (n) {
			let time = Date.now()
			this.table.rows = n
			this.$nextTick(this.updateViewport)
			this.$nextTick(this.checkForMore)
			console.log('rows update in', Date.now() - time);
		},
		sort (n) {
			this.$emit('sort', {
				sortColumn: this.table.columns[n.column],
				sortType: n.direction ? 'asc' : 'desk'
			})
		},
		filters (n) {
			this.$emit('filter', n)
		}
	},
	computed: {
		throttledScrollHandler () {
			return throttle(this.scrollHandler, 100, { trailing: true })
		},
		sortIcon () {
			return this.sort.direction ? 'sort-amount-up' : 'sort-amount-downs'
		},
		filters: {
			get () {
				return { ...this._filters }
			},
			set (val) {
				this._filters = { ...val }
			}
		}
	},
	methods: {
		scrollHandler () {
			if (!this.$refs.scroll) return
			this.scroll.left = this.$refs.scroll.$el.scrollLeft
		},
		chunkRenderHandler (start, end) {
			this.checkForMore(end)
			this.updateViewport()
		},
		updateViewport () {
			if (!this.$refs.trs) return
			let el = this.$refs.trs
			if (!el) return

			this.widths = Object.values(el.querySelectorAll('td')).map(el => el.offsetWidth)
		},
		handleSearch (e, index) {
			console.log(e, index)
		},
		handleSort (e, index) {
			if (this.sort.column === index)
				return this.sort.direction = !this.sort.direction

			this.sort.column = index
			this.sort.direction = false
		},
		rowClickHandler (e, row, index) {
			this.$emit('click', e, this.table.rows[index], index)
		},
		moreContent () {
			console.log('more');
			this.$emit('infinite', {
				loaded: a => this.infinite.send = false,
				complete: a => a
			})
		},
		checkForMore (index) {
			if (this.infinite.send || this.complete)
				return

			if (this.rows.length - index < this.scrollFire)
				this.moreContent()
		}
	},
	mounted () {
		this.$nextTick(this.updateViewport)
	},
	created () {
		this.filters = this.columns.reduce((prev, el) => (this.$set(prev, el.field, ''), prev), {})
		this.table = new InfiniteTable(this.columns, this.rows)
	}
}
</script>


<style lang="stylus">
$header-height = 100px

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
		height calc(100% - 100px)
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
				> div
					margin 0 3px
					box-sizing border-box
					height 50px
					line-height 50px
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
	&__names
	&__searches
		padding 0 3px
		height 50px
		display grid
		grid-auto-flow column
		align-items center

	&__names
		font-size 12px
		user-select none
		color rgba(0,0,0,.54)
		text-align center

</style>
