<template>
<div class="mainWrapper">
	<div class="oneTaskWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Завершение задачи №{{ currentTask.id }}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form class="cards" v-loading="oneLoadingTask">
			<el-card class="prev">
				<h2 slot="header">Предыдущая задача</h2>

				<el-form label-width="130px">
					<el-form-item label="Срок">
						<el-date-picker type="date" v-model="currentTask.date" :editable="false" />
					</el-form-item>

					<el-form-item label="Тип">
						{{ currentTask.type ? currentTask.type.title : '...' }}
					</el-form-item>

					<el-form-item label="Сумма расчёта">
						{{ currentTask.summ }}
					</el-form-item>

					<el-form-item label="Описание задачи">
						{{ currentTask.description }}
					</el-form-item>

					<el-form-item label="Результат">
						<el-input type="textarea" v-model="form.result" />
					</el-form-item>
				</el-form>
			</el-card>

			<el-card class="next">
				<h2 slot="header">Следующая задача</h2>

				<el-form label-width="130px">
					<el-form-item label="Тип">
						<el-select v-model="form.type">
							<el-option v-for="item, index in addTaskTypes" :value="item.value" :label="item.label" :key="index" />
						</el-select>
					</el-form-item>

					<div class="nextFormTransitionWrapper">
						<div v-show="form.type == 1" key="1" class="nextFormTransition">
							<el-form-item label="Дата">
								<el-date-picker type="date" v-model="form.contact.date" placeholder="Дата выполнения задачи" />
							</el-form-item>

							<el-form-item label="Сумма расчёта">
								<el-input v-model="form.contact.summ" placeholder="Сумма расчёта" />
							</el-form-item>

							<el-form-item label="Описание задачи">
								<el-input type="textarea" v-model="form.contact.description" placeholder="Описание задачи" />
							</el-form-item>

							<el-form-item>
								<div class="buttons">
									<el-button type="primary">Создать</el-button>
									<el-button @click="goToPreorder(currentTask.preorder_id)">Вернуться к предзаказу</el-button>
								</div>
							</el-form-item>
						</div>

						<div v-show="form.type == 2" key="2" class="nextFormTransition">
							<el-form-item>
								...
							</el-form-item>

							<el-form-item>
								<div class="buttons">
									<el-button type="primary">Создать</el-button>
									<el-button @click="goToPreorder(currentTask.preorder_id)">Вернуться к предзаказу</el-button>
								</div>
							</el-form-item>
						</div>

						<div v-show="form.type == 3" key="3" class="nextFormTransition">
							<el-form-item label="Описание">
								<el-input type="textarea" v-model="form.otkaz.description" placeholder="Описание" />
							</el-form-item>

							<el-form-item>
								<div class="buttons">
									<el-button type="primary">Создать</el-button>
									<el-button @click="goToPreorder(currentTask.preorder_id)">Вернуться к предзаказу</el-button>
								</div>
							</el-form-item>
						</div>

						<div v-show="form.type == 4" key="4" class="nextFormTransition">
							<el-form-item label="Дата">
								<el-date-picker type="date" v-model="form.reminder.date" placeholder="Дата напоминания" />
							</el-form-item>

							<el-form-item label="Описание">
								<el-input type="textarea" v-model="form.reminder.description" placeholder="Описание" />
							</el-form-item>

							<el-form-item>
								<div class="buttons">
									<el-button type="primary">Создать</el-button>
									<el-button @click="goToPreorder(currentTask.preorder_id)">Вернуться к предзаказу</el-button>
								</div>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</el-card>
		</el-form>
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
			form: {
				result: "",
				type: "1",
				contact: {
					description: "",
					summ: "",
					date: ""
				},
				zamer: {
					date: "",
					region: "",
					address: "",
					comment: "",
					difficly: ""
				},
				otkaz: {
					description: ""
				},
				reminder: {
					date: "",
					descrption: ""
				}
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
			'loadingClientsByPhone',
			'oneLoadingTask'
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
		grid-template-columns: 1fr 1fr;
		.nextFormTransitionWrapper {
			.buttons {
				display: grid;
				grid-auto-flow: column;
				justify-content: flex-start;
			}
		}
	}
}

@media screen and (max-width: 1200px) {
	.oneTaskWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}

</style>
