<template>
<div/>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import moment from 'moment'

export default {
	methods: {
		...mapMutations('reports/salesTwo', [
			'reports_salesTwo_dateFromSet',
			'reports_salesTwo_dateToSet',
			'reports_salesTwo_salonSet'
		])
	},
	created () {
		this.reports_salesTwo_salonSet(this.$route.params.id)
		let isDay = this.$route.params.date.split('-').length > 2

		let date = this.$route.params.date ? moment(this.$route.params.date) : moment()
		date.add(1, 'day')

		this.reports_salesTwo_dateToSet(date.format('YYYY-MM-DD'))
		if (!isDay) date.subtract(1, 'day')

		this.reports_salesTwo_dateFromSet(date.subtract(1, isDay ? 'day' : 'month').format('YYYY-MM-DD'))

		this.$router.push({ path: '/reports/salesTwo', props: { salon: true }})
	}
}
</script>


<style lang="less">

</style>
