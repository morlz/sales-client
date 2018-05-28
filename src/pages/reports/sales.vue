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
					<q-icon name="fas fa-download"/>
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
					<tr v-for="item, name in reports_sales_cached">
						<td>{{ name }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.countAll) }">{{ item.countAll }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.priceAll) }">{{ item.priceAll | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.count.podium) }">{{ item.count.podium }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.price.podium) }">{{ item.price.podium | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.count.storage) }">{{ item.count.storage }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.price.storage) }">{{ item.price.storage | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.count.order) }">{{ item.count.order }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.price.order) }">{{ item.price.order | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.akc.count) }">{{ item.akc.count }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(item.akc.price) }">{{ item.akc.price | price }}</td>
					</tr>

					<tr>
						<td>ИТОГО:</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.count.all) }">{{ reports_sales_summ.count.all }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.price.all) }">{{ reports_sales_summ.price.all | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.count.podium) }">{{ reports_sales_summ.count.podium }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.price.podium) }">{{ reports_sales_summ.price.podium | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.count.storage) }">{{ reports_sales_summ.count.storage }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.price.storage) }">{{ reports_sales_summ.price.storage | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.count.order) }">{{ reports_sales_summ.count.order }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.price.order) }">{{ reports_sales_summ.price.order | price }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.count.akc) }">{{ reports_sales_summ.count.akc }}</td>
						<td :class="{ 'reportSales__secondary' : isZero(reports_sales_summ.price.akc) }">{{ reports_sales_summ.price.akc | price }}</td>
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
		},
		isZero (val) {
			return +val === 0
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
		//padding: 10px;
		overflow: auto;
	}

	&__table {
		width: 100%;
		font-size: 12px;
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
			border: 1px solid #ccc;
			padding: 4px;
			white-space: nowrap;
		}
	}

	&__secondary {
		opacity: .3;
	}
}


</style>
