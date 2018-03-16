<template>
	<div class="AppContent">
		<div class="oneInvoiceWrapper" v-if="isOne">
			<ul class="breadcrumb">
				<li><router-link :to="{ path: '/' }">Главная</router-link></li>
				<li><router-link :to="{ path: '/' }">Документы</router-link></li>
				<li><router-link :to="{ path: `/docs/${type}` }">{{ type == 'invoices' ? 'Выставеные счета' : 'Перемещения' }}</router-link></li>
				<li><router-link :to="{ path: `/docs/${type}/${invoice_current.ID}` }">Счёт {{ invoice_current.N_DOC }}</router-link></li>
			</ul>

			<div class="oneInvoice" v-loading="invoice_loadingOne">
				<info-card-invoice :content="invoice_current" v-ga="`m`"/>
				<info-card-client :content="invoice_current.client || invoice_current.clientOld" v-ga="`c`"/>
				<info-card-invoice-additional :content="invoice_current" v-ga="`a`"/>
				<info-card-zak-td :content="invoice_current" v-ga="`z`"/>
				<!-- <info-card-shipments :content="invoice_current.shipments" v-ga="`s`"/> -->

				<q-card v-ga="`p`">
					<q-card-title>
						Оплата
					</q-card-title>

					<q-card-main>
					</q-card-main>
				</q-card>
			</div>
		</div>

		<div class="manyInvoicesWrapper" v-if="!isOne">
			<div
				class="manyInvoicesWrapper__horGroup"
				:class="{ 'manyInvoicesWrapper__horGroup-mobile': app_view_mobile }">

				<q-tabs v-model="currentTab">
					<q-tab v-for="tab, index in tabs" :name="tab.type" slot="title" :label="tab.name" :key="index"/>
				</q-tabs>

				<q-field class="manyInvoicesWrapper__salon">
					<q-select v-model="local_currentSalon" :options="local_salon_list" filter inverted/>
				</q-field>
			</div>

			<q-card class="manyInvoicesWrapper__card">
				<tabless
					key="invoices"
					:data="invoice_cached"
					:complete="invoice_complete"
					:field-description="invoicesFieldDescriptionFiltred"
					:filters="invoice_filters"
					ref="table"
					@filter="local_invoice_filtersChange"
					@sort="local_invoice_sortChange"
					@click="routerGoId"
					@infinite="invoice_infinity"
				/>
			</q-card>
		</div>
	</div>
</template>



<script>

/*			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/' }">Документы</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: `/docs/${type}` }">{{ type == 'invoices' ? 'Выставеные счета' : 'Перемещения' }}</el-breadcrumb-item>
			</el-breadcrumb>*/


import { mapGetters, mapActions, mapMutations } from 'vuex'
import tabless from '@/components/tableSSNew.vue'
import InfoCardClient from '@/components/InfoCardClient.vue'
import InfoCardInvoice from '@/components/InfoCardInvoice.vue'
import InfoCardZakTd from '@/components/InfoCardZakTd.vue'
import InfoCardShipments from '@/components/InfoCardShipments.vue'
import InfoCardInvoiceAdditional from '@/components/InfoCardInvoiceAdditional.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'
import mixins from '@/components/mixins'

import {
	QTabs,
	QTab,
	QCard,
	QCardTitle,
	QCardMain,
	QList,
	QItem,
	QItemMain,
	QItemSide,
	QSelect,
	QField
} from 'quasar'

let {
	invoicesFieldDescription
} = fieldDesription


export default {
	props: {
		type: String
	},
	data () {
		return {
			invoicesFieldDescription,
			currentTab: '',
			lastInvoicesFilters: {},
			tabs: [
				{ name: "Счета", type: '' }, // all
				//{ name: "Оплаченые", type: 'paid' },
				{ name: "В работе", type: 'inWork' },
				{ name: "Отгружено", type: 'shipped' },
				{ name: "Отказ", type: 'deny' },
			]
		}
	},
	mixins: [mixins],
	components: {
		QTabs,
		QTab,
		QCard,
		QCardTitle,
		QCardMain,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QSelect,
		QField,
		tabless,
		InfiniteLoading,
		InfoCardClient,
		InfoCardInvoice,
		InfoCardZakTd,
		InfoCardShipments,
		InfoCardInvoiceAdditional
	},
	watch: {
		async additionalFilters (n) {
			await this.invoice_filtersChange (Object.assign({}, this.lastInvoicesFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
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
		invoicesFieldDescriptionFiltred () {
			if (this.local_currentSalon)
				return this.invoicesFieldDescription.filter(el => el.field != 'storage.NAME')
			return this.invoicesFieldDescription
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
			'app_layout_headerShadowSet'
		]),
		async local_invoice_filtersChange (n) {
			this.lastInvoicesFilters = n
			await this.invoice_filtersChange (Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		async local_invoice_sortChange (n) {
			await this.invoice_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		}
	},
	async mounted () {
		this.app_layout_headerShadowSet(false)
		await this.invoice_init(this.oneId || { page: this.type })
		if (this.$refs.infiniteLoading)
			this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
	},
	beforeDestrou () {
		this.app_layout_headerShadowSet(true)
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
		height: ~"calc(100vh - 115px)";
	}
}

.oneInvoiceWrapper {
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.oneInvoice {
		display: grid;
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
