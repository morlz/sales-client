<template>
<div class="mainWrapper">
	<div class="oneTaskWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form class="cards">
			<el-card class="info">
				<h2 slot="header">Общая информация</h2>
			</el-card>
		</el-form>
	</div>

	<div class="manyTasksWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs tab-position="top">
			<el-tab-pane label="Все задачи">
				<tabless
					:data="data"
					:fieldDescription="tasksManyFieldDescription"
					:key="1"
					:buttons="afterTableTasksButtons"
					v-loading="loadingTasks"
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
			</el-tab-pane>

			<el-tab-pane label="Новая задача">
				<el-form label-width="100px" class="addForm">
					<el-card>
						<h2 slot="header">Новая задача</h2>

						<div>
							...
						</div>
					</el-card>
				</el-form>
			</el-tab-pane>
		</el-tabs>
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
import lightTable from '@/components/lightTable.vue'
import InfiniteLoading from 'vue-infinite-loading'
import editTaskForm from '@/components/forms/editTask.vue'


export default {
	data() {
		return {
			tasksManyFieldDescription,
			adSources,
			clientContactsFieldDescription,
			clientTasksFieldDescription,
			addTaskTypes,
			addForm: {
				source: "",
				butget: "",
				chance: 3,
				description: "",

				phone: "",
				disableSms: 0,
				fio: "",
				gender: "",
				clientDescription: "",
				email: "",
				disableEmail: 0,

				date: "",
				type: "",
				rasch: "",
				taskDescription: ""
			}
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading,
		lightTable,
		editTaskForm
	},
	watch: {
		oneId () {
			if (this.oneId !== undefined) {
				this.getOneTask(this.oneId)
			} else {
				this.getAllTasks()
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
			'loadingClientsByPhone'
		]),
		currentTaskCLientMainContact () {
			return this.currentTask.contactFaces ? this.currentTask.contactFaces.find(el => el.regard == "Основной") : {}
		},
		data() {
			return this.cachedTasks
		},
		isOne () {
			return this.$route.params.id !== undefined
		},
		oneId () {
			return this.$route.params.id
		},
		clientTasksFormated () {
			return this.currentTask.tasks ? this.currentTask.tasks.map(task => {
				task.type = this.taskTypes[task.type_id] ? this.taskTypes[task.type_id].title : '...'
				let salon = this.cachedSalons.find(el => task.salon_id == el.ID_SALONA)
				task.salon = salon ? salon.NAME : '...'
				return task
			}) : []
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
		onAddForm () {
			console.log(this.addForm);
		},
		localTaskFilterChange (n) {
			this.tasksFiltersChange (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localTaskSortChange (n) {
			this.tasksSortChanged (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		if (this.oneId !== undefined) {
			this.getOneTask(this.oneId)
		} else {
			this.getAllTasks()
		}
	}
}
</script>



<style lang="less" scoped>
.addForm {
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fit, minmax(500px, auto));
    h2 {
        margin-left: 20px;
    }
	padding-bottom: 10px;
}
.oneTaskWrapper {
	.cards {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: 550px 1fr;
		.tasks, .files {
			grid-column: ~"1 / 3";
		}

		.infoGrid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			> div {
				padding: 5px 0;
				&:not(:last-child) {
					border-bottom: 1px solid #f4f4f4;
				}
				&:nth-child(2n+1) {
					font-weight: bold;
				}
			}
		}
	}
}

@media screen and (max-width: 1200px) {
	.oneTaskWrapper {
		.cards {
			grid-template-columns: 1fr;
			.tasks, .files {
				grid-column: ~"1 / 2";
			}
		}
	}
}

</style>
