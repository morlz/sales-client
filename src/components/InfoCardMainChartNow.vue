<template>
	<base-info-card-main-chart title="Сегодня" class="InfoCardMainChartNow">
		<chart-bar
			slot-scope="{ width, height }"
			:chart-data="report_main_now"
			:options="options"
			class='InfoCardMainChartNow__chart'
			:width="width"
			:height="height"/>
	</base-info-card-main-chart>
</template>

<script>

import BaseInfoCardMainChart from '@/components/BaseInfoCardMainChart'

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'
import ChartBar from '@/components/ChartBar'

export default {
	components: {
		BaseInfoCardMainChart,
		ChartBar
	},
	mixins: [AuthMixin],
	data () {
		return {
			options: {}
		}
	},
	computed: {
		...mapGetters('reports/main', [
			'report_main_now'
		])
	}
}
</script>


<style lang="stylus">

</style>
