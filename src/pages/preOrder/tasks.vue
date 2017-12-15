<template>
<div class="mainWrapper">
	<div class="oneTaskWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Завершение задачи №{{ currentTask.id }}</el-breadcrumb-item>
		</el-breadcrumb>

		<end-task-form v-loading="oneLoadingTask" />
	</div>

	<div class="manyTasksWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
		</el-breadcrumb>

		<tabless
			:data="data"
			:fieldDescription="tasksManyFieldDescription"
			:key="1" :buttons="afterTableTasksButtons"
			@onClick="goToPreorder"
			ref="table"
			@filter="localTaskFilterChange"
			@sortChange="localTaskSortChange"
		/>

		<infinite-loading @infinite="tasksInfinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="loadingBottomTasks" />
		</infinite-loading>

		<edit-task-form/>
	</div>
</div>
</template>


<script>
// счета


import fieldDescription from '@/static/fieldDescription'

let {
	tasksManyFieldDescription,
	adSources,
	taskTypes: addTaskTypes,
	clientContactsFieldDescription,
	clientTasksFieldDescription
} = fieldDescription

import {
	mapGetters,
	mapActions
} from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'
import InfiniteLoading from 'vue-infinite-loading'
import editTaskForm from '@/components/forms/editTask.vue'
import endTaskForm from '@/components/forms/endTask.vue'


export default {
	data() {
		return {
			tasksManyFieldDescription,
			adSources,
			clientContactsFieldDescription,
			clientTasksFieldDescription,
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading,
		editTaskForm,
		endTaskForm
	},
	watch: {
		oneId() {
			if (this.oneId !== undefined) {
				this.getOneTask(this.oneId)
			} else {
				//this.getAllTasks()
			}
		}
	},
	computed: {
		...mapGetters([
			'cachedTasks',
			'loadingTasks',
			'clientsByPhone',
			'currentTask',
			'loadingBottomTasks',
			'cachedSalons',
			'taskTypes',
			'fileUploadUrl',
			'loadingClientsByPhone',
			'oneLoadingTask'
		]),
		currentTaskCLientMainContact() {
			return this.currentTask.contactFaces ? this.currentTask.contactFaces.find(el => el.regard == "Основной") : {}
		},
		data() {
			return this.cachedTasks
		},
	},
	methods: {
		...mapActions([
			'getAllTasks',
			'searchClientsByPhone',
			'getOneTask',
			'tasksInfinity',
			'tasksFiltersChange',
			'tasksSortChanged'
		]),
		localTaskFilterChange(n) {
			this.tasksFiltersChange(n)

			this.$nextTick(() => {
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localTaskSortChange(n) {
			this.tasksSortChanged(n)

			this.$nextTick(() => {
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		if (this.oneId !== undefined) {
			this.getOneTask(this.oneId)
		} else {
			//this.getAllTasks()
		}
	}
}
</script>



<style lang="less" scoped>
.oneTaskWrapper {

}
</style>
