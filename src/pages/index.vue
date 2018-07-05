<template>
<q-page class="AppContent">
	<div class="AppContent__inner Index">
		<info-card-news/>
	</div>
</q-page>
</template>

<script>

import InfoCardNews from '@/components/InfoCardNews'

export default {
	name: 'PageIndex',
	components: {
		InfoCardNews
	}
}
</script>

<style lang="stylus">
.Index
	margin 0
	padding 10px
</style>
