<template>
	<q-card>
		<q-card-title>
			Заказные позиции
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="c" :rows="data">
				<template slot-scope="props">
					<div class="collabsibleContent">
						<div class="separator-g" v-ga="`sg1`"/>

						<table-two-collumns>
							<table-two-collumns-row>
								<template slot="label">Цена</template>
								{{ props.row.CENA }}
							</table-two-collumns-row>

							<table-two-collumns-row>
								<template slot="label">Категория</template>
								{{ props.row.KAT }}
							</table-two-collumns-row>

							<table-two-collumns-row>
								<template slot="label">Модель</template>
								{{ props.row.MODEL }}
							</table-two-collumns-row>

							<table-two-collumns-row>
								<template slot="label">Тип</template>
								{{ props.row.TIP }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="+props.row.SKIDKA">
								<template slot="label">Скидка</template>
								{{ props.row.SKIDKA }} {{ props.row.S_TYPE == 1 ? 'руб.' : '%' }}
							</table-two-collumns-row>
						</table-two-collumns>

						<div class="separator-v" v-ga="`sm`"/>

						<table-two-collumns>
							<table-two-collumns-row v-if="props.row.DEKOR">
								<template slot="label">Декор</template>
								{{ props.row.DEKOR }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="props.row.Vid_stegki">
								<template slot="label">Вид стёжки</template>
								{{ props.row.Vid_stegki }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="props.row.TKAN">
								<template slot="label">Ткань 1</template>
								{{ props.row.TKAN }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="props.row.KOMP">
								<template slot="label">Ткань 2</template>
								{{ props.row.KOMP }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="props.row.KOMP1">
								<template slot="label">Ткань 3</template>
								{{ props.row.KOMP1 }}
							</table-two-collumns-row>

							<table-two-collumns-row v-if="props.row.COMMENT">
								<template slot="label">Примечание</template>
								{{ props.row.COMMENT }}
							</table-two-collumns-row>
						</table-two-collumns>

						<div class="separator-g" v-ga="`sg2`"/>
					</div>
				</template>
			</table-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import TableCollapsible from '@/components/TableCollapsible.vue'
import TableTwoCollumns from '@/components/TableTwoCollumns.vue'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow.vue'
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
		TableCollapsible,
		TableTwoCollumns,
		TableTwoCollumnsRow,
	},
	data () {
		return {
			c: [
				{ field: "MODEL", label: "Модель" },
				{ field: "TIP", label: "Тип" },
				{ field: "KAT", label: "Категория" },
				{ field: "CENA", label: "Цена" },
				{ field: "Vid_stejki", label: "Стёжка" },
				{ field: "DEKOR", label: "Декор" },
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
.collabsibleContent {
	display: grid;
	grid-template: 	"sg1 sg1 sg1" 	1px
					"c1  sm  c2"	1fr
					"sg2 sg2 sg2"	1px
				~"/" 1fr 1px 1fr;
	align-items: flex-start;
	padding: 15px;
	grid-gap: 15px;
	.tableTwoCollumns__rowValue {
		font-weight: bold;
	}
}

</style>
