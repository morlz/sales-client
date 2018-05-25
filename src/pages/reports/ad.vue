<template>
<q-page class="AppContent">
	<div class="ReportAd AppContent__inner">
		<q-card class="ReportAd__actions">
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

		<q-card class="ReportAd__content" ref="tableWrapper">
			<table class="ReportAd__table">
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
					<tr v-for="item, index in cached">
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

export default {
	components: {
		Datetime,
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		...mapState('reports/ad', {
			cached: state => state.cached.list,
			date: state => state.date
		}),
		...mapGetters([
			'app_view_mobile'
		]),
		...mapGetters('reports/ad', [

		]),
		dateFrom: {
			get () {
				return this.date.from
			},
			set (from) {
				this.reports_ad_dateSet({ from })
			}
		},
		dateTo: {
			get () {
				return this.date.to
			},
			set (to) {
				this.reports_ad_dateSet({ to })
			}
		}
	},
	methods: {
		...mapActions('reports/ad', [
			'reports_ad_init',
			'reports_ad_dateSet'
		]),
		...mapMutations('reports/ad', [
			'reports_ad_destroy'
		]),
		exportToExcel () {
			this.$store.dispatch('notify', 'Создание файла')
			this.reports_ad_exportToExcel(this.$refs.tableWrapper.innerHTML)
		}
	},
	async mounted () {
		await this.reports_ad_init()
	},
	beforeDestroy () {
		this.reports_ad_destroy()
	}
}
</script>


<style lang="less">
.ReportAd {
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
