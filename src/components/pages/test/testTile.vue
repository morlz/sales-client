<template>
	<q-card class="test__moutionTile" :style="tileStyle">
		<q-card-title>
			<template v-if="invoice.client">
				{{ invoice.client.lastname }} {{ invoice.client.name }} {{ invoice.client.patronymic }}
			</template>
			<q-btn slot="right" flat color="negative" @click="hide" class="test__moutionTileHideBtn">Скрыть</q-btn>
        </div>
		</q-card-title>
		<q-card-main>
			<table-collapsible :rows="invoice.content" :columns="invoiceFieldDescription">
				<template slot="startH" >
					<q-checkbox v-model="all" v-if="invoice.content.length > 1" />
					<div v-else="invoice.content.length > 1" />
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
	QCheckbox,
	QBtn
} from 'quasar'
import { styler, spring, listen, pointer, value } from 'popmotion'

import TableCollapsible from '@/components/TableCollapsible.vue'

export default {
	props: {
		invoice: {
			type: Object,
			requred: true
		},
		wsCords: {
			type: Object,
			default: a => ({ x: 0, y: 0 })
		}
	},
	data() {
		return {
			invoiceFieldDescription: [
				{ field: "un", label: "un" },
				{ field: "name", label: "name" },
				{ field: "weight", label: "weight" },
				{ field: "space", label: "space" },
			],
			cords: { x: 0, y: 0 },
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
		QCheckbox,
		QBtn
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
		},
		tileStyle () {
			return {
				'z-index' : this.invoice.z,
				transform: `translate(${this.cords.x}px, ${this.cords.y}px)`
			}
		}
	},
	methods: {
		hide () {
			this.$emit('hide')
		},
	},
	mounted () {
		this.xy = value(this.cords, v => this.cords = v)

		listen(this.$el, 'mousedown touchstart')
			.start(e => {
				e.preventDefault()
				e.stopPropagation()
				this.$emit('drag')
				pointer(this.xy.get()).start(this.xy)
			})

		listen(document, 'mouseup touchend').start(a => this.xy.stop())

		window.addEventListener('mousemove', e => {
			this.cords = {
				x: e.clientX - this.$el.offsetWidth / 2 - 50 - this.wsCords.x,
				y: e.clientY - this.$el.offsetHeight / 2 - 100 - this.wsCords.y
			}
			this.xy = value(this.cords, v => this.cords = v)
		}, { once: true })
	}
}
</script>


<style lang="less">
.test {
	&__moutionTileHideBtn {
		margin-left: 10px;
	}
}
</style>
