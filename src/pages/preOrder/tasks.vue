<template>
<div class="mainWrapper" v-if="auth_can(1, 'Task')">
	<div class="oneTaskWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Завершение задачи №{{ task_current.id }}</el-breadcrumb-item>
		</el-breadcrumb>

		<end-task-form v-loading="task_loadingOne" v-if="auth_can(3, 'Task')" />
	</div>

	<div class="manyTasksWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
		</el-breadcrumb>

		<tabless
			:data="data"
			:fieldDescription="tasksManyFieldDescription"
			:key="1"
			:buttons="afterTableTasksButtons"
			@onClick="goToPreorder"
			ref="table"
			@filter="localTaskFilterChange"
			@sortChange="localTaskSortChange"
		/>

		<infinite-loading @infinite="task_infinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="task_loadingBottom" />
		</infinite-loading>

		<edit-task-form v-if="auth_can(3, 'Task')"/>
	</div>
</div>
</template>


<script>
// счета


import fieldDescription from '@/static/fieldDescription'

let {
	tasksManyFieldDescription,
	adSources,
	task_types: addTaskTypes,
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
			'task_loadingOne'
		]),
		task_currentCLientMainContact() {
			return this.task_current.contactFaces ? this.task_current.contactFaces.find(el => el.regard == "Основной") : {}
		},
		data() {
			return this.task_cached
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
		localTaskFilterChange(n) {
			this.task_filtersChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localTaskSortChange(n) {
			this.task_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		this.task_init(this.oneId)
	}
}
</script>



<style lang="less" scoped>
.oneTaskWrapper {

}
</style>
