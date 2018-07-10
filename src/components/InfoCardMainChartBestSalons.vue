<template>
	<q-card class="InfoCardMainChartBestSalons">
		<q-card-title>
			Лучшие салоны
		</q-card-title>

		<q-card-main>
			<chart-bar-horizontal
				:chart-data="report_main_best"
				:options="options"
				v-if="chart"
				:width="width"
				:height="height"/>
		</q-card-main>
	</q-card>
</template>

<script>
import BaseInfoCardMainChart from '@/components/BaseInfoCardMainChart'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'
import ChartBarHorizontal from '@/components/ChartBarHorizontal'

export default {
	components: {
		ChartBarHorizontal,
		BaseInfoCardMainChart
	},
	mixins: [AuthMixin],
	data () {
		return {
			chart: false,
			width: 0,
			height: 0,
			options: {}
		}
	},
	computed: {
		...mapGetters('reports/main', [
			'report_main_best'
		])
	},
	mounted () {
		this.width = this.$el.offsetWidth
		this.height = this.$el.offsetHeight
		this.chart = true
	},
	created () {
		this.$store.dispatch('reports/main/report_main_init')
	},
	beforeDestroy () {
		this.$store.dispatch('reports/main/report_main_destroy')
	}
}
</script>


<style lang="stylus">
</style>
