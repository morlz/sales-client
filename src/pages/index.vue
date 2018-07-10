<template>
<q-page class="AppContent">
	<div class="AppContent__inner Index">
		<info-card-current-tasks-manager/>
		<info-card-current-tasks-salon/>
		<info-card-news class="Index__news"/>
		<info-card-main-chart-now/>
		<info-card-main-chart-preorders/>
		<info-card-main-chart-orders/>
		<info-card-main-chart-best-salons/>
	</div>
</q-page>
</template>

<script>

import InfoCardNews from '@/components/InfoCardNews'
import InfoCardCurrentTasksSalon from '@/components/InfoCardCurrentTasksSalon'
import InfoCardCurrentTasksManager from '@/components/InfoCardCurrentTasksManager'
import InfoCardMainChartPreorders from '@/components/InfoCardMainChartPreorders'
import InfoCardMainChartOrders from '@/components/InfoCardMainChartOrders'
import InfoCardMainChartNow from '@/components/InfoCardMainChartNow'
import InfoCardMainChartBestSalons from '@/components/InfoCardMainChartBestSalons'

export default {
	name: 'PageIndex',
	components: {
		InfoCardNews,
		InfoCardCurrentTasksSalon,
		InfoCardCurrentTasksManager,
		InfoCardMainChartPreorders,
		InfoCardMainChartOrders,
		InfoCardMainChartNow,
		InfoCardMainChartBestSalons
	}
}
</script>

<style lang="stylus">
.Index
	margin 0
	padding 10px
	display grid
	grid-gap 10px
	grid-template-columns repeat(2, minmax(400px, 1fr))

	&__news
		grid-row 1 / 3
		grid-column 2 / 3

@media screen and (min-width: 1600px)
	.Index
		grid-template-columns repeat(3, minmax(400px, 1fr))

		&__news
			grid-column 3 / 4

@media screen and (max-width: 800px)
	.Index
		grid-template-columns minmax(300px, 1fr)
		&__news
			grid-row 3 / 4
			grid-column 1 / 2
</style>
