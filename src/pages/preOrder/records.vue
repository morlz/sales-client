<template>
<div class="mainWrapper">
	<div class="oneRecordWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/records' }">Список предзаказов</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/preorder/records/${oneId}` }">Заказ №{{oneId}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form>
			<el-card>
				<h2 slot="header">Общая информация</h2>

				<el-card>
					{{ currentRecord }}
				</el-card>
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
				<tabless :data="data" :fieldDescription="recordsManyFieldDescription" :key="1" v-loading="loadingRecords" @onClick="routerGoId" />
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
							<el-input-number v-model="addForm.butget" placeholder="Бюджет" :min="0" :step="2500" />
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
								<el-option v-for="item in taskTypes" :key="item.value" :label="item.label" :value="item.value" />
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
	taskTypes
} = fieldDescription

import {
	mapGetters,
	mapActions
} from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'

export default {
	data() {
		return {
			recordsManyFieldDescription,
			adSources,
			taskTypes,
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
		tabless
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
			'cachedRecordsFormated',
			'loadingRecords',
			'clientsByPhone',
			'loadingClientsByPhone',
			'currentRecord'
		]),
		data() {
			return this.cachedRecordsFormated
		},
		isOne () {
			return this.$route.params.id !== undefined
		},
		oneId () {
			return this.$route.params.id
		}
	},
	methods: {
		...mapActions([
			'getAllRecords',
			'searchClientsByPhone',
			'getOneRecord'
		]),
		onAddForm () {
			console.log(this.addForm);
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
	grid-template-columns: repeat(auto-fit, minmax(500px, auto));
    h2 {
        margin-left: 20px;
    }
	padding-bottom: 10px;
}
</style>
