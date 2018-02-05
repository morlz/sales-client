<template>
	<q-card>
		<q-card-title>
			Доставки
		</q-card-title>

		<q-card-main>
			<q-collapsible
				v-for="shipment, index in data"
				:label="`${shipment.OTKUDA} => ${shipment.KUDA}`"
				:sublabel="shipment.DATEV ? `Дата ${shipment.DATEV}` : `Плановая дата ${shipment.PL_OTGR}`"
				:key="index"
				group="shipments"
				:opened="data.length == 1">
				<q-list highlight no-border	>
					<q-item>
						<q-item-side>Вид</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.VIDDOST }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Откуда</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.OTKUDA }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Куда</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.KUDA }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Плановая дата</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.PL_OTGR }}
						</q-item-side>
					</q-item>

					<q-item v-if="shipment.DATEV">
						<q-item-side>Фактическая дата</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.DATEV }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Цена доставки</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.SUM_DOST }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Цена товара</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.SUM_TOVAR }}
						</q-item-side>
					</q-item>

					<q-item>
						<q-item-side>Телефон</q-item-side>
						<q-item-main/>
						<q-item-side>
							{{ shipment.TEL1 }}
							{{ shipment.TEL2 }}
						</q-item-side>
					</q-item>
				</q-list>
			</q-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import {
	QCard,
	QCardTitle,
	QCardMain,
	QList,
	QItem,
	QItemMain,
	QItemSide,
	QItemTile,
	QItemSeparator,
	QCollapsible
} from 'quasar'

export default {
	mixins: [mixins],
	props: ["content"],
	components: {
		QCard,
		QCardTitle,
		QCardMain,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QItemTile,
		QItemSeparator,
		QCollapsible
	},
	data () {
		return {}
	},
	watch: {

	},
	methods: {

	},
	computed: {
		data () {
			return this.content || []
		},
		fio () {
			return this.data.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		}
	}
}
</script>


<style lang="less">


</style>
