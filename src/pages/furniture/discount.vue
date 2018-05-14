<template>
<q-page class="AppContent">
	<div class="FurnitureDiscount">
		<div class="FurnitureDiscount__tabs AppContent__tabs">
			<q-tabs v-model="currentTab" class="AppContent__headerTabs">
				<q-tab name="table" label="Таблица" slot="title"/>
				<q-tab name="tile" label="Плитки" slot="title"/>
			</q-tabs>

			<q-btn color="white" flat @click="main_auth_settings_showModelsToggle">{{ main_auth_settings_showModelsToggleText }}</q-btn>
		</div>

		<furniture-models-wrap
			class="AppContent__inner"
			:current="discount_filters.MODEL"
			:loading="discount_loadingModels"
			:models="discount_models"
			@select="local_discount_filtersModelSet">

			<q-card v-if="currentTab == 'table'" class="FurnitureDiscount__items">
				<infinite-table
					:columns="FurnitureDiscountFilred"
					:rows="discount_cached"
					:complete="discount_complete"
					:select-fields="local_discount_selectFields"
					:filter-values="discount_filters"
					@infinite="discount_infinity"
					@click="clickHandler"
					@sort="local_discount_sortChange"
					@filter="local_discount_filterChange"
					>

					<template slot="buttons" slot-scope="props">
						<i aria-hidden="true" class="q-icon material-icons" v-if="auth_can(2, 'Cart')" @click.stop="discount_addToCart({ UN: props.row.UN })">shopping_cart</i>
					</template>
				</infinite-table>
			</q-card>

			<div v-if="currentTab == 'tile'" class="FurnitureDiscount__items relative-position">
				<discount-tile-view>
					<infinite-loading :distance="800" @infinite="discount_infinity" ref="infiniteLoading">
						<div class="end" slot="no-results" />
						<div class="end" slot="no-more" />
						<div class="spinner" slot="spinner" v-loading="discount_loadingBottom" />
					</infinite-loading>
				</discount-tile-view>

				<!-- <loading :value="discount_loading"/> -->
			</div>
		</furniture-models-wrap>

		<modal-sofa v-model="modalSofa" :id="modalSofaId" type="storage"/>
	</div>
</q-page>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import InfiniteTable from '@/components/InfiniteTable'
import InfiniteLoading from 'vue-infinite-loading'
import Loading from '@/components/Loading'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import discountTileView from '@/components/discountTileView'
import { FurnitureDiscount } from '@/static/fieldDescription'
import PreviewCloth from '@/components/PreviewCloth'
import ModalSofa from '@/components/ModalSofa'

export default {
	components: {
		InfiniteTable,
		discountTileView,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		PreviewCloth,
		InfiniteLoading,
		Loading,
		ModalSofa
	},
	mixins: [AuthMixin],
	data() {
		return {
			FurnitureDiscount,
			lastDiscountFilters: {},
			lastDiscountSort: {},
			currentTab: 'table',
			modalSofa: false,
			modalSofaId: 0,
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.discount_filtersChange (Object.assign({}, this.lastDiscountFilters, n))
		},
		async additionalSort (n) {
			await this.discount_sortChange (Object.assign({}, n, this.lastDiscountSort))
		},
	},
	computed: {
		...mapGetters([
			'salon_loadingList',
			'currentUserSalon',
			'discount_loadingBottom',
			'discount_loadingOne',
			'discount_loading',
			'discount_cached',
			'discount_current',
			'discount_filters',
			'discount_models',
			'main_auth_settings',
			'salon_list_discount',
			'discount_loadingModels',
			'discount_complete',
			'main_auth_settings_showModelsToggleText'
		]),
		additionalFilters () {
			return {}
		},
		additionalSort () {
			let obj2 = {}
			if (this.currentTab == 'tile')
				obj2 = {
					"sortType" : "asc",
					"sortColumn" : "model"
				}

			return Object.assign({}, obj2)
		},
		FurnitureDiscountFilred () {
			if (this.main_auth_settings.showModels)
				return this.FurnitureDiscount.filter(el => el.field != 'MODEL')
			return this.FurnitureDiscount
		},
		local_discount_selectFields () {
			let rez = {}

			if (this.salon_list_discount)
				rez["td.salon.NAME"] = {
					data: this.salon_list_discount,
					field: "td.salon.NAME",
					fields: { label: "NAME", value: "ID_SALONA", output: 'td.salon.ID_SALONA'}
				}

			if (this.discount_models)
				rez['MODEL'] = {
					data: this.discount_models,
					field: "MODEL",
					fields: { label: "MODEL" }
				}

			return rez
		},
	},
	methods: {
		...mapActions([
			'discount_init',
			'discount_sortChange',
			'discount_filtersChange',
			'discount_infinity',
			'discount_getOne',
			'discount_getModels',
			'discount_addToCart',
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'discount_destroy',
			'main_auth_settings_showModelsToggle'
		]),
		async local_discount_filterChange (n) {
			if (n['MODEL'] == 'Все модели')
				delete n['MODEL']

				if (this.lastDiscountFilters['td.salon.ID_SALONA'] != n['td.salon.ID_SALONA'])
					this.discount_getModels({ filters: { 'td.salon.ID_SALONA': n['td.salon.ID_SALONA'] } })

			this.lastDiscountFilters = n
			await this.discount_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_discount_sortChange (n) {
			this.lastDiscountSort = n
			await this.discount_sortChange (Object.assign({}, n, this.additionalSort))
		},
		local_discount_handleFieldSelect (data) {
			if (data.field != 'td.salon.NAME') return
			this.discount_getModels({ filters: { 'td.salon.ID_SALONA': data.value }})
		},
		local_discount_filtersModelSet (model) {
			this.local_discount_filterChange({
				...this.discount_filters,
				MODEL: model == 'Все модели' ? undefined : model
			})
		},
		clickHandler (e, row) {
			this.modalSofaId = +row.td.ID
			this.modalSofa = !this.modalSofa
			//this.$router.push(`/furniture/salon/${item.UN}`)
		}
	},
	async mounted () {
		this.app_layout_headerShadowSet(false)
		await this.discount_init()
		this.lastDiscountFilters = this.discount_filters
	},
	beforeDestroy () {
		this.app_layout_headerShadowSet(true)
		this.discount_destroy()
	}
}
</script>



<style lang="stylus">
.FurnitureDiscount
	&__tabs
		display grid
		grid-template-columns 1fr max-content max-content
		background #027be3

	&__items
		width 100%
		height calc(100vh - 120px)
</style>
