<template>
	<q-card>
		<q-card-title>
			Заказные позиции
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="c" :rows="data">
				<template slot-scope="props">
					{{ props.row.ID }}
				</template>
			</table-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>

/*

	<q-collapsible
		v-for="zak, index in data"
		:label="`${zak.TIP} ${zak.MODEL}`"
		:sublabel="`${zak.CENA} руб.`"
		:key="index"
		group="zak"
		:opened="data.length == 1">
		<q-list highlight no-border>
			<q-item>
				<q-item-side>Цена</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.CENA }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Категория</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.KAT }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Модель</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.MODEL }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Тип</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.TIP }}
				</q-item-side>
			</q-item>

			<q-item v-if="zak.DEKOR">
				<q-item-side>Декор</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.DEKOR }}
				</q-item-side>
			</q-item>

			<q-item v-if="zak.Vid_stegki">
				<q-item-side>Вид стёжки</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.Vid_stegki }}
				</q-item-side>
			</q-item>

			<q-item v-if="zak.TKAN">
				<q-item-side>Ткань 1</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.TKAN }}
				</q-item-side>
			</q-item>

			<q-item v-if="zak.KOMP">
				<q-item-side>Ткань 2</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.KOMP }}
				</q-item-side>
			</q-item>

			<q-item v-if="zak.KOMP1">
				<q-item-side>Ткань 3</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.KOMP1 }}
				</q-item-side>
			</q-item>

			<q-item v-if="+zak.SKIDKA">
				<q-item-side>Скидка</q-item-side>
				<q-item-main/>
				<q-item-side>
					{{ zak.SKIDKA }} {{ zak.S_TYPE == 1 ? 'руб.' : '%' }}
				</q-item-side>
			</q-item>
		</q-list>
	</q-collapsible>
*/


import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import TableCollapsible from '@/components/TableCollapsible.vue'
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
		QCollapsible,
		TableCollapsible
	},
	data () {
		return {
			c: [
				{ field: "ID", label: "ID" },
				{ field: "MODEL", label: "MODEL" },
				{ field: "TIP", label: "TIP" },
				{ field: "Zakaz", label: "Zakaz" },
				{ field: "KOMP", label: "KOMP" },

			]
		}
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
