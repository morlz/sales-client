<template>
<div class="AppContent">
	<div class="reportSalesTwo">
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
					<q-icon name="fa-download"/>
					{{ !app_view_mobile ? 'Экспорт в Excel' : ''}}
				</q-btn>
			</q-field>
		</q-card>

		<q-card class="reportSalesTwo__content" v-loading="reports_salesTwo_loading" ref="tableWrapper">
			<table-collapsible class="reportSalesTwo__collapsible" :rows="reports_salesTwo_cached" :columns="reportsSalesTwoFieldDescription">
				<template slot-scope="{ row }">
					<table class="reportSalesTwo__collapsible-table">
						<thead>
							<tr>
								<td v-for="column, index in columns" :key="index">
									<div :title="column.title" @click="reports_salesTwo_groupByFieldSet(column.field)">{{ column.name }}</div>
								</td>
							</tr>
						</thead>

						<tbody>
							<tr v-for="item, index in row" :key="index">
								<td v-for="column, index in columns">
									<div :title="item[column.field]">{{ item[column.field] }}</div>
								</td>
							</tr>
						</tbody>
					</table>
				</template>
			</table-collapsible>
		</q-card>
	</div>

</div>
</template>

<script>
import {
	mapState,
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import Datetime from '@/components/Datetime'
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
		TableCollapsible
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
	watch: {
		reports_salesTwo_cached (n) {
			console.log(n)
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
			'reports_salesTwo_loading'
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
			'reports_salesTwo_exportToExcel'
		]),
		...mapMutations('reports/salesTwo', [
			'reports_salesTwo_groupByFieldSet'
		]),
		exportToExcel () {
			this.reports_salesTwo_exportToExcel(this.$refs.tableWrapper.innerHTML)
		}
	},
	async mounted () {
		await this.reports_salesTwo_init()
	}
}
</script>


<style lang="less">

.nth-child-width(@index, @width) {
	&:nth-child(@{index}) > div {
		width: @width;
	}
}

.reportSalesTwo {
	&__actions {
		display: grid;
		grid-gap: 15px;
		padding: 0 10px;
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

	&__collapsible-table {
		table-layout: fixed;
		border: 0;
		border-collapse: collapse;
		thead {
			text-align: center;
			color: rgba(0,0,0,.54);
			user-select: none;
			cursor: pointer;
			font-size: 12px;
		}

		tbody {
			td {
				text-align: center;
			}
			tr {
				transition: all 0.15s ease-in-out;
				&:hover {
					background: #ecf5ff;
				}
			}
		}

		td {
			padding: 4px;
			border: 1px solid #ededed;
			.nth-child-width(1, 100px);
			.nth-child-width(2, 80px);
			.nth-child-width(3, 160px);
			.nth-child-width(4, 100px);
			.nth-child-width(5, 150px);
			.nth-child-width(6, 60px);
			.nth-child-width(7, 60px);
			.nth-child-width(8, 60px);
			.nth-child-width(9, 100px);
			.nth-child-width(10, 100px);
			.nth-child-width(11, 100px);
			.nth-child-width(12, 70px);
			.nth-child-width(13, 70px);
			.nth-child-width(14, 70px);
		}

		td > div {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}


</style>
