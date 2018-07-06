<template>
<q-page class="AppContent">
	<div class="AppContent__inner Index">
		<info-card-current-tasks/>
		<info-card-news class="Index__news"/>
	</div>
</q-page>
</template>

<script>

import InfoCardNews from '@/components/InfoCardNews'
import InfoCardCurrentTasks from '@/components/InfoCardCurrentTasks'

export default {
	name: 'PageIndex',
	components: {
		InfoCardNews,
		InfoCardCurrentTasks
	}
}
</script>

<style lang="stylus">
.Index
	margin 0
	padding 10px
	display grid
	grid-gap 10px
	grid-template-columns minmax(400px, 1fr) minmax(400px, 1fr)

	&__news
		grid-column 1 / 3
</style>
