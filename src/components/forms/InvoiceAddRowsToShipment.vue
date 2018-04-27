<template>
<q-modal class="InvoiceAddRowsToShipmentForm" v-model="modal" :content-css="{ minHeight: '80vh', minWidth: '90vw' }">
	<q-modal-layout>
		<q-toolbar slot="header">
			<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />

			<q-toolbar-title>
				Добавить доставку в заказ {{ content.N_DOC }}
			</q-toolbar-title>
		</q-toolbar>

		<div class="layout-padding">
			<template v-if="zak.length">
				<h6>Заказные позиции</h6>
				<table-collapsible :columns="InfoCardSofaHead" :rows="zak" accordion border-open>
					<template slot="startH" slot-scope="{ row }">
						<q-checkbox :value="all.zak" @input="checkAll($event, 'zak')"/>
					</template>

					<template slot="start" slot-scope="{ row }">
						<q-checkbox :value="checked.findIndex(el => el.id == row.id) != -1" @input="check($event, row, 'zak')" v-if="!row.shipment_id"/>
					</template>
					<info-card-sofa-inner slot-scope="{ row }" :content="row"/>
				</table-collapsible>
			</template>

			<template v-if="td.length">
				<h6>Позиции со склада</h6>
				<table-collapsible :columns="InfoCardSofaHead" :rows="td" accordion border-open>
					<template slot="startH" slot-scope="{ row }">
						<q-checkbox :value="all.td" @input="checkAll($event, 'td')"/>
					</template>

					<template slot="start" slot-scope="{ row }" v-if="!row.shipment_id">
						<q-checkbox :value="checked.findIndex(el => el.id == row.id) != -1" @input="check($event, row, 'td')"/>
					</template>
					<info-card-sofa-inner slot-scope="{ row }" :content="row"/>
				</table-collapsible>
			</template>

			<div class="InvoiceAddRowsToShipmentForm__buttons">
				<q-btn color="primary" @click="add">Добавить</q-btn>
				<q-btn color="secondary" flat v-close-overlay>Назад</q-btn>
			</div>
		</div>
	</q-modal-layout>
</q-modal>
</template>

<script>
import reduceShipmentTd from '@/lib/reducers/invoice/shipmentTd'
import reduceShipmentZak from '@/lib/reducers/invoice/shipmentZak'
import TableCollapsible from '@/components/TableCollapsible'
import InfoCardSofaInner from '@/components/InfoCardSofaInner'
import { InfoCardSofaHead } from '@/static/fieldDescription'
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

export default {
	components: {
		InfoCardSofaInner,
		TableCollapsible
	},
	props: {
		value: Boolean,
		content: {
			type: Object,
			default: a => ({})
		},
		shipment: [Number, String]
	},
	data() {
		return {
			InfoCardSofaHead,
			checked: []
		}
	},
	watch: {
		content () {
			this.checked = []
		}
	},
	computed: {
		modal: {
			get () {
				return this.value
			},
			set (val) {
				this.$emit('input', val)
			}
		},
		data () {
			return this.content || {}
		},
		td () {
			return (this.data.td || []).map(el => reduceShipmentTd(el))
		},
		zak () {
			return (this.data.zak || []).map(el => reduceShipmentZak(el))
		},
		all () {
			return ['td', 'zak']
				.reduce((obj, type) =>
					({
						...obj,
						[type]: this.checked.filter(el => el.type == type).length == this[type].filter(el => el.shipment_id == null).length
					}),
					{}
				)
		}
	},
	methods: {
		...mapActions([
			'shipment_addRows'
		]),
		check (e, row, type) {
			if (e) {
				this.checked.push({ type, id: row.id })
			} else {
				this.checked = this.checked.filter(el => el.id != row.id)
			}
		},
		checkAll(e, type) {
			if (e) {
				this.checked = [...this.checked.filter(el => el.type != type), ...this[type].filter(el => el.shipment_id == null).map(item => ({ type, id: item.id }))]
			} else {
				this.checked = this.checked.filter(el => el.type != type)
			}
		},
		async add () {
			await this.shipment_addRows({
				shipment_id: this.shipment,
				rows: this.checked
			})
			this.modal = false
		}
	}
}
</script>


<style lang="stylus">
.InvoiceAddRowsToShipmentForm
	&__buttons
		margin 15px 0
</style>
