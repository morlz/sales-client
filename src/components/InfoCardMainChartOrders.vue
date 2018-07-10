<template>
	<base-info-card-main-chart title="Заказы" class="InfoCardMainChartOrders">
		<chart-line
			slot-scope="{ width, height }"
			:chart-data="report_main_orders"
			:options="options"
			class='InfoCardMainChartOrders__chart'
			:width="width"
			:height="height"/>
	</base-info-card-main-chart>
</template>

<script>
import BaseInfoCardMainChart from '@/components/BaseInfoCardMainChart'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'
import ChartLine from '@/components/ChartLine'

export default {
	components: {
		ChartLine,
		BaseInfoCardMainChart
	},
	mixins: [AuthMixin],
	data () {
		return {
			options: {}
		}
	},
	computed: {
		...mapGetters('reports/main', [
			'report_main_orders'
		])
	}
}
</script>


<style lang="stylus">
</style>
