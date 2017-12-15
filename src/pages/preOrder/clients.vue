<template>
	<div class="mainWrapper">
		<div class="oneClientWrapper" v-if="isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/clients' }">Список клиентов</el-breadcrumb-item>
				<el-breadcrumb-item>{{ currentClient.lastname }} {{ currentClient.name }} {{ currentClient.patronymic }}</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="cards" v-loading="oneLoadingClient">
				<client-info :content="currentClient"/>
				<contact-faces :content="currentClient.contactfaces"/>
				<tasks :content="currentClient.tasks"/>
				<preorders :content="currentClient.preorders"/>

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
				key="clients"
				:data="data"
				:fieldDescription="clientManyFieldDescription"
				:key="1"
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

import clientInfo from '@/components/preorder/clientInfo.vue'
import contactFaces from '@/components/preorder/contactFaces.vue'
import tasks from '@/components/preorder/tasks.vue'
import preorders from '@/components/preorder/preorders.vue'


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
		clientInfo,
		contactFaces,
		tasks,
		preorders
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
			'recordStatuses',
			'loadingBottomClients'
		]),
		data () {
			return this.cachedClients
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

			h2 {
				margin: 0;
				font-size: 18px;
				font-weight: bold;
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
