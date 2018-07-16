<template>
<q-page class="AppContent Tasks" v-if="auth_can(1, 'Task')">
	<div class="OneTaskWrapper" v-if="isOne">
		<end-task-form v-loading="task_loadingOne" v-if="auth_can(3, 'Task')" />
	</div>

	<div class="manyTasksWrapper " v-if="!isOne">
		<edit-task-form v-if="auth_can(3, 'Task')"/>

		<div class="AppContent__tabs">
			<q-tabs v-model="currentTab">
				<q-tab v-for="tab, index in tabs" :name="tab.type" slot="title" :label="tab.name" :key="index"/>
			</q-tabs>
		</div>

		<q-card class="manyTasksWrapper__card AppContent__inner">
			<infinite-table
				:columns="CRMTasks"
				:rows="task_cached"
				:complete="task_complete"
				:filter-values="task_filters"
				:row-style="rowStyle"
				@infinite="task_infinity"
				@click="clickHandler"
				@sort="local_task_sortChange"
				@filter="local_task_filtersChange"
			>
				<template slot="buttons" slot-scope="{ row }" v-if="row.expired">
					<q-icon name="error_outline"/>
				</template>
			</infinite-table>
		</q-card>
	</div>
</q-page>
</template>


<script>
import { CRMTasks } from '@/static/fieldDescription'

import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import { AuthMixin, RouteMixin } from '@/mixins'
import InfiniteTable from '@/components/InfiniteTable'
import editTaskForm from '@/components/forms/editTask'
import endTaskForm from '@/components/forms/endTask'

export default {
	components: {
		InfiniteTable,
		editTaskForm,
		endTaskForm
	},
	mixins: [AuthMixin, RouteMixin],
	data() {
		return {
			CRMTasks,
			currentTab: '',
			tabs: [
				{ name: "Мои задачи", type: '' },
				{ name: "В работе", type: 'inWork' },
				{ name: "Завершённые", type: 'end' },
			],
			lastTasksFilters: {}
		}
	},
	watch: {
		oneId() {
			if (this.oneId !== undefined)
				this.task_getOne(this.oneId)
		},
		async additionalFilters (n) {
			await this.task_filtersChange (Object.assign({}, this.lastTasksFilters, n))
		},
	},
	computed: {
		...mapGetters([
			'task_cached',
			'task_current',
			'task_types',
			'task_loading',
			'task_loadingBottom',
			'task_loadingOne',
			'task_filters',
			'task_complete'
		]),
		task_currentCLientMainContact() {
			return this.task_current.contactFaces ?
				this.task_current.contactFaces.find(el => el.regard == "Основной")
			:	{}
		},
		additionalFilters () {
			return { type: this.currentTab }
		}
	},
	methods: {
		...mapActions([
			'task_getOne',
			'task_infinity',
			'task_filtersChange',
			'task_sortChange',
			'task_init',
			'task_destroy'
		]),
		...mapMutations([
			'app_layout_headerShadowSet'
		]),
		async local_task_filtersChange (n) {
			this.lastTasksFilters = n
			await this.task_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_task_sortChange(n) {
			await this.task_sortChange(n)
		},
		clickHandler (e, row) {
			this.routerGoIdPath('/preorder/preorders')(e, row.preorder_id)
		},
		rowStyle (props) {
			return {
				opacity: props.item.next ? '0.5' : '1'
			}
		}
	},
	async created () {
		await this.task_init(this.oneId)
	},
	mounted () {
		this.app_layout_headerShadowSet(!!this.oneId)
		this.lastTasksFilters = this.task_filters
	},
	beforeDestroy () {
		this.app_layout_headerShadowSet(true)
		this.task_destroy()
	}
}
</script>



<style lang="stylus">
.OneTaskWrapper
	padding 10px


.manyTasksWrapper
	width 100%
	height 100%

	&__card
		height calc(100vh - 120px)
</style>
