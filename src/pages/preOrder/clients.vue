<template>
	<q-page class="AppContent" v-if="auth_can(1, 'Client')">
		<div class="oneClientWrapper" v-if="isOne">
			<div class="cards AppContent__inner" v-loading="client_loadingOne">
				<info-card-client :content="client_current" v-if="auth_can(1, 'Client')"/>
				<!-- <info-card-contact-faces :content="client_current.contactfaces" v-if="auth_can(1, 'ContactFace')"/> -->
				<info-card-tasks :content="client_current.tasks" v-if="auth_can(1, 'Task')"/>
				<info-card-preorders :content="client_current.preorders" v-if="auth_can(1, 'Preorder')"/>
				<info-card-invoices :content="client_current.invoices" v-if="auth_can(1, 'Invoice')" />
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

			<q-card class="manyClientsWrapper__card AppContent__inner">
				<!--<tabless
					key="clientsinf"
					:data="client_cached"
					:complete="client_complete"
					:field-description="CRMClients"
					:filters="client_filters"
					ref="table"
					@filter="local_client_filtersChange"
					@sort="local_client_sortChange"
					@click="routerGoId"
					@infinite="client_infinity"
				/>-->

				<infinite-table
					:columns="CRMClients"
					:rows="client_cached"
					:complete="client_complete"
					@infinite="client_infinity"
					@click="routerGoId"
					@sort="local_client_sortChange"
					@filter="local_client_filtersChange"
				/>
			</q-card>
		</div>
	</q-page>
</template>



<script>
import { CRMClients } from '@/static/fieldDescription'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import InfiniteTable from '@/components/InfiniteTable'
import lightTable from '@/components/lightTable'

import InfoCardClient from '@/components/InfoCardClient'
import InfoCardContactFaces from '@/components/InfoCardContactFaces'
import InfoCardTasks from '@/components/InfoCardTasks'
import InfoCardPreorders from '@/components/InfoCardPreorders'
import InfoCardInvoices from '@/components/InfoCardInvoices'


import { AuthMixin, RouteMixin } from '@/mixins'

export default {
	data () {
		return {
			CRMClients,
			lastClientsFilters: [],
			searchByPhone: "",
			searchByPhone2: "",
			seachTimeout: false
		}
	},
	mixins: [AuthMixin, RouteMixin],
	components: {
		InfiniteTable,
		lightTable,
		InfoCardClient,
		InfoCardContactFaces,
		InfoCardTasks,
		InfoCardPreorders,
		InfoCardInvoices
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
				'contacts.phone': this.searchByPhone2 == '' ? undefined : this.searchByPhone2
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
		},
		async local_client_sortChange (n) {
			await this.client_sortChange (n)
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
		grid-template-columns: 1fr;
		grid-gap: 10px;
		/*.tasks,
		.preorders {
			grid-column: ~"1 / 3";
		}*/

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
