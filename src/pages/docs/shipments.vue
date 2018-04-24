<template>
<q-page class="AppContent">
	<div class="DocsShipment AppContent__inner" v-if="isOne">
		<q-card>
			<q-card-title>
				Основная информация
			</q-card-title>

			<q-card-main class="FurnitureSofa__main">
				<q-list v-for="list, listIndex in one.lists" :key="listIndex">
					<template v-if="list.label">
						<q-list-header>
							{{ list.label }}
						</q-list-header>

						<q-item-separator/>
					</template>

					<q-item v-for="row, rowIndex in list.items" :key="rowIndex">
						<q-item-main>
							{{ row.label }}
						</q-item-main>

						<q-item-side right>
							<template v-if="row.component">
								<div :is="row.component" v-bind="row.props()"/>
							</template>

							<template v-else>
								{{ (row.filter ? row.filter : el => el) ( getContentByPath(row.source) ) }}
							</template>
						</q-item-side>
					</q-item>
				</q-list>
			</q-card-main>
		</q-card>

		<loading :value="shipment_loadingOne"/>
	</div>

	<div class="manyShipmntsWrapper" v-if="!isOne">
		<div
			class="manyShipmntsWrapper__horGroup AppContent__headerTabs"
			:class="{ 'manyInvoicesWrapper__horGroup-mobile': app_view_mobile }">
			<q-field class="manyShipmntsWrapper__salon">
				<q-select v-model="local_currentSalon" :options="local_salon_list" filter inverted/>
			</q-field>
		</div>

		<q-card class="manyShipmntsWrapper__card AppContent__inner">
			<!--<tabless
				key="shipments"
				:data="shipment_cached"
				:complete="shipment_complete"
				:field-description="DocsShipmentsFiltred"
				:filters="shipment_filters"
				ref="table"
				@filter="local_shipment_filterChange"
				@sort="local_shipment_sortChange"
				@click="routerGoId"
				@infinite="shipment_infinity"
			/>-->


			<infinite-table
				:columns="DocsShipmentsFiltred"
				:rows="shipment_cached"
				:complete="shipment_complete"
				@infinite="shipment_infinity"
				@click="routerGoId"
				@sort="local_shipment_sortChange"
				@filter="local_shipment_filterChange"
			/>
		</q-card>
	</div>
</q-page>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import InfiniteTable from '@/components/InfiniteTable'
import { DocsShipments } from '@/static/fieldDescription'
import { AuthMixin, RouteMixin, SingleItemPageMixin } from '@/mixins'
import Loading from '@/components/Loading'


export default {
	mixins: [AuthMixin, RouteMixin, SingleItemPageMixin],
	components: {
		InfiniteTable,
		Loading
	},
	data() {
		return {
			DocsShipments,
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
			},

			one: {
				lists: {
					info: {
						label: '',
						items: [
							{ label: 'Номер документа', source: 'shipment_current.N_DOC' },
							{ label: 'Дата ввода', source: 'shipment_current.DATEV' },
							{ label: 'Оплата доставки', source: 'shipment_current.PL_OTGR' },
							{ label: 'Вид', source: 'shipment_current.VIDDOST' },
							{ label: 'В работе', source: 'shipment_current.DATEWORK' },
							{ label: 'Склад', source: 'shipment_current.NAME' },
							{ label: 'Адрес', source: 'shipment_current.KUDA' },
						]
					}
				}
			}
		}
	},
	watch: {
		async additionalFilters(n) {
			await this.shipment_filtersChange(Object.assign({}, this.lastShipmentsFilters, n))
		},
		oneId() {
			this.app_layout_headerShadowSet(!!this.oneId)

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
		DocsShipmentsFiltred () {
			if (this.local_currentSalon)
				return this.DocsShipments.filter(el => el.field != 'salon.NAME')
			return this.DocsShipments
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
		},
		async local_shipment_sortChange(n) {
			await this.shipment_sortChange(n)
		}
	},
	async mounted() {
		this.app_layout_headerShadowSet(!!this.oneId)
		await this.shipment_init(this.oneId)
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
</style>
