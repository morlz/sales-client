<template>
	<div class="mainWrapper">
		<div class="oneInvoiceWrapper" v-if="isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/' }">Документы</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: `/docs/${type}` }">{{ type == 'invoices' ? 'Выставеные счета' : 'Перемещения' }}</el-breadcrumb-item>
				<el-breadcrumb-item>Счёт {{ invoice_current.N_DOC }}</el-breadcrumb-item>
			</el-breadcrumb>

			<div class="cards" v-loading="invoice_loadingOne">

				<el-card class="invoiceMainInfo">
					<div slot="header">
						<h2>Основная информация</h2>
					</div>

					<div class="infoGrid">
						<div>Номер документа</div>
						<div>{{ invoice_current.N_DOC }}</div>
						<div>DATE</div>
						<div>{{ invoice_current.DATE }}</div>
						<div>Дата отгрузки</div>
						<div>{{ invoice_current.PL_OTGR }}</div>
						<div>Менеджер</div>
						<div>{{ currentInvoiceManager }}</div>
						<div>Клиент</div>
						<div>{{ invoice_current.client }}</div>
						<div>Рекламный источник</div>
						<div>{{ invoice_current.adSource ? invoice_current.adSource.NAME : '...' }}</div>
						<div class="lc">Склад</div>
						<div class="lc">{{ invoice_current.storage }}</div>
					</div>

					<div class="buttons">
						<el-button type="primary">Добавить в корзину</el-button>
					</div>
				</el-card>
			</div>
		</div>

		<div class="manyInvoicesWrapper" v-if="!isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/' }">Документы</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: `/docs/${type}` }">{{ type == 'invoices' ? 'Выставеные счета' : 'Перемещения' }}</el-breadcrumb-item>
			</el-breadcrumb>

			<el-select v-model="currentSalon" filterable placeholder="Салон">
				<el-option v-for="salon, index in salonsList" :value="salon.id" :label="salon.NAME" :key="index" />
			</el-select>

			<el-tabs tab-position="top" v-model="currentTab">
				<el-tab-pane :label="tab.name" v-for="tab, index in tabs" :key="index" />
			</el-tabs>

			<tabless
				v-loading="invoice_loading"
				key="invoices"
				:data="invoice_cached"
				:fieldDescription="invoicesFieldDescription"
				ref="table"
				@filter="localInvoiceFilterChange"
				@sortChange="localInvoiceSortChange"
				@onClick="routerGoId"
			/>
			<infinite-loading @infinite="invoice_infinity" ref="infiniteLoading" key="invoicesinf">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="invoice_loadingBottom" />
			</infinite-loading>
		</div>
	</div>
</template>



<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import tabless from '@/components/tableSS.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'
import mixins from '@/components/mixins'

let {
	invoicesFieldDescription
} = fieldDesription


export default {
	props: ['type'],
	data () {
		return {
			invoicesFieldDescription,
			currentTab: 0,
			tabs: [
				{ name: "Счета", filters: {} }, // all
				{ name: "Оплаченые", filters: { IS_PAY: "1", ISSAVE: "0",  IS_CLOSE: "0", Otkaz: "0" } },
				{ name: "В работе", filters: { IS_PAY: "0", ISSAVE: "0", IS_CLOSE: "0", Otkaz: "0" } },
				{ name: "Отгружено", filters: { IS_CLOSE: "1", Otkaz: "0" } },
				{ name: "Отказ", filters: { Otkaz: "1" } },
			],
			currentSalon: "999",
			lastInvoicesFilters: {}
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading
	},
	watch: {
		additionalFIlters (n) {
			this.invoice_filtersChange (Object.assign({}, this.lastInvoicesFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId () {
			if (this.oneId !== undefined)
				this.invoice_getOne(this.oneId)
		},
		currentUserSalon (n) {
			this.currentSalon = n
		}
	},
	computed: {
		...mapGetters([
			'invoice_loading',
			'invoice_loadingBottom',
			'invoice_loadingOne',
			'invoice_cached',
			'invoice_current',
			'salonsList',
			'currentUserSalon'
		]),
		data () {
			return this.cachedInvoices
		},
		additionalFIlters () {
			return Object.assign({
				type: this.type,
				ID_SALON: this.currentSalon != 999 ? this.currentSalon : null
			}, this.tabs[this.currentTab].filters)
		},
		currentInvoiceManager () {
			return this.invoice_current.manager ? `${this.invoice_current.manager.FIO} ${this.invoice_current.manager.IMY} ${this.invoice_current.manager.OTCH}` : {}
		}
	},
	methods: {
		...mapActions([
			'invoice_init',
			'invoice_infinity',
			'invoice_filtersChange',
			'invoice_sortChange',
			'invoice_getOne',
			'getSalonsList'
		]),
		localInvoiceFilterChange (n) {
			this.lastInvoicesFilters = n
			this.invoice_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localInvoiceSortChange (n) {
			this.invoice_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.currentSalon = this.currentUserSalon
		this.getSalonsList()
		this.invoice_init(this.oneId)
	}
}

</script>



<style lang="less" >

.oneInvoiceWrapper {
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
}
@media screen and (max-width: 1250px) {
	.oneInvoiceWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}
</style>
