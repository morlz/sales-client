<template>
	<div class="mainWrapper" v-if="auth_can(1, 'Client')">
		<div class="oneClientWrapper" v-if="isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/clients' }">Список клиентов</el-breadcrumb-item>
				<el-breadcrumb-item>{{ client_currentFIO }}</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="cards" v-loading="client_loadingOne">
				<client-info :content="client_current" v-if="auth_can(1, 'Client')"/>
				<contact-faces :content="client_current.contactfaces" v-if="auth_can(1, 'ContactFace')"/>
				<tasks :content="client_current.tasks" v-if="auth_can(1, 'Task')"/>
				<preorders :content="client_current.preorders" v-if="auth_can(1, 'Preorder')"/>

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
				v-loading="client_loading"
				key="clientsinf"
				ref="table"
				:data="client_cached"
				:fieldDescription="clientManyFieldDescription"
				:filters="client_filters"
				@onClick="routerGoId"
				@filter="localClientFilterChange"
				@sortChange="localClientSortChange"
			/>
			<infinite-loading @infinite="client_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="client_loadingBottom" />
			</infinite-loading>
		</div>
	</div>
</template>



<script>
import fieldDescription from '@/static/fieldDescription'

let {
	clientManyFieldDescription,
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
			lastClientsFilters: [],
			searchByPhone: "",
			searchByPhone2: "",
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
			if (this.oneId !== undefined)
				this.client_getOne(this.oneId)
		},
		searchByPhone(n){
			if (this.seachTimeout) clearTimeout (this.seachTimeout)
			this.seachTimeout = setTimeout(() => this.searchByPhone2 = n, 500)
		},
		additionalFIlters (n) {
			this.client_filtersChange (Object.assign({}, this.lastClientsFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	computed: {
		...mapGetters([
			'client_cached',
			'client_current',
			'client_currentFIO',
			'client_loading',
			'client_loadingOne',
			'client_loadingBottom',
			'client_filters',
			'client_filtersPhone',
		]),
		additionalFIlters () {
			return Object.assign({}, {
				'contacts.phone': this.searchByPhone2
			})
		}
	},
	methods: {
		...mapActions([
			'client_init',
			'client_getOne',
			'client_infinity',
			'client_sortChange',
			'client_filtersChange',
		]),
		localClientFilterChange (n) {
			this.lastClientsFilters = n
			this.client_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localClientSortChange (n) {
			this.client_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted(){
		this.client_init(this.oneId)
		this.searchByPhone = this.client_filtersPhone
	}
}

</script>



<style lang="less">
.mainWrapper {
	.manyClientsWrapper {
		display: grid;
		grid-template: "bc search";
		> * {
			grid-column: ~"1 / 3";
		}
		.bc {
			grid-area: bc;
		}
		.searchByPhone {
			grid-area: search;
			justify-self: end;
			width: 300px;
			margin: 5px;
		}
	}
	.oneClientWrapper {
		.cards {
			display: grid;
			grid-template-columns: 1fr 1fr;
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
}
</style>
