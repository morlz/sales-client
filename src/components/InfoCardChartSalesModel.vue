<template>
	<q-card class="InfoCardChartSalesModel">
		<q-card-title>
			Лучшие модели за месяц
		</q-card-title>

		<q-card-main>
			<chart-bar-horizontal
				:chart-data="report_salesModel_cached"
				:options="options"
				v-if="chart"
				:width="width"
				:height="height"/>
		</q-card-main>
	</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'
import ChartBarHorizontal from '@/components/ChartBarHorizontal'
import {} from 'quasar'

export default {
	components: {
		ChartBarHorizontal
	},
	props: {

	},
	data() {
		return {
			chart: false,
			width: 0,
			height: 0,
			options: {
				legend: {
					display: false
				}
			}
		}
	},
	watch: {

	},
	computed: {
		...mapGetters('reports/salesModel', [
			'report_salesModel_cached'
		])
	},
	methods: {

	},
	mounted () {
		this.width = this.$el.offsetWidth
		this.height = this.$el.offsetHeight
		this.chart = true
	},
	created () {
		this.$store.dispatch('reports/salesModel/report_salesModel_init')
	},
	beforeDestroy () {
		this.$store.dispatch('reports/salesModel/report_salesModel_destroy')
	}
}
</script>


<style lang="stylus">

</style>
