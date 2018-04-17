<template>
<div class="ReportsResumeAllChart">
	<reports-resume-all-chart v-if="chart" :chart-data="reports_resume_allChart_cache" :options="options" class='ReportsResumeAllChart__chart' :width="width" :height="height"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'

import ReportsResumeAllChart from '@/components/ReportsResumeAllChart'

export default {
	components: {
		ReportsResumeAllChart
	},
	props: {

	},
	data() {
		return {
			chart: false,
			width: 0,
			height: 0,
			options: {
				title: {
					display: true,
					text: `Продажи по месяцам за всё время, сравнение по годам (тыс. рублей)`
				}
			}
		}
	},
	watch: {
		reports_resume_allChart_cache (n) {
			console.log(n);
		}
	},
	computed: {
		...mapGetters('reports/resume/allChart', [
			'reports_resume_allChart_cache'
		]),
	},
	methods: {
		...mapActions('reports/resume/allChart', [
			'reports_resume_allChart_init'
		])
	},
	mounted () {
		this.width = this.$el.offsetWidth
		this.height = this.$el.offsetHeight
		this.chart = true
	},
	created () {
		this.reports_resume_allChart_init()
	}
}
</script>


<style lang="stylus">
.ReportsResumeAllChart
	&__chart
		height calc(100vh - 120px)
		canvas
			max-height 100%
</style>
