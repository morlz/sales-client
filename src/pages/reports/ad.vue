<template>
<q-page class="AppContent">
	<div class="ReportAd">
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
						<td rowspan="2">Салон</td>
						<td colspan="3" v-for="adSource, adIndex in adSources">
							{{ adSource.name }}
						</td>
						<td colspan="3">Итого</td>
					</tr>

					<tr>
						<template v-for="adSource, adIndex in adSources">
							<td>Шт.</td>
							<td>Сум. руб.</td>
							<td>%</td>
						</template>

						<td>Шт.</td>
						<td>Сум. руб.</td>
						<td>%</td>
					</tr>
				</thead>

				<tbody>
					<tr v-for="salon, index in cached">
						<td>{{ salon.name }}</td>

						<template v-for="adSource, adIndex in adSources">
							<td :class="{ 'ReportAd__secondary': adSource.isZero(salon.adSources) }">
								{{ salon.adSources[adIndex] ? salon.adSources[adIndex].invoiceCount : 0 }}
							</td>
							<td :class="{ 'ReportAd__secondary': adSource.isZero(salon.adSources) }">
								{{ salon.adSources[adIndex] ? salon.adSources[adIndex].invoicesPriceSumm : 0 | money }}
							</td>
							<td :class="{ 'ReportAd__secondary': adSource.isZero(salon.adSources) }">
								{{ salon.adSources[adIndex] ? salon.adSources[adIndex].of(reports_ad_summ[index]) : 0 }}%
							</td>
						</template>

						<td>{{ reports_ad_count[index] }}</td>
						<td>{{ reports_ad_summ[index] | money }}</td>
						<td>{{ (reports_ad_summ[index] / reports_ad_summResultAll * 100).toFixed(2) }}%</td>
					</tr>

					<tr>
						<td>Итого</td>

						<template v-for="adSource, adIndex in adSources">
							<td>{{ reports_ad_countResult[adIndex] }}</td>
							<td>{{ reports_ad_summResult[adIndex] | money }}</td>
							<td>{{ (reports_ad_summResult[adIndex] / reports_ad_summResultAll * 100).toFixed(2) }}</td>
						</template>

						<td>{{ reports_ad_countResultAll }}</td>
						<td>{{ reports_ad_summResultAll | money }}</td>
						<td>100%</td>
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
import money from '@/filters/Money'

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
			date: state => state.date,
			adSources: state => state.cached.adSources
		}),
		...mapGetters([
			'app_view_mobile'
		]),
		...mapGetters('reports/ad', [
			'reports_ad_summ',
			'reports_ad_count',
			'reports_ad_summResult',
			'reports_ad_countResult',
			'reports_ad_summResultAll',
			'reports_ad_countResultAll'
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
			'reports_ad_dateSet',
			'reports_ad_exportToExcel',
			'reports_ad_destroy'
		]),
		exportToExcel () {
			this.reports_ad_exportToExcel(this.$refs.tableWrapper.$el.innerHTML)
		}
	},
	filters: {
		money
	},
	async mounted () {
		await this.reports_ad_init()
	},
	beforeDestroy () {
		this.reports_ad_destroy()
	}
}
</script>


<style lang="stylus">

.ReportAd
	display grid
	grid-gap 10px
	grid-template-rows 66px calc(100% - 66px)
	grid-template-columns 100%
	height calc(100% - 10px)
	padding 10px
	&__actions
		display grid
		grid-gap 15px
		padding 5px 10px
		justify-content start
		align-items center
		grid-template-columns repeat(auto-fill, minmax(200px, max-content))
		button
			margin 10px 0

	&__content
		height 100%
		width 100%
		overflow scroll

	&__table
		border 0
		border-collapse collapse
		font-size 12px
		min-width 100%

		thead
			text-align center

		tbody
			td
				text-align right
				&:nth-child(3n+2)
					text-align center

				&:first-child
					text-align left


			tr
				transition all 0.15s ease-in-out
				&:hover
					background #ecf5ff

		td
			border 1px solid #ccc
			padding 4px
			white-space nowrap

	&__secondary
		opacity .3
</style>
