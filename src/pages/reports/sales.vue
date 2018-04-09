<template>
<q-page class="AppContent">
	<div class="reportSales AppContent__inner">
		<q-card class="reportSales__actions">
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

		<q-card class="reportSales__content" v-loading="reports_sales_loading" ref="tableWrapper">
			<table class="reportSales__table">
				<thead>
					<tr>
						<td rowspan="2">Модель</td>
						<td colspan="2">Всего</td>
						<td colspan="2">С подиума</td>
						<td colspan="2">Со склада</td>
						<td colspan="2">На заказ</td>
						<td colspan="2">В том числе акция</td>
					</tr>

					<tr>
						<template v-for="index in 5">
							<td>Шт.</td>
							<td>Руб.</td>
						</template>
					</tr>
				</thead>

				<tbody>
					<tr v-for="item, index in reports_sales_cached">
						<td>{{ index }}</td>
						<td>{{ item.countAll }}</td>
						<td>{{ item.priceAll | price }}</td>
						<td>{{ item.count.podium }}</td>
						<td>{{ item.price.podium | price }}</td>
						<td>{{ item.count.storage }}</td>
						<td>{{ item.price.storage | price }}</td>
						<td>{{ item.count.order }}</td>
						<td>{{ item.price.order | price }}</td>
						<td>{{ item.akc.count }}</td>
						<td>{{ item.akc.price | price }}</td>
					</tr>

					<tr>
						<td>ИТОГО:</td>
						<td>{{ reports_sales_summ.count.all }}</td>
						<td>{{ reports_sales_summ.price.all | price }}</td>
						<td>{{ reports_sales_summ.count.podium }}</td>
						<td>{{ reports_sales_summ.price.podium | price }}</td>
						<td>{{ reports_sales_summ.count.storage }}</td>
						<td>{{ reports_sales_summ.price.storage | price }}</td>
						<td>{{ reports_sales_summ.count.order }}</td>
						<td>{{ reports_sales_summ.price.order | price }}</td>
						<td>{{ reports_sales_summ.count.akc }}</td>
						<td>{{ reports_sales_summ.price.akc | price }}</td>
					</tr>
				</tbody>
			</table>
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

import { QCard, QBtn, QSelect, QField, QIcon } from 'quasar'

export default {
	components: {
		QCard,
		QBtn,
		Datetime,
		QSelect,
		QField,
		QIcon
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		...mapState('reports/sales', [
			'date',
			'salon_id'
		]),
		...mapGetters([
			'salon_listWithAll',
			'app_view_mobile'
		]),
		...mapGetters('reports/sales', [
			'reports_sales_cached',
			'reports_sales_loading',
			'reports_sales_summ'
		]),
		local_salon_list () {
			return this.salon_listWithAll.map(el => ({ value: el.ID_SALONA, label: el.NAME }))
		},
		salon: {
			get () {
				return this.salon_id
			},
			set (n) {
				this.reports_sales_salonSet(n)
			}
		},
		dateFrom: {
			get () {
				return this.date.from
			},
			set (n) {
				this.reports_sales_dateFromSet(n)
			}
		},
		dateTo: {
			get () {
				return this.date.to
			},
			set (n) {
				this.reports_sales_dateToSet(n)
			}
		}
	},
	methods: {
		...mapActions('reports/sales', [
			'reports_sales_init',
			'reports_sales_salonSet',
			'reports_sales_dateFromSet',
			'reports_sales_dateToSet',
			'reports_sales_exportToExcel',
			'reports_sales_destroy'
		]),
		exportToExcel () {
			this.$store.dispatch('notify', 'Создание файла')
			this.reports_sales_exportToExcel(this.$refs.tableWrapper.innerHTML)
		}
	},
	filters: {
		price (n) {
			let int = Math.floor(n),
				frac = (n - int) != 0 ? (n - int).toFixed(2).substr(2, 3) : "00"

			return int.toString().split("").reverse().reduce((prev, el, index) => prev + (index % 3 ? el : " " + el), "").split("").reverse().join("").trim() + '.' + frac
		}
	},
	async mounted () {
		await this.reports_sales_init()
	},
	beforeDestroy () {
		this.reports_sales_destroy()
	}
}
</script>


<style lang="less">
.reportSales {
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

	&__table {
		width: 100%;
		border: 0;
		border-collapse: collapse;
		thead {
			text-align: center;
		}

		tbody {
			td {
				&:nth-child(2n+1) {
					text-align: right;
				}
				&:nth-child(2n) {
					text-align: center;
				}
				&:first-child {
					text-align: left;
				}
			}
			tr {
				transition: all 0.15s ease-in-out;
				&:hover {
					background: #ecf5ff;
				}
			}
		}

		td {
			border: 1px solid #000;
			padding: 4px;
			white-space: nowrap;
		}
	}
}


</style>
