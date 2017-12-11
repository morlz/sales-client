<template>
<div class="mainWrapper">
	<div class="oneTaskWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/preorder/tasks/${oneId}` }">Задача №{{oneId}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form class="cards">
			<el-card class="info">
				<h2 slot="header">Общая информация</h2>

				<div class="infoGrid">
					<div>Салон</div>
					<div>{{ currentTask.salon ? currentTask.salon.NAME : '...' }}</div>
					<div>Менеджер</div>
					<div>{{ currentTask.manager ? currentTask.manager.FIO : '...' }}</div>
					<div>Дата создания</div>
					<div>{{ currentTask.created_at }}</div>
					<div>Клиент</div>
					<div>{{ currentTaskCLientMainContact.fio }}</div>
					<div>Адрес</div>
					<div>{{ currentTaskCLientMainContact.address }}</div>
					<div>Рекл. источник</div>
					<div>{{ currentTask.adsource ? currentTask.adsource.NAME : '...' }}</div>
					<div>Вероятность</div>
					<div><el-rate :value="+currentTask.chance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled /></div>
					<div>Бюджет</div>
					<div>{{ currentTask.budget }}</div>
					<div>Сумма предоплаты</div>
					<div>{{ currentTask.prepay_summ }}</div>
					<div>Сумма расчёта</div>
					<div>{{ currentTask.calc_summ }}</div>
					<div>Примечание</div>
					<div>{{ currentTask.description }}</div>
				</div>
			</el-card>

			<el-card class="contacts">
				<h2 slot="header">Контакты</h2>

				<lightTable :data="currentTask.contactFaces || [	]" :fieldDescription="clientContactsFieldDescription" />
			</el-card>

			<el-card class="tasks">
				<h2 slot="header">Задачи</h2>

				<lightTable :data="clientTasksFormated" :fieldDescription="clientTasksFieldDescription" :onClick="routerGoIdPath('/preorder/tasks')" />
			</el-card>

			<el-card class="files">
				<h2 slot="header">Прикреплённые файлы</h2>

				<el-upload
					action="fileUploadUrl"
				>
					<el-button size="small" type="primary">Загрузить файл</el-button>
				</el-upload>
			</el-card>
		</el-form>
	</div>

	<div class="manyTasksWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs tab-position="top">
			<el-tab-pane label="Все задачаы">
				<tabless
					:data="data"
					:fieldDescription="tasksManyFieldDescription"
					:key="1"
					v-loading="loadingTasks"
					@onClick="routerGoId"
					ref="table"
					@filter="localTaskFilterChange"
					@sortChange="localTaskSortChange"
				/>
				<infinite-loading @infinite="tasksInfinity" ref="infiniteLoading">
					<div class="end" slot="no-results" />
					<div class="end" slot="no-more" />
					<div class="spinner" slot="spinner" v-loading="loadingBottomTasks" />
				</infinite-loading>

			</el-tab-pane>

			<el-tab-pane label="Новый задача">
				<el-form label-width="100px" class="addForm">
					<el-card>
						<h2 slot="header">Новый задача</h2>

						<el-form-item label="Источник">
							<el-select v-model="addForm.source" placeholder="Выбирите рекламный источник">
								<el-option v-for="item in adSources" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>

						<el-form-item label="Бюджет">
							<el-input v-model="addForm.butget" placeholder="Бюджет" />
						</el-form-item>

						<el-form-item label="Веростность">
							<el-rate v-model="addForm.chance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
						</el-form-item>

						<el-form-item label="Примечание">
							<el-input type="textarea" v-model="addForm.description" placeholder="Примечание" />
						</el-form-item>
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
		lightTable
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
