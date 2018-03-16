<template>
	<div class="AppContent" v-if="auth_can(1, 'Client')">
		<div class="oneClientWrapper" v-if="isOne">
			<ul class="breadcrumb">
				<li><router-link :to="{ path: '/' }">Главная</router-link></li>
				<li><router-link :to="{ path: `/preorder/clients` }">Список клиентов</router-link></li>
				<li><router-link :to="{ path: `/preorder/clients/${client_current.id}` }">{{ client_currentFIO }}</router-link></li>
			</ul>


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

		<div class="manyClientsWrapper" v-if="!isOne">
			<div
				class="manyClientsWrapper__horGroup AppContent__headerTabs"
				:class="{ 'manyClientsWrapper__horGroup-mobile': app_view_mobile }">

				<q-field class="manyClientsWrapper__phone">
					<q-input
						v-model="searchByPhone"
						placeholder="Поиск по номеру телефона"
						class="searchByPhone"
						inverted/>
				</q-field>
			</div>

			<q-card class="manyClientsWrapper__card">
				<tabless
					key="clientsinf"
					:data="client_cached"
					:complete="client_complete"
					:field-description="clientManyFieldDescription"
					:filters="client_filters"
					ref="table"
					@filter="local_client_filtersChange"
					@sort="local_client_sortChange"
					@click="routerGoId"
					@infinite="client_infinity"
				/>
			</q-card>
		</div>
	</div>
</template>



<script>
import fieldDescription from '@/static/fieldDescription'

let {
	clientManyFieldDescription,
} = fieldDescription

import { mapGetters, mapActions, mapMutations } from 'vuex'
import tabless from '@/components/tableSSNew.vue'
import lightTable from '@/components/lightTable.vue'

import clientInfo from '@/components/preorder/clientInfo.vue'
import contactFaces from '@/components/preorder/contactFaces.vue'
import tasks from '@/components/preorder/tasks.vue'
import preorders from '@/components/preorder/preorders.vue'


import mixins from '@/components/mixins'
import InfiniteLoading from 'vue-infinite-loading'

import { QField, QInput, QCard } from 'quasar'

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
		preorders,
		QField,
		QInput,
		QCard
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
		async additionalFilters (n) {
			await this.client_filtersChange (Object.assign({}, this.lastClientsFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
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
			'client_complete',
			'app_view_mobile'
		]),
		additionalFilters () {
			return {
				'contacts.phone': this.searchByPhone2
			}
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
		...mapMutations([
			'app_layout_headerShadowSet',
			'client_destroy'
		]),
		async local_client_filtersChange (n) {
			this.lastClientsFilters = n
			await this.client_filtersChange (Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		async local_client_sortChange (n) {
			await this.client_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		}
	},
	async mounted(){
		this.app_layout_headerShadowSet(false)
		await this.client_init(this.oneId)
		this.searchByPhone = this.client_filtersPhone
	},
	beforeDestroy () {
		this.app_layout_headerShadowSet(true)
		this.client_destroy()
	}
}

</script>



<style lang="less">
.manyClientsWrapper {
	width: 100%;
	height: 100%;

	&__phone {
		width: 300px;
		margin: 0 10px;
	}

	&__horGroup {
		display: grid;
		grid-auto-flow: column;
		justify-content: end;
		align-items: center;
		background: #027be3;
		height: 50px;
		&-mobile {
			grid-auto-flow: row;
			justify-content: center;
			justify-items: center;
		}
	}

	&__card {
		height: ~"calc(100vh - 120px)";
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
</style>
