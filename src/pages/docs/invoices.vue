<template>
	<q-page class="AppContent">
		<div class="oneInvoiceWrapper AppContent__inner" v-if="isOne">
			<div class="oneInvoice" v-loading="invoice_loadingOne">
				<info-card-invoice :content="invoice_current" v-ga="`m`" :type="type"/>
				<info-card-client :content="invoice_current.client || invoice_current.clientOld" v-ga="`c`"/>
				<info-card-invoice-additional :content="invoice_current" v-ga="`a`"/>
				<info-card-zak-td :content="invoice_current" v-ga="`z`"/>
				<info-card-shipments :content="invoice_current" v-ga="`s`"/>
				<info-card-payments :content="invoice_current" v-ga="`p`"/>
			</div>
		</div>

		<div class="manyInvoicesWrapper" v-if="!isOne">
			<div
				class="manyInvoicesWrapper__horGroup AppContent__headerTabs"
				:class="{ 'manyInvoicesWrapper__horGroup-mobile': app_view_mobile }">

				<q-tabs v-model="currentTab">
					<q-tab v-for="tab, index in tabs" :name="tab.type" slot="title" :label="tab.name" :key="index"/>
				</q-tabs>

				<q-field class="manyInvoicesWrapper__salon" v-if="auth_can({
						InvoiceSelectSalon: 1,
						Salon: 1,
					})">
					<q-select v-model="local_currentSalon" :options="local_salon_list" filter inverted/>
				</q-field>
			</div>

			<q-card class="manyInvoicesWrapper__card AppContent__inner">
				<!--<tabless
					key="invoices"
					:data="invoice_cached"
					:complete="invoice_complete"
					:field-description="DocsInvoicesFiltred"
					:filters="invoice_filters"
					ref="table"
					@filter="local_invoice_filtersChange"
					@sort="local_invoice_sortChange"
					@click="routerGoId"
					@infinite="invoice_infinity"
				/>-->

				<infinite-table
					:columns="DocsInvoicesFiltred"
					:rows="invoice_cached"
					:complete="invoice_complete"
					@infinite="invoice_infinity"
					@click="routerGoId"
					@sort="local_invoice_sortChange"
					@filter="local_invoice_filtersChange"
				/>
			</q-card>
		</div>
	</q-page>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import InfiniteTable from '@/components/InfiniteTable'
import InfoCardClient from '@/components/InfoCardClient'
import InfoCardInvoice from '@/components/InfoCardInvoice'
import InfoCardZakTd from '@/components/InfoCardZakTd'
import InfoCardShipments from '@/components/InfoCardShipments'
import InfoCardPayments from '@/components/InfoCardPayments'
import InfoCardInvoiceAdditional from '@/components/InfoCardInvoiceAdditional'
import { DocsInvoices } from '@/static/fieldDescription'
import { AuthMixin, RouteMixin } from '@/mixins'

export default {
	components: {
		InfiniteTable,
		InfoCardClient,
		InfoCardInvoice,
		InfoCardZakTd,
		InfoCardShipments,
		InfoCardPayments,
		InfoCardInvoiceAdditional
	},
	mixins: [AuthMixin, RouteMixin],
	props: {
		type: String
	},
	data () {
		return {
			DocsInvoices,
			currentTab: 'inWork',
			lastInvoicesFilters: {},
			tabs: [
				//{ name: "Оплаченые", type: 'paid' },
				{ name: "В работе", type: 'inWork' },
				{ name: "Отгружено", type: 'shipped' },
				{ name: "Отказ", type: 'deny' },
				{ name: "Все счета", type: '' }, // all
			]
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.invoice_filtersChange (Object.assign({}, this.lastInvoicesFilters, n))
		},
		oneId () {
			if (this.oneId !== undefined)
				this.invoice_getOne(this.oneId)
		},
	},
	computed: {
		...mapGetters([
			'invoice_loading',
			'invoice_loadingBottom',
			'invoice_loadingOne',
			'invoice_cached',
			'invoice_current',
			'invoice_filters',
			'salon_list',
			'salon_listWithAll',
			'currentUserSalon',
			'app_view_mobile',
			'invoice_complete'
		]),
		data () {
			return this.cachedInvoices
		},
		additionalFilters () {
			return { type: this.currentTab, page: this.type }
		},
		currentInvoiceManager () {
			return this.invoice_current.manager ? `${this.invoice_current.manager.FIO} ${this.invoice_current.manager.IMY} ${this.invoice_current.manager.OTCH}` : {}
		},
		local_currentSalon: {
			get () {
				return this.invoice_filters['storage.ID_SALONA']
			},
			set (n) {
				this.local_invoice_filtersChange({
					...this.lastInvoicesFilters,
					'storage.ID_SALONA': n
				})
			}
		},
		local_salon_list () {
			return this.salon_listWithAll.map( el => ({ label: el.NAME, value: el.ID_SALONA }) )
		},
		DocsInvoicesFiltred () {
			if (this.local_currentSalon)
				return this.DocsInvoices.filter(el => el.field != 'storage.NAME')
			return this.DocsInvoices
		}
	},
	methods: {
		...mapActions([
			'invoice_init',
			'invoice_infinity',
			'invoice_filtersChange',
			'invoice_sortChange',
			'invoice_getOne',
			'salon_getList'
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'invoice_destroy'
		]),
		async local_invoice_filtersChange (n) {
			this.lastInvoicesFilters = n
			await this.invoice_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_invoice_sortChange (n) {
			await this.invoice_sortChange (n)
		}
	},
	mounted () {
		this.app_layout_headerShadowSet(!!this.oneId)
	},
	async created () {
		await this.invoice_init(this.oneId || { page: this.type })
	},
	beforeDestroy () {
		this.app_layout_headerShadowSet(true)
		this.invoice_destroy()
	}
}

</script>

<style lang="less">

.manyInvoicesWrapper {
	width: 100%;
	height: 100%;

	&__salon {
		width: 300px;
		margin: 0 10px;
	}

	&__horGroup {
		display: grid;
		grid-auto-flow: column;
		justify-content: space-between;
		align-items: center;
		background: #027be3;
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

.oneInvoiceWrapper {
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.oneInvoice {
		display: grid;
		grid-gap: 10px;
		grid-template: 	"m c"
						"m a"
						"z z"
						"s s"
						"p p";
	}
}

@media screen and (max-width: 1100px) {
	.oneInvoiceWrapper {
		.oneInvoice {
			grid-template: 	"m"
							"c"
							"a"
							"z"
							"s"
							"p";
		}
	}
}
</style>
