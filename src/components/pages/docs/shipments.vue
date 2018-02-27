<template>
<div class="mainWrapper">
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
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Документы</router-link></li>
			<li><router-link :to="{ path: `/docs/shipments` }">Доставки</router-link></li>
		</ul>

		<tabless
			v-loading="shipment_loading"
			key="shipments"
			:data="shipment_cached"
			:fieldDescription="shipmentsFieldDescription"
			:filters="shipment_filters"
			ref="table"
			@filter="local_shipment_filterChange"
			@sortChange="local_shipment_sortChange"
			@onClick="routerGoId"
		/>

		<infinite-loading @infinite="shipment_infinity" ref="infiniteLoading" key="shipmentsinf">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="shipment_loadingBottom" />
		</infinite-loading>
	</div>
</div>
</template>



<script>
/*
<el-date-picker
	v-model="filters.dateRange"
	type="daterange"
	unlink-panels
	range-separator="До"
	start-placeholder="Дата начала"
	end-placeholder="Дата конца"
	:picker-options="datePickerOptions"
/>
*/
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import tabless from '@/components/tableSS.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'
import mixins from '@/components/mixins'


let {
	shipmentsFieldDescription
} = fieldDesription


export default {
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
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading
	},
	watch: {
		additionalFilters(n) {
			this.shipment_filtersChange(Object.assign({}, this.lastShipmentsFilters, n))

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
			'shipment_filters'
		]),
		additionalFilters () {
			return {}
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
		local_shipment_filterChange(n) {
			this.lastShipmentsFilters = n
			this.shipment_filtersChange(Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		local_shipment_sortChange(n) {
			this.shipment_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		}
	},
	async mounted() {
		await this.shipment_init(this.oneId)
		if (this.$refs.infiniteLoading)
			this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
	}
}
</script>



<style lang="less" >

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
