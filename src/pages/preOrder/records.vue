<template>
<div class="mainWrapper">
	<div class="oneRecordWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/records' }">Список предзаказов</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/preorder/records/${oneId}` }">Предзаказ №{{oneId}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form class="cards">
			<el-card class="info">
				<h2 slot="header">Общая информация</h2>

				<el-steps :active="+currentRecord.status_id" align-center finish-status="success">
					<el-step :title="item.title" v-for="item, index in recordStatuses" :key="index"></el-step>
				</el-steps>

				<div class="infoGrid">
					<div>Салон</div>
					<div>{{ currentRecord.salon ? currentRecord.salon.NAME : '...' }}</div>
					<div>Менеджер</div>
					<div>{{ currentRecord.manager ? currentRecord.manager.FIO : '...' }}</div>
					<div>Дата создания</div>
					<div>{{ currentRecord.created_at }}</div>
					<div>Клиент</div>
					<div>{{ currentRecordCLientMainContact.fio }}</div>
					<div>Адрес</div>
					<div>{{ currentRecordCLientMainContact.address }}</div>
					<div>Рекл. источник</div>
					<div>{{ currentRecord.adsource ? currentRecord.adsource.NAME : '...' }}</div>
					<div>Вероятность</div>
					<div><el-rate :value="+currentRecord.chance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled /></div>
					<div>Бюджет</div>
					<div>{{ currentRecord.budget }}</div>
					<div>Сумма предоплаты</div>
					<div>{{ currentRecord.prepay_summ }}</div>
					<div>Сумма расчёта</div>
					<div>{{ currentRecord.calc_summ }}</div>
					<div>Примечание</div>
					<div>{{ currentRecord.description }}</div>
				</div>
			</el-card>

			<el-card class="contacts">
				<h2 slot="header">Контакты</h2>

				<lightTable :data="currentRecord.contactFaces || [	]" :fieldDescription="clientContactsFieldDescription" />
				<div class="buttons">
					<el-button type="primary">Добавить контакт</el-button>
				</div>
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
					<el-button type="primary">Загрузить файл</el-button>
				</el-upload>
			</el-card>
		</el-form>
	</div>

	<div class="manyRecordsWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/records' }">Список предзаказов</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs tab-position="top">
			<el-tab-pane label="Все предзаказы">
				<tabless
					:data="data"
					:fieldDescription="recordsManyFieldDescription"
					:key="1"
					v-loading="loadingRecords"
					@onClick="routerGoId"
					ref="table"
					@filter="localRecordFilterChange"
					@sortChange="localRecordSortChange"
				/>
				<infinite-loading @infinite="recordsInfinity" ref="infiniteLoading">
					<div class="end" slot="no-results" />
					<div class="end" slot="no-more" />
					<div class="spinner" slot="spinner" v-loading="loadingBottomRecords" />
				</infinite-loading>

			</el-tab-pane>

			<el-tab-pane label="Новый предзаказ">
				<el-form label-width="100px" class="addForm">
					<el-card>
						<h2 slot="header">Новый предзаказ</h2>

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

					<el-card>
						<h2 slot="header">Данные о клиенте</h2>

						<el-form-item label="Телефон">
							<el-select
								v-model="addForm.phone"
								placeholder="8 (800) 555 35 35"
								:allow-create="!loadingClientsByPhone"
								remote
								filterable
								:remote-method="searchClientsByPhone"
								:loading="loadingClientsByPhone"
								:loading-text="'Загрузка...'"
								:no-data-text="'Клиентов не найдено'">
								<el-option v-for="client, index in clientsByPhone" :label="client.phone" :value="client.phone" :key="index" class="clientOption">
									<span style="float: left;">{{ client.name }}</span>
									<span style="float: right;">{{ client.phone }}</span>
								</el-option>
							</el-select>
							<el-checkbox v-model="addForm.disableSms">sms-рассылка запрещена</el-checkbox>
						</el-form-item>

						<el-form-item label="ФИО">
							<el-input v-model="addForm.fio" placeholder="ФИО" />
						</el-form-item>

						<el-form-item label="Пол">
							<el-switch v-model="addForm.gender" active-text="Мужской" inactive-text="Женский">
							</el-switch>
						</el-form-item>

						<el-form-item label="Приметы">
							<el-input type="textarea" v-model="addForm.clientDescription" placeholder="Описание пользователя" />
						</el-form-item>

						<el-form-item label="Эл почта">
							<el-input v-model="addForm.email" placeholder="some@email.com" />
							<el-checkbox v-model="addForm.disableEmail">Email-рассылка запрещена</el-checkbox>
						</el-form-item>
					</el-card>

					<el-card>
						<h2 slot="header">Следующая задача</h2>

						<el-form-item label="Дата">
							<el-date-picker v-model="addForm.date" type="date" placeholder="Дата выполнения" />
						</el-form-item>

						<el-form-item label="Тип">
							<el-select v-model="addForm.type" placeholder="Тип">
								<el-option v-for="item in addTaskTypes" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>

						<el-form-item label="Сумма расчёта">
							<el-input v-model="addForm.rasch" placeholder="Сумма расчёта" />
						</el-form-item>

						<el-form-item label="Приметы">
							<el-input type="textarea" v-model="addForm.taskDescription" placeholder="Приметы" />
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="onAddForm">Создать предзаказ</el-button>
							<el-button>Отмена</el-button>
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
	recordsManyFieldDescription,
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
			recordsManyFieldDescription,
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
				this.getOneRecord(this.oneId)
			} else {
				this.getAllRecords()
			}
		}
	},
	computed: {
		...mapGetters([
			'cachedRecords',
			'loadingRecords',
			'clientsByPhone',
			'currentRecord',
			'loadingBottomRecords',
			'cachedSalons',
			'taskTypes',
			'fileUploadUrl',
			'loadingClientsByPhone',
			'recordStatuses'
		]),
		currentRecordCLientMainContact () {
			return this.currentRecord.contactFaces ? this.currentRecord.contactFaces.find(el => el.regard == "Основной") : {}
		},
		data() {
			return this.cachedRecords
		},
		isOne () {
			return this.$route.params.id !== undefined
		},
		oneId () {
			return this.$route.params.id
		},
		clientTasksFormated () {
			return this.currentRecord.tasks ? this.currentRecord.tasks.map(task => {
				task.type = this.taskTypes[task.type_id] ? this.taskTypes[task.type_id].title : '...'
				let salon = this.cachedSalons.find(el => task.salon_id == el.ID_SALONA)
				task.salon = salon ? salon.NAME : '...'
				return task
			}) : []
		},
	},
	methods: {
		...mapActions([
			'getAllRecords',
			'searchClientsByPhone',
			'getOneRecord',
			'recordsInfinity',
			'recordsFiltersChange',
			'recordsSortChanged'
		]),
		onAddForm () {
			console.log(this.addForm);
		},
		localRecordFilterChange (n) {
			this.recordsFiltersChange (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localRecordSortChange (n) {
			this.recordsSortChanged (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		if (this.oneId !== undefined) {
			this.getOneRecord(this.oneId)
		} else {
			this.getAllRecords()
		}
	}
}
</script>



<style lang="less" scoped>
.addForm {
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fit, minmax(450px, auto));
    h2 {
        margin-left: 20px;
    }
	padding-bottom: 10px;
}
.oneRecordWrapper {
	.cards {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: 550px 1fr;
		.tasks, .files {
			grid-column: ~"1 / 3";
		}

		.info {
			.el-steps {
				margin-bottom: 10px;
			}
		}

		.contacts {
			.buttons {
				margin-top: 10px;
			}
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
	.oneRecordWrapper {
		.cards {
			grid-template-columns: 1fr;
			.tasks, .files {
				grid-column: ~"1 / 2";
			}
		}
	}
}

</style>
