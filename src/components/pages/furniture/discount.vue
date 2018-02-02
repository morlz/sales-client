<template>
<div class="mainWrapper">
	<div class="oneDiscountWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount` }">Дисконд</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount/${discount_current.ID}` }">{{ discount_current.ID }}</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="cards" v-loading="discount_loadingOne">
			<el-card class="card">
				<div class="title" slot="header">
					<h2>Основная информация</h2>
				</div>

				<div class="infoGrid">
					<div>Уч. №</div>
					<div>{{ discount_current.UCH_N }}</div>
					<div>Фаб.н.</div>
					<div>{{ discount_current.UN }}</div>
					<div>Склад</div>
					<div>{{ discount_current.mXR }}</div>
					<div>Тип</div>
					<div>{{ discount_current.TIP }}</div>
					<div>Исп.</div>
					<div>{{ discount_current.ISP }}</div>
					<div>Дней на складе</div>
					<div>{{ discount_current.DATE_VX }}</div>
					<div>Ткань 1</div>
					<div>{{ discount_current.TKAN }}</div>
					<div>Ткань 2</div>
					<div>{{ discount_current.cKOMP }}</div>
					<div>Ткань 3</div>
					<div>{{ discount_current.cKOMP1 }}</div>
					<div>Кат</div>
					<div>{{ discount_current.KAT }}</div>
					<div>Примечание</div>
					<div>{{ discount_current.COMMENT }}</div>
					<div>Декор</div>
					<div>{{ discount_current.DEKOR }}</div>
					<div>Стежка</div>
					<div>{{ discount_current.stegka }}</div>
					<div>Цена руб.</div>
					<div>{{ discount_current.CENA_ZAL }}</div>
					<div class="lc">Цех</div>
					<div class="lc">{{ discount_current.DATE_CEX }}</div>
				</div>

				<div class="buttons">
					<el-button type="primary">Добавить в корзину</el-button>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyDiscountWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount` }">Дисконд</el-breadcrumb-item>
		</el-breadcrumb>

		<furniture-models-switch/>

		<furniture-models-wrap :current="discount_filters.MODEL" @select="local_discount_filtersModelSet" :loading="discount_loadingModels" :models="discount_models">
			<el-tabs tab-position="top" v-model="currentTab">
				<el-tab-pane label="Таблица">
					<tabless
						key="salon"
						:data="discount_cached"
						:fieldDescription="discountFieldDescriptionFilred"
						:filters="discount_filters"
						:select-fields="local_discount_selectFields"
						:localSort="false"
						ref="table"
						@filter="local_discount_filterChange"
						@sortChange="local_discount_sortChange"
						@onClick="routerGoId"
						@select="local_discount_handleFieldSelect"
					/>
				</el-tab-pane>

				<el-tab-pane label="Плитки">
					<discount-tile-view v-loading="discount_loading" />
				</el-tab-pane>
			</el-tabs>

			<infinite-loading @infinite="discount_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="discount_loadingBottom" />
			</infinite-loading>
		</furniture-models-wrap>
	</div>
</div>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import discountTileView from '@/components/discountTileView'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'

let {
	discountFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		discountTileView,
		InfiniteLoading,
		furnitureModelsSwitch,
		furnitureModelsWrap
	},
	mixins: [mixins],
	data() {
		return {
			discountFieldDescription,
			lastDiscountFilters: {},
			lastDiscountSort: {},
			currentTab: 0
		}
	},
	watch: {
		additionalFilters (n) {
			this.discount_filtersChange (Object.assign({}, this.lastDiscountFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		additionalSort (n) {
			this.discount_sortChange (Object.assign({}, n, this.lastDiscountSort))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId (n) {
			if (n != undefined)
				this.discount_getOne(n)
		},
	},
	computed: {
		...mapGetters([
			'salonsListLoading',
			'currentUserSalon',
			'discount_loadingBottom',
			'discount_loadingOne',
			'discount_loading',
			'discount_cached',
			'discount_current',
			'discount_filters',
			'discount_models',
			'auth_settings',
			'salon_list_discount',
			'discount_loadingModels'
		]),
		additionalFilters () {
			return {}
		},
		additionalSort () {
			let obj2 = {}
			if (this.currentTab == 1)
				obj2 = {
					"sortType" : "asc",
					"sortColumn" : "model"
				}

			return Object.assign({}, obj2)
		},
		discountFieldDescriptionFilred () {
			if (this.auth_settings.showModels)
				return this.discountFieldDescription.filter(el => el.field != 'MODEL')
			return this.discountFieldDescription
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
		]),
		local_discount_filterChange (n) {
			this.lastDiscountFilters = n
			this.discount_filtersChange (Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_discount_sortChange (n) {
			this.lastDiscountSort = n
			this.discount_sortChange (Object.assign({}, n, this.additionalSort))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
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
	},
	mounted () {
		this.discount_init(this.oneId)
	}
}
</script>



<style lang="less">
	.oneDiscountWrapper {
		.el-main {
			padding: 0;
		}
		.buttons {
			margin: 0 0 10px 0;
		}
		.cards {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}
	@media screen and (max-width: 1250px) {
		.oneDiscountWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
