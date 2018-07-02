<template>
	<div class="InfiniteTableColumn" :style="style">
		<template v-if="column.filter == 'date'">
			<filter-date v-model="filterDateModel" :float-label="column.label"/>
		</template>

		<template v-else>
			<template v-if="select">
				<q-select v-model="selectModel" filter autofocus-filter :options="selectOptions" :style="fieldStyle"/>
			</template>

			<template v-if="!select">
				<q-input v-model="inputModel" :float-label="column.label" :style="fieldStyle"/>
			</template>
		</template>

		<q-icon :name="sortIcon" @click.native="$emit('sort', $event)"/>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import FilterDate from '@/components/filters/Date'

import {} from 'quasar'

export default {
	components: {
		FilterDate
	},
	props: {
		column: {
			type: Object,
			required: true
		},
		width: Number,
		sort: Object,
		select: Object,
		filters: Object
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		filterDateModel: {
			get () {
				if (this.column.fields && this.column.fields.output)
					return (this.filters[ this.column.fields.output ] || {}).value || ''

				return (this.filters[ this.column.field ] || {}).value || ''
			},
			set (value) {
				if (this.column.fields && this.column.fields.output)
					return this.$emit('input', { [this.column.fields.output]: value ? { type: 'date', value } : null })

				this.$emit('input', { [this.column.field]: value ? { type: 'date', value } : null })
			}
		},
		inputModel: {
			get () {
				if (this.column.filterFormat && typeof this.column.filterFormat.get == 'function')
					return this.column.filterFormat.get(this.filters)

				if (this.column.fields && this.column.fields.output)
					return (this.filters[ this.column.fields.output ] || {}).value || ''

				return this.filters[ this.column.field ] || ''
			},
			set (value) {
				if (this.column.filterFormat && typeof this.column.filterFormat.set == 'function')
					return this.$emit('input', this.column.filterFormat.set(value))

				if (this.column.fields && this.column.fields.output)
					return this.$emit('input', { [this.column.fields.output]: value ? value : null })

				this.$emit('input', { [this.column.field]: value ? value : null })
			}
		},
		selectModel: {
			get () {
				return this.filters[this.selectFields.output]
			},
			set (val) {
				this.$emit('input', { [this.selectFields.output]: val})
			}
		},
		sortIcon () {
			return this.sort.direction ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down'
		},
		style () {
			return { width: `${this.width}px` }
		},
		fieldStyle () {
			return { width: `${this.width - 25}px` }
		},
		selectFields () {
			if (!this.select) return

			return {
				label: this.select.fields.label,
				value: (this.select.fields.value === undefined ? this.select.fields.label : this.select.fields.value) || "",
				output: this.select.fields.output === undefined ? this.select.field : this.select.fields.output
			}
		},
		selectOptions () {
			if (!this.select) return

			return this.select.data.map(el => ({
				label: el[ this.selectFields.label ],
				value: el[ this.selectFields.value ],
			}))
		}
	},
	methods: {

	},
	mounted () {

	}
}
</script>


<style lang="stylus">
.InfiniteTableColumn
	display grid
	grid-template-columns 1fr 25px
	> i
		transition opacity .2s ease-in-out
		opacity 0
		cursor pointer
	&:hover > i
		opacity 1
</style>
