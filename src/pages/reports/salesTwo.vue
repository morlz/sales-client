<template>
<q-page class="AppContent">
	<div class="reportSalesTwo AppContent__inner">
		<q-card class="reportSalesTwo__actions">
			<q-field helper="Салон">
				<q-select v-model="salon" :options="local_salon_list" filter/>
			</q-field>

			<q-field helper="С">
				<datetime v-model="dateFrom"/>
			</q-field>

			<q-field helper="По">
				<datetime v-model="dateTo"/>
			</q-field>

			<q-field>
				<q-btn v-if="false">
					<q-icon name="open_in_new"/>
					{{ !app_view_mobile ? 'Открыть в новом окне' : ''}}
				</q-btn>
				<q-btn @click="exportToExcel">
					<q-icon name="fas fa-download"/>
					{{ !app_view_mobile ? 'Экспорт в Excel' : ''}}
				</q-btn>
			</q-field>
		</q-card>

		<q-card class="reportSalesTwo__content" v-loading="reports_salesTwo_loading" ref="tableWrapper">
			<table-collapsible class="reportSalesTwo__collapsible" :rows="reports_salesTwo_cached" :columns="reportsSalesTwoFieldDescription">
				<template slot-scope="{ row }">
					<sales-two-table :row="row" :columns="columns"/>
				</template>
			</table-collapsible>

			<div ref="exportToExcel" v-if="reports_salesTwo_exportExcelVisible">
				<sales-two-table :row="reports_salesTwo_cachedAll" :columns="columns" />
			</div>
		</q-card>
	</div>
</q-page>
</template>

<script>
import {
	mapState,
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import Datetime from '@/components/Datetime'
import SalesTwoTable from '@/components/SalesTwoTable'
import TableCollapsible from '@/components/TableCollapsible'

import { QCard, QBtn, QSelect, QField, QIcon } from 'quasar'

export default {
	components: {
		QCard,
		QBtn,
		Datetime,
		QSelect,
		QField,
		QIcon,
		TableCollapsible,
		SalesTwoTable
	},
	params: {
		salon: Boolean
	},
	data() {
		return {
			columns: [
				{ field: "model", name: "Модель" },
				{ field: "n_doc", name: "№ док.", title: "Номер документа" },
				{ field: "date", name: "Дата заказа" },
				{ field: "salon", name: "Салон" },
				{ field: "manager", name: "Продавец" },
				{ field: "type", name: "Тип" },
				{ field: "from", name: "Откуда" },
				{ field: "cloth1", name: "Основа" },
				{ field: "cloth2", name: "Компаньон" },
				{ field: "cloth3", name: "Компаньон 2" },
				{ field: "kat", name: "Категория" },
				{ field: "price", name: "Цена (без скидки)" },
				{ field: "discount", name: "Скидка" },
				{ field: "priceWithDiscount", name: "Цена (со скидкой)" }
			]
		}
	},
	computed: {
		...mapState('reports/salesTwo', [
			'date',
			'salon_id',
			'groupByField'
		]),
		...mapGetters([
			'salon_listWithAll',
			'app_view_mobile'
		]),
		...mapGetters('reports/salesTwo', [
			'reports_salesTwo_cached',
			'reports_salesTwo_loading',
			'reports_salesTwo_cachedAll',
			'reports_salesTwo_exportExcelVisible'
		]),
		local_salon_list () {
			return this.salon_listWithAll.map(el => ({ value: el.ID_SALONA, label: el.NAME }))
		},
		salon: {
			get () {
				return this.salon_id
			},
			set (n) {
				this.reports_salesTwo_salonSet(n)
			}
		},
		dateFrom: {
			get () {
				return this.date.from
			},
			set (n) {
				this.reports_salesTwo_dateFromSet(n)
			}
		},
		dateTo: {
			get () {
				return this.date.to
			},
			set (n) {
				this.reports_salesTwo_dateToSet(n)
			}
		},
		reportsSalesTwoFieldDescription () {
			return [{ field: "index", label: this.columns.find(el => el.field == this.groupByField).name }]
		}
	},
	methods: {
		...mapActions('reports/salesTwo', [
			'reports_salesTwo_init',
			'reports_salesTwo_salonSet',
			'reports_salesTwo_dateFromSet',
			'reports_salesTwo_dateToSet',
			'reports_salesTwo_exportToExcel',
			'reports_salesTwo_destroy'
		]),
		...mapMutations('reports/salesTwo', [
			'reports_salesTwo_exportExcelVisibleSet'
		]),
		exportToExcel () {
			this.$store.dispatch('notify', 'Создание файла')
			this.reports_salesTwo_exportExcelVisibleSet(true)
			let self = this
			;(function recursiveCheck () {
				self.$nextTick(() => {
					if (self.$refs.exportToExcel) {
						self.reports_salesTwo_exportToExcel(self.$refs.exportToExcel.innerHTML)
						self.reports_salesTwo_exportExcelVisibleSet(false)
					} else
						self.$nextTick(a => recursiveCheck())
				})
			})()
		}
	},
	async mounted () {
		await this.reports_salesTwo_init(!this.salon)
	},
	beforeDestroy () {
		this.reports_salesTwo_destroy()
	}
}
</script>


<style lang="less">
.reportSalesTwo {
	display: grid;
	grid-gap: 10px;

	&__actions {
		display: grid;
		grid-gap: 15px;
		padding: 5px 10px;
		justify-content: start;
		align-items: center;
		grid-template-columns: repeat(auto-fill, minmax(200px, max-content));
		button {
			margin: 10px 0;
		}
	}

	&__content {
		padding: 10px;
		overflow-x: auto;
	}

	&__collapsible {
		width: auto;
		overflow-x: scroll;
		.tableCollapsible {
			&__row {
				width: max-content;
				min-width: 100%;
			}

			&__bodyColumn {
				user-select: none;
			}

			&__rowCollapcible {
				&::-webkit-scrollbar {
					width: 0;
					height: 0;
				}
			}
		}
	}
}


</style>
