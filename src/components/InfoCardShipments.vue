<template>
	<q-card>
		<q-card-title>
			Доставки
		</q-card-title>

		<q-card-main>
			<q-tabs inverted v-model="currentTab">
				<q-tab v-for="shipment, index in data" :key="index" slot="title" :name="shipment.ID_OTG" :label="shipment.PL_OTGR" :default="!index"/>
			</q-tabs>

			<q-list highlight no-border>
				<q-item>
					<q-item-side>Вид</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.VIDDOST }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Откуда</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.OTKUDA }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Куда</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.KUDA }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Плановая дата</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.PL_OTGR }}
					</q-item-side>
				</q-item>

				<q-item v-if="shipment.DATEV">
					<q-item-side>Дата ввода</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.DATEV }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Цена доставки</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.SUM_DOST }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Цена товара</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ shipment.SUM_TOVAR }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Телефон</q-item-side>
					<q-item-main/>
					<q-item-side right>
						<q-item-tile v-if="shipment.TEL1">{{ shipment.TEL1 }}</q-item-tile>
						<q-item-tile v-if="shipment.TEL2">{{ shipment.TEL2 }}</q-item-tile>
					</q-item-side>
				</q-item>
			</q-list>

			<table-collapsible :columns="[]" :rows="shipment.rows" accordion border-open>
				<template slot-scope="{ row }">
					<info-card-sofa-inner :content="row"/>
				</template>
			</table-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import reduceShipmentTd from '@/lib/reducers/invoice/shipmentTd'
import reduceShipmentZak from '@/lib/reducers/invoice/shipmentZak'
import TableCollapsible from '@/components/TableCollapsible'
import InfoCardSofaInner from '@/components/InfoCardSofaInner'

export default {
	components: {
		TableCollapsible,
		InfoCardSofaInner
	},
	mixins: [AuthMixin],
	props: ["content"],
	data () {
		return {
			currentTab: ''
		}
	},
	watch: {

	},
	methods: {

	},
	computed: {
		data () {
			return ((this.content || {}).shipments || []).map(shipment => {
				return {
					...shipment,
					rows: [
						...this.content.td.filter(el => el.NZVR == shipment.ID_OTG).map(el => reduceShipmentTd(el)),
						...this.content.zak.filter(el => el.NZV == shipment.ID_OTG).map(el => reduceShipmentZak(el))
					]
				}
			})
		},
		shipment () {
			return this.data.find(shipment => shipment.ID_OTG === this.currentTab) || {}
		}
	}
}
</script>


<style lang="less">


</style>
