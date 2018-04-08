<template>
<div class="AppContent">
	<div class="oneShipmentWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Документы</router-link></li>
			<li><router-link :to="{ path: `/docs/shipments` }">Доставки</router-link></li>
			<li><router-link :to="{ path: `/docs/shipments/${shipment_current.ID_OTG}` }">Счёт {{ shipment_current.ID_OTG }}</router-link></li>
		</ul>

		<div class="cards" v-loading="shipment_loadingOne">
			<el-card class="card">
				<div class="title" slot="header">
					<h2>Основная информация</h2>
				</div>

				<div class="infoGrid">
					<div>Номер документа</div>
					<div>{{ shipment_current.N_DOC }}</div>
					<div>Дата ввода</div>
					<div>{{ shipment_current.DATEV }}</div>
					<div>Оплата доставки</div>
					<div>{{ shipment_current.PL_OTGR }}</div>
					<div>Вид</div>
					<div>{{ shipment_current.VIDDOST }}</div>
					<div>Примечание</div>
					<div></div>
					<div>В работе</div>
					<div>{{ shipment_current.DATEWORK }}</div>
					<div class="lc">Склад</div>
					<div class="lc">{{ shipment_current.NAME }}</div>
				</div>

				<div class="buttons">

				</div>
			</el-card>
		</div>

	</div>

	<div class="manyShipmntsWrapper" v-if="!isOne">
		<div 
			class="manyShipmntsWrapper__horGroup AppContent__headerTabs"
			:class="{ 'manyInvoicesWrapper__horGroup-mobile': app_view_mobile }">
			<q-field class="manyShipmntsWrapper__salon">
				<q-select v-model="local_currentSalon" :options="local_salon_list" filter inverted/>
			</q-field>
		</div>

		<q-card class="manyShipmntsWrapper__card">
			<tabless
				key="shipments"
				:data="shipment_cached"
				:complete="shipment_complete"
				:field-description="shipmentsFieldDescriptionFiltred"
				:filters="shipment_filters"
				ref="table"
				@filter="local_shipment_filterChange"
				@sort="local_shipment_sortChange"
				@click="routerGoId"
				@infinite="shipment_infinity"
			/>
		</q-card>
	</div>
</div>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import tabless from '@/components/tableSSNew.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'
import mixins from '@/mixins'

import { QSelect, QField, QCard } from 'quasar'

let {
	shipmentsFieldDescription
} = fieldDesription


export default {
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading,
		QSelect,
		QField,
		QCard
	},
	data() {
		return {
			shipmentsFieldDescription,
			lastShipmentsFilters: {},

			datePickerOptions: {
				shortcuts: [{
					text: 'Неделя',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: 'Месяц',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '3 месяца',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			}
		}
	},
	watch: {
		async additionalFilters(n) {
			await this.shipment_filtersChange(Object.assign({}, this.lastShipmentsFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId() {
			if (this.oneId !== undefined)
				this.shipment_getOne(this.oneId)
		}
	},
	computed: {
		...mapGetters([
			'salon_list',
			'salon_loadingList',
			'currentUserSalon',
			'shipment_cached',
			'shipment_current',
			'shipment_loading',
			'shipment_loadingBottom',
			'shipment_loadingOne',
			'shipment_filters',
			'salon_listWithAll',
			'app_view_mobile',
			'shipment_complete'
		]),
		additionalFilters () {
			return {}
		},
		local_currentSalon: {
			get () {
				return this.shipment_filters['salon.ID_SALONA']
			},
			set (n) {
				this.local_shipment_filterChange({
					...this.lastShipmentsFilters,
					'salon.ID_SALONA': n
				})
			}
		},
		local_salon_list () {
			return this.salon_listWithAll.map( el => ({ label: el.NAME, value: el.ID_SALONA }) )
		},
		shipmentsFieldDescriptionFiltred () {
			if (this.local_currentSalon)
				return this.shipmentsFieldDescription.filter(el => el.field != 'salon.NAME')
			return this.shipmentsFieldDescription
		}
	},
	methods: {
		...mapActions([
			'salon_getList',
			'shipment_init',
			'shipment_infinity',
			'shipment_sortChange',
			'shipment_filtersChange',
			'shipment_getOne',
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'shipment_destroy'
		]),
		async local_shipment_filterChange(n) {
			this.lastShipmentsFilters = n
			await this.shipment_filtersChange(Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		async local_shipment_sortChange(n) {
			await this.shipment_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		}
	},
	async mounted() {
		this.app_layout_headerShadowSet(false)
		await this.shipment_init(this.oneId)
		if (this.$refs.infiniteLoading)
			this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
	},
	beforeDestroy() {
		this.app_layout_headerShadowSet(true)
		this.shipment_destroy()
	}
}
</script>



<style lang="less" >

.manyShipmntsWrapper {
	width: 100%;
	height: 100%;

	&__salon {
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

.oneShipmentWrapper {
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
}
@media screen and (max-width: 1250px) {
	.oneShipmentWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}
</style>
