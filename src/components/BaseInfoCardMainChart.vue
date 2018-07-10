<template>
	<q-card class="BaseInfoCardMainChart">
		<q-card-title>
			<slot name="title">
				{{ title }}
			</slot>
		</q-card-title>

		<q-card-main class="BaseInfoCardMainChart__main">
			<template v-if="chart">
				<slot :width="width" :height="height"/>
			</template>
		</q-card-main>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
	props: {
		title: String
	},
	data () {
		return {
			chart: false,
			width: 0,
			height: 0
		}
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
.BaseInfoCardMainChart
	min-height 350px
</style>
