<template>
<div class="mainWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Документы</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/docs/shipments` }">Доставки</el-breadcrumb-item>
	</el-breadcrumb>

	<el-select v-model="filters.salon"></el-select>
	<el-date-picker v-model="filters.date" type="daterange" unlink-panels range-separator="До" start-placeholder="Дата начала" end-placeholder="Дата конца" :picker-options="datePickerOptions" />

</div>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import tabless from '@/components/tableSS.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'
import mixins from '@/components/mixins'

/*
let {
	shipmentsFieldDescription
} = fieldDesription
*/

export default {
	data() {
		return {
			filters: {
				date: "",
				salon: 0
			},
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
		additionalFIlters(n) {
			this.shipmentsFiltersChange(Object.assign({}, this.lastShipmentsFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId() {
			if (this.oneId !== undefined)
				this.getOneShipment(this.oneId)

		},
	},
	computed: {
		...mapGetters([
			'loadingBottomShipments',
			'cachedShipments',
			'oneLoadingShipment',
			'currentShipment'
		]),
		data() {
			return this.cachedShipments
		},
		additionalFIlters() {
			return Object.assign({})
		}
	},
	methods: {
		...mapActions([
			'shipmentsInfinity',
			'shipmentsFiltersChange',
			'shipmentsSortChanged',
			'getOneShipment'
		]),
		localShipmentFilterChange(n) {
			this.lastShipmentsFilters = n
			this.shipmentsFiltersChange(Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localShipmentSortChange(n) {
			this.shipmentsSortChanged(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		tabClickHandler(tabRef) {
			this.currentTab = tabRef.$data.index
		}
	},
	mounted() {
		if (this.oneId !== undefined)
			this.getOneShipment(this.oneId)
		setTimeout(() => {
			if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
		}, 1e3)
	}
}
</script>



<style lang="less" scoped>


</style>
