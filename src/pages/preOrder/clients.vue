<template>
	<div class="mainWrapper">
		<div class="oneClientWrapper" v-if="isOne" v-loading="oneLoadingClient">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/clients' }">Список клиентов</el-breadcrumb-item>
				<el-breadcrumb-item>{{ currentClientMainContact.fio }}</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="cards">

				<el-card class="info">
					<div slot="header">
						<h2>Информация о клиенте</h2>
					</div>

					<div class="infoGrid">
						<div>ФИО</div>
						<div>{{ currentClientMainContact.fio }}</div>
						<div>Пол</div>
						<div>{{ currentClientMainContact.gender }}</div>
						<div>Приметы</div>
						<div>{{ currentClient.signs }}</div>
						<div>Менеджер</div>
						<div>{{ currentClient.manager ? currentClient.manager.FIO : '' }}</div>
						<div>Неактивен</div>
						<div>{{ currentClient.notactive }}</div>
					</div>
				</el-card>

				<el-card class="contacts">
					<div slot="header">
						<h2>Контакты</h2>
					</div>

					<lightTable :data="clientContactsFormated" :fieldDescription="clientContactsFieldDescription" :buttons="afterTableContactButtons" />
					<div class="buttons">
						<el-button type="primary" @click="updateAddClientContactFormVisible(true)">Добавить контакт</el-button>
						<add-contact-form/>
						<edit-contact-form/>
					</div>
				</el-card>

				<el-card class="tasks">
					<div slot="header">
						<h2>Задачи</h2>
					</div>

					<lightTable :data="clientTasksFormated" :fieldDescription="clientTasksFieldDescription" @onClick="goToPreorder" :buttons="afterTableTasksButtons" />
					<edit-task-form/>
				</el-card>

				<el-card class="preorders">
					<div slot="header">
						<h2>Предзаказы</h2>
					</div>
					<el-tabs>
						<el-tab-pane label="Предстоящие">
							<lightTable :data="clienPreordersFormated" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/records')" />
						</el-tab-pane>

						<el-tab-pane label="Выполеные">
							<lightTable :data="clienPreordersFormated" :fieldDescription="clientPreordersFieldDescription" :onClick="routerGoIdPath('/preorder/records')" />
						</el-tab-pane>
					</el-tabs>
				</el-card>

				<el-card class="orders">
					<div slot="header">
						<h2>Заказы</h2>
					</div>
				</el-card>
			</div>
		</div>

		<div class="manyClientsWrapper" v-else="!isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/clients' }">Список клиентов</el-breadcrumb-item>
			</el-breadcrumb>
			<el-input v-model="searchByPhone" placeholder="Поиск по номеру телефона" class="searchByPhone" />
			<tabless
				:data="data"
				:fieldDescription="clientManyFieldDescription"
				:key="1"
				v-loading="loadingClients"
				@onClick="routerGoId"
				ref="table"
				@filter="localClientFilterChange"
				@sortChange="localClientSortChange"
			/>
			<infinite-loading @infinite="clientsInfinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="loadingBottomClients" />
			</infinite-loading>
		</div>
	</div>
</template>



<script>
//import  from '@/static/fieldDescription'

import fieldDescription from '@/static/fieldDescription'

let {
	clientManyFieldDescription,
	clientContactsFieldDescription,
	clientTasksFieldDescription,
	clientPreordersFieldDescription
} = fieldDescription

import { mapGetters, mapActions, mapMutations } from 'vuex'
import tabless from '@/components/tableSS.vue'
import lightTable from '@/components/lightTable.vue'
import addContactForm from '@/components/forms/addContact.vue'
import editContactForm from '@/components/forms/editContact.vue'
import editTaskForm from '@/components/forms/editTask.vue'
import mixins from '@/components/mixins'
import InfiniteLoading from 'vue-infinite-loading'

