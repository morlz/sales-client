<template>
<div class="AppContent">
	<q-tabs v-model="currentTab" class="AppContent__headerTabs">
		<q-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title"/>
	</q-tabs>

	<q-card>
		<div :is="tabs.find(el => el.type == currentTab).component"/>
	</q-card>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QTabs, QTab, QCard, QCardMain } from 'quasar'

export default {
	components: {
		QTabs,
		QTab,
		QCard
	},
	data() {
		return {
			currentTab: "all/30",
			tabs: [
				{ name: "10 лучших салонов за 7 дней", 		type: "10/7", 		component: { render: h => h('div') } },
				{ name: "10 лучших салонов за 30 дней", 	type: "10/30", 		component: { render: h => h('div') } },
				{ name: "Все продажи за 7 дней", 			type: "all/7", 		component: { render: h => h('div') } },
				{ name: "Все продажи за 30 дней", 			type: "all/30", 	component: { render: h => h('div') } },
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


<style lang="less">

</style>
