<template>
	<q-card class="preorders" v-if="auth_can(1, 'Preorder')">
		<q-card-title>
			Предзаказы
		</q-card-title>

		<q-card-main>
			<q-tabs inverted>
				<q-tab slot="title" label="Предстоящие" name="next" default/>
				<q-tab slot="title" label="Выполеные" name="end"/>

				<q-tab-pane name="next">
					<tabless :data="data" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/preorders')" :minify="true" />
				</q-tab-pane>

				<q-tab-pane name="end">
					<tabless :data="data" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/preorders')" :minify="true" />
				</q-tab-pane>
			</q-tabs>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import mixins from '@/mixins'
import tabless from '@/components/tableSS'

import { QTabs, QTab, QTabPane } from 'quasar'

let {
	clientPreordersFieldDescription
} = fieldDescription

export default {
	props: {
		content: {
			required: true
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		QTabs,
		QTab,
		QTabPane
	},
	data () {
		return {
			clientPreordersFieldDescription
		}
	},
	watch: {

	},
	methods: {
		...mapMutations([])
	},
	computed: {
		...mapGetters([
			'salon_list',
			'cachedManagers',
			'preorder_statuses'
		]),
		data () {
			return this.content ? this.content.map(preorder => {
				preorder.status = this.preorder_statuses[preorder.status_id] ? this.preorder_statuses[preorder.status_id].title : '...'
				let manager = this.cachedManagers.find(el => preorder.manager_id == el.ID_M),
					salon = this.salon_list.find(el => preorder.salon_id == el.ID_SALONA)
				preorder.manager = manager ? manager.FIO : '...'
				preorder.salon =  salon ? salon.NAME : '...'
				return preorder
			}) : []
		},
	}
}
</script>


<style lang="less">

</style>
