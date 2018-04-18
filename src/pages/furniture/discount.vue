<template>
<q-page class="AppContent">
	<div class="FurnitureDiscount">
		<q-tabs v-model="currentTab" class="AppContent__headerTabs">
			<q-tab name="table" label="Таблица" slot="title"/>
			<q-tab name="tile" label="Плитки" slot="title"/>
		</q-tabs>

		<furniture-models-wrap
			class="AppContent__inner"
			:current="discount_filters.MODEL"
			:loading="discount_loadingModels"
			:models="discount_models"
			@select="local_discount_filtersModelSet">

			<q-card v-if="currentTab == 'table'" class="FurnitureDiscount__items">
				<tabless
					key="discount"
					:data="discount_cached"
					:complete="discount_complete"
					:field-description="FurnitureDiscountFilred"
					:filters="discount_filters"
					:select-fields="local_discount_selectFields"
					ref="table"
					@filter="local_discount_filterChange"
					@sort="local_discount_sortChange"
					@click="rowClickHandler"
					@select="local_discount_handleFieldSelect"
					@infinite="discount_infinity"
				>
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

					<template slot="buttons" slot-scope="props">
						<q-btn color="primary" flat @click.stop="discount_addToCart({ UN: props.row.UN })">
							<q-icon name="shopping_cart"/>
						</q-btn>
					</template>
				</tabless>
			</q-card>

			<div v-if="currentTab == 'tile'">
				<discount-tile-view v-loading="discount_loading" />

				<infinite-loading :distance="800" @infinite="discount_infinity" ref="infiniteLoading" v-if="false">
					<div class="end" slot="no-results" />
					<div class="end" slot="no-more" />
					<div class="spinner" slot="spinner" v-loading="discount_loadingBottom" />
				</infinite-loading>
			</div>
		</furniture-models-wrap>
	</div>
</q-page>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/mixins'
import tabless from '@/components/tableSSNew'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import discountTileView from '@/components/discountTileView'
import { FurnitureDiscount } from '@/static/fieldDescription'
import PreviewCloth from '@/components/PreviewCloth'

export default {
	components: {
		tabless,
		discountTileView,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		PreviewCloth,
	},
	mixins: [mixins],
	data() {
		return {
			FurnitureDiscount,
			lastDiscountFilters: {},
			lastDiscountSort: {},
			currentTab: 'table'
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.discount_filtersChange (Object.assign({}, this.lastDiscountFilters, n))
		},
		async additionalSort (n) {
			await this.discount_sortChange (Object.assign({}, n, this.lastDiscountSort))
		},
		oneId (n) {
			if (n != undefined)
				this.discount_getOne(n)
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
			'discount_complete'
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
			let rez = []
			if (this.salon_list_discount)
				rez.push({ data: this.salon_list_discount, field: "td.salon.NAME", fields: { label: "NAME", value: "ID_SALONA", output: 'td.salon.ID_SALONA'}, filterable: true })

			if (this.discount_models)
				rez.push({ data: this.discount_models, field: "MODEL", fields: { label: "MODEL" }, filterable: true })

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
			'discount_destroy'
		]),
		async local_discount_filterChange (n) {
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
		local_discount_filtersModelSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = ""
			let filters = { ...this.discount_filters, MODEL }
			this.local_discount_filterChange(filters)
		},
		rowClickHandler (e, item) {
			this.$router.push(`/furniture/salon/${item.UN}`)
		}
	},
	mounted () {
		this.app_layout_headerShadowSet(false)
		this.discount_init()
	},
	beforeDestrou () {
		this.app_layout_headerShadowSet(true)
		this.discount_destroy()
	}
}
</script>



<style lang="stylus">
.FurnitureDiscount
	&__items
		width 100%
		height calc(100vh - 120px)
</style>
