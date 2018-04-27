<template>
	<q-card>
		<q-card-title>
			Состав счёта
		</q-card-title>

		<q-card-main>
			<template v-if="zak.length">
				<h6>Заказные позиции</h6>
				<table-collapsible :columns="InfoCardSofaHead" :rows="zak" accordion border-open>
					<info-card-sofa-inner slot-scope="{ row }" :content="row"/>

					<div slot="end" slot-scope="{ row }" class="infoCardZak__buttons" v-if="!row.dax">
						<q-btn flat @click.stop="invoice_editZak(row)">
							<q-icon name="edit"/>
						</q-btn>

						<q-btn flat @click.stop="invoice_removeZak(row)">
							<q-icon name="delete"/>
						</q-btn>
					</div>
				</table-collapsible>
			</template>

			<template v-if="td.length">
				<h6>Позиции со склада</h6>
				<table-collapsible :columns="InfoCardSofaHead" :rows="td" accordion border-open>
					<info-card-sofa-inner slot-scope="{ row }" :content="row"/>

					<div slot="end" slot-scope="{ row }" v-if="!row.dax">
						<q-btn flat @click.stop="invoice_removeTd(row)">
							<q-icon name="delete"/>
						</q-btn>
					</div>
				</table-collapsible>
			</template>
		</q-card-main>

		<q-card-actions v-if="!+data.IS_CLOSE">
			<q-btn color="primary" @click="invoice_addFromCart">Добавить из корзины</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible.vue'
import TableTwoCollumns from '@/components/TableTwoCollumns.vue'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow.vue'
import PreviewCloth from '@/components/PreviewCloth.vue'
import { QCollapsible } from 'quasar'
import reduceShipmentTd from '@/lib/reducers/invoice/shipmentTd'
import reduceShipmentZak from '@/lib/reducers/invoice/shipmentZak'
import InfoCardSofaInner from '@/components/InfoCardSofaInner'
import { InfoCardSofaHead } from '@/static/fieldDescription'

export default {
	mixins: [AuthMixin],
	props: ["content"],
	components: {
		QCollapsible,
		TableCollapsible,
		TableTwoCollumns,
		TableTwoCollumnsRow,
		PreviewCloth,
		InfoCardSofaInner
	},
	data () {
		return {
			InfoCardSofaHead
		}
	},
	methods: {
		...mapActions([
			'invoice_addFromCart',
			'invoice_removeTd',
			'invoice_removeZak',
			'invoice_editZak'
		])
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		data () {
			return this.content || {}
		},
		td () {
			return (this.data.td || []).map(el => reduceShipmentTd(el))
		},
		zak () {
			return (this.data.zak || []).map(el => reduceShipmentZak(el))
		}
	}
}
</script>


<style lang="less">
.collabsibleContent {
	display: grid;
	grid-template: 	"sg1 sg1 sg1" 	1px
					"c1  sm  c2"	1fr
					"sg2 sg2 sg2"	1px
				~"/" 1fr 1px 1fr;
	align-items: flex-start;
	padding: 15px;
	grid-gap: 15px;

	&-mobile {
		grid-template: 	"c1"	1fr
						"sg1"	1px
						"c2"	1fr
					~"/" 1fr;
	}

	.tableTwoCollumns__rowValue {
		font-weight: bold;
	}
}

.infoCardZak {
	&__buttons {
		display: grid;
		grid-auto-flow: column;
	}
}

</style>
