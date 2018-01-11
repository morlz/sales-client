<template>
	<el-card class="preorders" v-if="auth_can(1, 'Preorder')">
		<div slot="header">
			<h2>Предзаказы</h2>
		</div>
		<el-tabs>
			<el-tab-pane label="Предстоящие">
				<tabless :data="data" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/preorders')" :minify="true" />
			</el-tab-pane>

			<el-tab-pane label="Выполеные">
				<tabless :data="data" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/preorders')" :minify="true" />
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import editTaskForm from '@/components/forms/editTask.vue'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'

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
		editTaskForm,
		tabless
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
			'cachedSalons',
			'cachedManagers',
			'preorder_statuses'
		]),
		data () {
			return this.content ? this.content.map(preorder => {
				preorder.status = this.preorder_statuses[preorder.status_id] ? this.preorder_statuses[preorder.status_id].title : '...'
				let manager = this.cachedManagers.find(el => preorder.manager_id == el.ID_M),
					salon = this.cachedSalons.find(el => preorder.salon_id == el.ID_SALONA)
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
