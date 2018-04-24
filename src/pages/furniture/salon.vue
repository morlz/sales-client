<template>
<q-page class="AppContent">
	<div class="FurnitureSofa AppContent__inner" v-if="isOne && auth_can(1, 'Furniture')">
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

					<q-item v-for="row, rowIndex in list.items" :key="rowIndex" v-if="typeof row.hide !== 'function' || !row.hide()">
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

			<q-card-actions v-if="furniture_current.td && !cart_alreadyIn(furniture_current.td.ID, true)">
				<q-btn color="primary" @click="furniture_addToCart(furniture_current)">Добавить в корзину</q-btn>
			</q-card-actions>
		</q-card>

		<loading :value="furniture_loadingOne"/>
	</div>


	<div class="FurnitureSalon" v-if="!isOne">
		<q-tabs v-model="currentTab" class="AppContent__headerTabs">
			<q-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title"/>
		</q-tabs>

		<furniture-models-wrap
			class="AppContent__inner"
			:current="furniture_filters.MODEL"
			:loading="furniture_loadingModels"
			:models="furniture_models"
			@select="local_furniture_filtersModelSet">

			<select-place-form v-model="selectPlaceModal" @select="transfer_take"/>
			<select-salon-form v-model="selectSalonModal" @select="transfer_moveToSalon"/>

			<q-card class="FurnitureSalon__items">
				<infinite-table
					:columns="FurnitureSalonFiltred"
					:rows="furniture_cached"
					:complete="furniture_complete"
					:select-fields="local_furniture_selectFields"
					:filter-values="furniture_filters"
					@infinite="furniture_infinity"
					@click="routerGoId"
					@sort="local_furniture_sortChange"
					@filter="local_furniture_filterChange"
					>

					<template slot="buttons" slot-scope="props">
						<i aria-hidden="true" class="q-icon material-icons" v-if="auth_can(2, 'Cart')" @click.stop="furniture_addToCart({ UN: props.row.UN })">shopping_cart</i>
						<i aria-hidden="true" class="q-icon material-icons" v-if="auth_can(4, 'MovingSofaBetweenSalons')" @click.stop="(selectSalonModal = true, transfer_selectedToMoveSet(props.row))">local_shipping</i>


						<!--

						<template slot="cloth1" slot-scope="props">
							<preview-cloth :content="props.row.cloth1" v-if="props.row.cloth1" inline width="120px"/>
							<template v-if="!props.row.cloth1">{{ props.row.TKAN }}</template>
						</template>

						<template slot="cloth2" slot-scope="props">
							<preview-cloth :content="props.row.cloth2" v-if="props.row.cloth2" inline width="120px"/>
							<template v-if="!props.row.cloth2">{{ props.row.KOMP }}</template>
						</template>

						<template slot="cloth3" slot-scope="props">
							<preview-cloth :content="props.row.cloth3" v-if="props.row.cloth3" inline width="120px"/>
							<template v-if="!props.row.cloth3">{{ props.row.KOMP1 }}</template>
						</template>
					-->
					</template>
				</infinite-table>



				<!--<tabless
					key="salon"
					:data="furniture_cached"
					:complete="furniture_complete"
					:field-description="furnitureSalonFieldDescriptionFiltred"
					:filters="furniture_filters"
					:select-fields="local_furniture_selectFields"
					:selectable="currentTab == 'new'"
					ref="table"
					@filter="local_furniture_filterChange"
					@sort="local_furniture_sortChange"
					@click="routerGoId"
					@select="local_furniture_handleFieldSelect"
					@infinite="furniture_infinity"
					@selected="transfer_selectedSet"
				>
				</tabless>-->
			</q-card>
		</furniture-models-wrap>
	</div>
</q-page>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { AuthMixin, RouteMixin, SingleItemPageMixin, CartMixin } from '@/mixins'
import tabless from '@/components/tableSSNew'
import InfiniteTable from '@/components/InfiniteTable'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import { FurnitureSalon } from '@/static/fieldDescription'
import PreviewCloth from '@/components/PreviewCloth'
import SelectPlaceForm from '@/components/forms/SelectPlace'
import SelectSalonForm from '@/components/forms/SelectSalon'
import PreviewSalon from '@/components/PreviewSalon'
import money from '@/filters/Money'
import Loading from '@/components/Loading'


