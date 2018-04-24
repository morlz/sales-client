<template>
<q-page class="AppContent" v-if="auth_can(1, 'Task')">
	<div class="oneTaskWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: `/preorder/tasks` }">Список задач</router-link></li>
			<li><router-link :to="{ path: `/preorder/tasks` }">{{ task_current.id ? `Завершение задачи № ${task_current.id}` : `Добавление новой задачи` }}</router-link></li>
		</ul>

		<end-task-form v-loading="task_loadingOne" v-if="auth_can(3, 'Task')" />
	</div>

	<div class="manyTasksWrapper" v-if="!isOne">
		<edit-task-form v-if="auth_can(3, 'Task')"/>

		<q-card class="manyTasksWrapper__card AppContent__inner">
			<!--<tabless
				key="tasks"
				:data="task_cached"
				:complete="task_complete"
				:field-description="tasksManyFieldDescription"
				:filters="task_filters"
				ref="table"
				@filter="local_task_filtersChange"
				@sort="local_task_sortChange"
				@click="routerGoId"
				@infinite="task_infinity"
			/>-->

			<infinite-table
				:columns="tasksManyFieldDescription"
				:rows="task_cached"
				:complete="task_complete"
				@infinite="task_infinity"
				@click="routerGoId"
				@sort="local_task_sortChange"
				@filter="local_task_filtersChange"
			/>
		</q-card>
	</div>
</q-page>
</template>


<script>
import fieldDescription from '@/static/fieldDescription'

let {
	tasksManyFieldDescription,
	adSources,
	clientContactsFieldDescription,
	clientTasksFieldDescription
} = fieldDescription

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
			tasksManyFieldDescription,
			adSources,
			clientContactsFieldDescription,
			clientTasksFieldDescription,
		}
	},
	watch: {
		oneId() {
			if (this.oneId !== undefined)
				this.task_getOne(this.oneId)
		}
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
			return this.task_current.contactFaces ? this.task_current.contactFaces.find(el => el.regard == "Основной") : {}
		},
	},
	methods: {
		...mapActions([
			'task_getOne',
			'task_infinity',
			'task_filtersChange',
			'task_sortChange',
			'task_init'
		]),
		...mapMutations([
			'task_destroy'
		]),
		async local_task_filtersChange(n) {
			await this.task_filtersChange(n)
		},
		async local_task_sortChange(n) {
			await this.task_sortChange(n)
		}
	},
	async created () {
		await this.task_init(this.oneId)
	},
	beforeDestroy () {
		this.task_destroy()
	}
}
</script>



<style lang="less">
.oneTaskWrapper {

}

.manyTasksWrapper {
	width: 100%;
	height: 100%;
	padding-top: 8px;

	&__card {
		margin-top: 0;
		height: ~"calc(100vh - 68px)";
	}
}
</style>
