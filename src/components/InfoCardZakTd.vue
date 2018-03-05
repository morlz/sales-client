<template>
	<q-card>
		<q-card-title>
			Состав счёта
		</q-card-title>

		<q-card-main>
			<template v-if="zak.length">
				<h6>Заказные позиции</h6>
				<table-collapsible :columns="colsZak" :rows="zak" accordion border-open>
					<template slot-scope="props">
						<div class="collabsibleContent" :class="{ 'collabsibleContent-mobile': app_view_mobile }">
							<div class="separator-g" v-ga="`sg1`"/>

							<table-two-collumns v-ga="'c1'">
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

							<table-two-collumns v-ga="'c2'">
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
									<preview-cloth :content="props.row.cloth1" v-if="props.row.cloth1"/>
									{{ !props.row.cloth1 ? props.row.TKAN : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.KOMP">
									<template slot="label">Ткань 2</template>
									<preview-cloth :content="props.row.cloth2" v-if="props.row.cloth2"/>
									{{ !props.row.cloth2 ? props.row.KOMP : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.KOMP1">
									<template slot="label">Ткань 3</template>
									<preview-cloth :content="props.row.cloth3" v-if="props.row.cloth3"/>
									{{ !props.row.cloth3 ? props.row.KOMP1 : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.COMMENT">
									<template slot="label">Примечание</template>
									{{ props.row.COMMENT }}
								</table-two-collumns-row>
							</table-two-collumns>

							<div class="separator-g" v-ga="`sg2`"/>
						</div>
					</template>

					<div slot="end" slot-scope="{ row }" class="infoCardZak__buttons">
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
				<table-collapsible :columns="colsTd" :rows="td" accordion border-open>
					<template slot-scope="props">
						<div class="collabsibleContent" :class="{ 'collabsibleContent-mobile': app_view_mobile }">
							<div class="separator-g" v-ga="`sg1`"/>

							<table-two-collumns v-ga="'c1'">
								<table-two-collumns-row>
									<template slot="label">Цена</template>
									{{ props.row.CENA_ZAL }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture">
									<template slot="label">Категория</template>
									{{ props.row.furniture.KAT }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture">
									<template slot="label">Модель</template>
									{{ props.row.furniture.MODEL }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture">
									<template slot="label">Тип</template>
									{{ props.row.furniture.TIP }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="+props.row.SKIDKA">
									<template slot="label">Скидка</template>
									{{ props.row.SKIDKA }} {{ props.row.S_TYPE == 1 ? 'руб.' : '%' }}
								</table-two-collumns-row>
							</table-two-collumns>

							<div class="separator-v" v-ga="`sm`"/>

							<table-two-collumns v-if='props.row.furniture' v-ga="'c2'">
								<table-two-collumns-row v-if="props.row.furniture.DEKOR">
									<template slot="label">Декор</template>
									{{ props.row.furniture.DEKOR }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture.Vid_stegki">
									<template slot="label">Вид стёжки</template>
									{{ props.row.furniture.Vid_stegki }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture.TKAN">
									<template slot="label">Ткань 1</template>
									<preview-cloth :content="props.row.furniture.cloth1" v-if="props.row.furniture.cloth1"/>
									{{ !props.row.furniture.cloth1 ? props.row.furniture.TKAN : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture.KOMP">
									<template slot="label">Ткань 2</template>
									<preview-cloth :content="props.row.furniture.cloth2" v-if="props.row.furniture.cloth2"/>
									{{ !props.row.furniture.cloth2 ? props.row.furniture.KOMP : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture.KOMP1">
									<template slot="label">Ткань 3</template>
									<preview-cloth :content="props.row.furniture.cloth3" v-if="props.row.furniture.cloth3"/>
									{{ !props.row.furniture.cloth3 ? props.row.furniture.KOMP1 : '' }}
								</table-two-collumns-row>

								<table-two-collumns-row v-if="props.row.furniture.COMMENT">
									<template slot="label">Примечание</template>
									{{ props.row.furniture.COMMENT }}
								</table-two-collumns-row>
							</table-two-collumns>

							<div class="separator-g" v-ga="`sg2`"/>
						</div>
					</template>

					<div slot="end" slot-scope="{ row }">
						<q-btn flat @click.stop="invoice_removeTd(row)">
							<q-icon name="delete"/>
						</q-btn>
					</div>
				</table-collapsible>
			</template>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="invoice_addFromCart">Добавить из корзины</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import TableCollapsible from '@/components/TableCollapsible.vue'
import TableTwoCollumns from '@/components/TableTwoCollumns.vue'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow.vue'
import PreviewCloth from '@/components/PreviewCloth.vue'
import {
	QBtn,
	QCard,
	QCardTitle,
	QCardMain,
	QCardActions,
	QList,
	QItem,
	QIcon,
	QItemMain,
	QItemSide,
	QItemTile,
	QItemSeparator,
	QCollapsible
} from 'quasar'

import reduceTd from '@/lib/reducers/td'

export default {
	mixins: [mixins],
	props: ["content"],
	components: {
		QBtn,
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QList,
		QItem,
		QIcon,
		QItemMain,
		QItemSide,
		QItemTile,
		QItemSeparator,
		QCollapsible,
		TableCollapsible,
		TableTwoCollumns,
		TableTwoCollumnsRow,
		PreviewCloth
	},
	data () {
		return {
			colsZak: [
				{ fields: ["TIP", "MODEL"], label: "Наименование" },
				{ field: "KAT", label: "Категория" },
				{ field: "CENA", label: "Цена" },
				{ field: "Vid_stejki", label: "Стёжка" },
				{ field: "DEKOR", label: "Декор" },
			],
			colsTd: [
				{ fields: ["furniture.TIP", "furniture.MODEL"], label: "Наименование" },
				{ field: "furniture.KAT", label: "Категория" },
				{ field: "CENA_ZAL", label: "Цена" },
				{ field: "furniture.Vid_stejki", label: "Стёжка" },
				{ field: "furniture.DEKOR", label: "Декор" },
			]
		}
	},
	watch: {

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
			return this.data.td || []
		},
		zak () {
			return this.data.zak || []
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
