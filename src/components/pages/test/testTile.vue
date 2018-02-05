<template>
	<q-card class="test__moutionTile">
		<q-card-title>{{ invoice.client.lastname }} {{ invoice.client.name }} {{ invoice.client.patronymic }}</q-card-title>
		<q-card-main>
			<table-collapsible :rows="invoice.content" :columns="invoiceFieldDescription">
				<template slot="startH">
					<q-checkbox v-model="all" />
				</template>

				<template slot="start" slot-scope="props">
					<q-checkbox v-model="props.row.selected" />
				</template>
			</table-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import {
	QToolbar,
	QToolbarTitle,
	QList,
	QItem,
	QItemMain,
	QCard,
	QCardTitle,
	QCardMain,
	QCheckbox
} from 'quasar'
import { styler, spring, listen, pointer, value } from 'popmotion'

import TableCollapsible from '@/components/TableCollapsible.vue'

export default {
	props: ['invoice'],
	data() {
		return {
			invoiceFieldDescription: [
				{ field: "un", label: "un" },
				{ field: "name", label: "name" },
				{ field: "weight", label: "weight" },
				{ field: "space", label: "space" },
			],
			styler: false,
			coords: { x: 0, y: 0 },
			xy: false
		}
	},
	components: {
		QToolbar,
		QToolbarTitle,
		QList,
		QItem,
		QItemMain,
		QCard,
		QCardTitle,
		QCardMain,
		TableCollapsible,
		QCheckbox
	},
	watch: {

	},
	computed: {
		all: {
			get () {
				return !this.invoice.content.map(el => el.selected).filter(el => !el).length
			},
			set (n) {
				this.invoice.content = this.invoice.content.map(el => ({ ...el, selected: n }))
			}
		}
	},
	methods: {
		
	},
	mounted () {
		this.styler = styler(this.$el)
		this.xy = value(this.coords, this.styler.set)

		listen(this.$el, 'mousedown touchstart')
			.start(e => {
				e.preventDefault()
				this.$emit('drag')
				pointer(this.xy.get()).start(this.xy)
			})

		listen(document, 'mouseup touchend').start(a => this.xy.stop())
	}
}
</script>


<style lang="less">

</style>
