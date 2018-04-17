<template>
<q-page class="AppContent">
	<q-tabs v-model="currentTab" class="AppContent__headerTabs">
		<q-route-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title" :to="tab.to"/>
	</q-tabs>

	<q-card class="AppContent__inner ReportsWrapper">
		<router-view/>
	</q-card>
</q-page>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QTabs, QRouteTab, QCard, QCardMain } from 'quasar'

export default {
	components: {
		QTabs,
		QRouteTab,
		QCard
	},
	data() {
		return {
			currentTab: "all",
			tabs: [
				{ name: "Все салоны", 				type: "all", 		to: '/reports/resume' },
				{ name: "Продажи за всё время",		type: "byMonth",  	to: '/reports/resume/month'},
			],
		}
	},
	watch: {

	},
	computed: {

	},
	methods: {
		...mapMutations([
			'app_layout_headerShadowSet'
		])
	},
	mounted () {
		this.app_layout_headerShadowSet(false)
	},
	beforeDestroy() {
		this.app_layout_headerShadowSet(true)
	}
}
</script>


<style lang="stylus">
.ReportsWrapper
	height calc(100vh - 120px)
</style>