export default {
	data () {
		return {
			clientManyFieldDescription,
			clientContactsFieldDescription,
			clientTasksFieldDescription,
			clientPreordersFieldDescription,
			searchByPhone: "",
			seachTimeout: false
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		lightTable,
		InfiniteLoading,
		addContactForm,
		editContactForm,
		editTaskForm
	},
	watch: {
		oneId () {
			if (this.oneId !== undefined) {
				this.getOneClient(this.oneId)
			} else {
				this.getAllClients()
			}
		},
		searchByPhone(n){
			if (this.seachTimeout) clearTimeout (this.seachTimeout)

			this.seachTimeout = setTimeout(() => {
				this.updateSearchByPhoneQuery(n)
				this.clientsCacheClear()

				this.$nextTick(() => {
				  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				})
			}, 500)
		}
	},
	computed: {
		...mapGetters([
			'cachedClients',
			'cachedManagers',
			'cachedSalons',
			'loadingClients',
			'oneLoadingClient',
			'currentClient',
			'taskTypes',
			'recordStatuses',
			'loadingBottomClients'
		]),
		data () {
			return this.cachedClients
		},
		currentClientMainContact () {
			if (!this.currentClient || ! this.currentClient.contactfaces) return {}
			return this.currentClient.contactfaces.find(el => el.regard == "Основной")
		},
		clientContactsFormated () {
			return this.currentClient.contactfaces || []
		},
		clientTasksFormated () {
			return this.currentClient.tasks ? this.currentClient.tasks.map(task => {
				task.type = this.taskTypes[task.type_id] ? this.taskTypes[task.type_id].title : '...'
				let salon = this.cachedSalons.find(el => task.salon_id == el.ID_SALONA)
				task.salon =  salon ? salon.NAME : '...'
				return task
			}) : []
		},
		clienPreordersFormated () {
			return this.currentClient.preorders ? this.currentClient.preorders.map(preorder => {
				preorder.status = this.recordStatuses[preorder.status_id] ? this.recordStatuses[preorder.status_id].title : '...'
				let manager = this.cachedManagers.find(el => preorder.manager_id == el.ID_M),
					salon = this.cachedSalons.find(el => preorder.salon_id == el.ID_SALONA)
				preorder.manager = manager ? manager.FIO : '...'
				preorder.salon =  salon ? salon.NAME : '...'
				return preorder
			}) : []
		},
		isOne(){
			return this.$route.params.id !== undefined
		},
		oneId () {
			return this.$route.params.id
		}
	},
	methods: {
		...mapActions([
			'getAllClients',
			'getOneClient',
			'clientsInfinity',
			'clientsSortChanged',
			'clientsFiltersChange',
			'clientsCacheClear'
		]),
		...mapMutations([
			'updateSearchByPhoneQuery',
			'updateAddClientContactFormVisible'
		]),
		localClientFilterChange (n) {
			this.clientsFiltersChange (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localClientSortChange (n) {
			this.clientsSortChanged (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted(){
		if (this.oneId !== undefined) {
			console.log(this.oneId);
			this.getOneClient(this.oneId)
		} else {
			//this.getAllClients()
		}
	}
}

</script>



<style lang="less">
.mainWrapper {
	.manyClientsWrapper {
		.searchByPhone {
			width: 300px;
			margin: 5px;
		}
	}
	.oneClientWrapper {
		.cards {
			display: grid;
			grid-template-columns: 550px 1fr;
			grid-gap: 20px;
			.tasks,
			.preorders {
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

			.tasks {

			}

			h2 {
				margin: 0;
				font-size: 18px;
				font-weight: bold;
			}
		}

		.info {
			.infoTable {
				width: 500px;
			}
		}
	}

	@media screen and (max-width: 1250px) {
		.oneClientWrapper {
			.cards {
				grid-template-columns: 1fr;
				.tasks, .preorders {
					grid-column: ~"1 / 2";
				}
			}
		}
	}

	@media screen and (max-width: 768px) {

	}

}
</style>