export default {
	components: {
		InfiniteTable,
		tabless,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		PreviewCloth,
		SelectPlaceForm,
		SelectSalonForm,
		Loading
	},
	mixins: [AuthMixin, RouteMixin, SingleItemPageMixin, CartMixin],
	data() {
		return {
			FurnitureSalon,
			currentTab: 'storage',
			lastFurnituresFilters: {},
			tabs: [
				{ name: "Склад", type: "storage" },
				{ name: "Все новые", type: "new" },
				{ name: "Продажи из других салонов", type: "selled" },
			],
			selectPlaceModal: false,
			selectSalonModal: false,
			selected: {},
			one: {
				lists: {
					info: {
						items: [
							{ label: 'Фабричный номер', source: 'furniture_current.UN' },
							{ label: 'Модель', source: 'furniture_current.MODEL' },
							{ label: 'Тип', source: 'furniture_current.TIP' },
							{ label: 'Исполнение', source: 'furniture_current.ISP' },
							{ label: 'Категория', source: 'furniture_current.KAT' },
							{ label: 'Декор', source: 'furniture_current.DEKOR' },
							{ label: 'Стежка', source: 'furniture_current.Vid_stegki' },
						]
					},
					storage: {
						label: 'Информация о складе',
						items: [
							{
								label: 'Местоположение',
								component: PreviewSalon,
								props: () => ({ content: this.getContentByPath('furniture_current.td.salon') || {} })
							},
							{ label: 'Место хранения', source: 'furniture_current.mXR.NAME' },
							{
								label: 'Прибытие на слкад',
								source: 'furniture_current.DATE_VX',
								filter: el => this.$moment(el).fromNow() + ` (${this.$moment().diff(this.$moment(el), 'days')} дн.)`
							},
						]
					},
					cloth: {
						label: 'Ткани',
						items: [
							{ label: 'Ткань 1', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.cloth1') || {} }) },
							{ label: 'Ткань 2', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.cloth2') || {} }) },
							{ label: 'Ткань 3', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.cloth3') || {} }) },
						]
					},
					sost: {
						label: 'Состояние',
						items: [
							{ label: 'Примечание', source: 'furniture_current.COMMENT' },
							{ label: 'Состояние', source: 'furniture_current.Sostoynie' },
						]
					},
					price: {
						label: 'Цены',
						items: [
							{ label: 'Цена', source: 'furniture_current.CENA', filter: el => money(el) + ' руб.' },
							{ label: 'Цена модели опт', source: 'furniture_current.ModelPriceOpt', filter: el => money(el) + ' руб.', hide: a => this.auth_can(1, 'SeeOptPrice') },
							{ label: 'Цена модели розн', source: 'furniture_current.ModelPriceR', filter: el => money(el) + ' руб.' },
							{ label: 'Цена зал', source: 'furniture_current.CENA_ZAL', filter: el => money(el) + ' руб.' },
						]
					}
				}
			}
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.furniture_filtersChange (Object.assign({}, this.lastFurnituresFilters, n))
		},
		oneId (n) {
			this.app_layout_headerShadowSet(!!n)

			if (n != undefined)
				this.furniture_getOne(n)
		},
		furniture_type (n) {
			this.furniture_getModels({ filters: { 'td.salon.ID_SALONA': this.lastFurnituresFilters['td.salon.ID_SALONA'] }, type: n })
		}
	},
	computed: {
		...mapGetters([
			'salon_list_furniture',
			'salon_loadingList',
			'currentUserSalon',
			'furniture_loadingModels',
			'furniture_loadingBottom',
			'furniture_loadingOne',
			'furniture_loading',
			'furniture_cached',
			'furniture_current',
			'furniture_filters',
			'furniture_models',
			'furniture_type',
			'main_auth_settings',
			'furniture_complete'
		]),
		...mapGetters('transfer', [
			'transfer_selected'
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFilters () {
			return { type: this.currentTab }
		},
		local_furniture_selectFields () {
			let rez = {}
			if (this.salon_list_furniture)
				rez['td.salon.NAME'] = {
					data: this.salon_list_furniture,
					field: "td.salon.NAME",
					fields: { label: "NAME", value: "ID_SALONA", output: 'td.salon.ID_SALONA' }
				}

			if (this.furniture_models)
				rez['MODEL'] = {
					data: this.furniture_models,
					field: "MODEL",
					fields: { label: "MODEL", value: 'value' }
				}

			return rez
		},
		FurnitureSalonFiltred () {
			let tmp = this.FurnitureSalon

			if (this.currentTab != 'new')
				tmp = tmp.filter(el => el.field != 'td.lastPlace.invoice.N_DOC')


			if (this.main_auth_settings.showModels && this.furniture_filters.MODEL)
				return tmp.filter(el => el.field != 'MODEL')

			return tmp
		},
	},
	methods: {
		...mapActions([
			'furniture_init',
			'furniture_sortChange',
			'furniture_filtersChange',
			'furniture_infinity',
			'furniture_getModels',
			'furniture_getOne',
			'furniture_addToCart',
			'furniture_preload',
		]),
		...mapActions('transfer', [
			'transfer_take',
			'transfer_moveToSalon'
		]),
		...mapMutations('transfer', [
			'transfer_selectedSet',
			'transfer_selectedToMoveSet'
		]),
		...mapMutations([
			'furniture_destroy',
			'app_layout_headerShadowSet'
		]),
		local_furniture_filterChange (n) {
			if (n['MODEL'] == 'Все модели')
				delete n['MODEL']

			if (this.lastFurnituresFilters['td.salon.ID_SALONA'] != n['td.salon.ID_SALONA'])
				this.furniture_getModels({ filters: { 'td.salon.ID_SALONA': n['td.salon.ID_SALONA'] }, type: this.furniture_type })

			this.lastFurnituresFilters = n
			this.furniture_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_furniture_sortChange (n) {
			await this.furniture_sortChange (n)
		},
		local_furniture_filtersModelSet (model) {
			this.local_furniture_filterChange({
				...this.furniture_filters,
				MODEL: model == 'Все модели' ? undefined : model,
				type: this.furniture_type
			})
		},
	},
	async mounted () {
		this.app_layout_headerShadowSet(!!this.oneId)
		await this.furniture_init(this.oneId)
		this.lastFurnituresFilters = this.furniture_filters
	},
	beforeDestroy() {
		this.app_layout_headerShadowSet(true)
		this.furniture_destroy()
	}
}
</script>



<style lang="stylus">
.FurnitureSalon
	&__items
		width 100%
		height calc(100vh - 120px)

	&__discount
		color red
		font-weight 600
		s
			font-size 12px
			color #999


.FurnitureSofa
	&__main
		position relative
		display grid
		grid-gap 10px

</style>
