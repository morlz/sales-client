<template>
<div class="mainWrapper">
	<div class="oneDiscountWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/discount' }">Дисконт</router-link></li>
			<li><router-link :to="{ path: `/furniture/discount/${discount_current.UN}` }">{{ discount_current.UN }}</router-link></li>
		</ul>

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
					<q-btn color="primary" @click="discount_addToCart(discount_current)">Добавить в корзину</q-btn>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyDiscountWrapper" v-if="!isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/discount' }">Дисконт</router-link></li>
		</ul>

		<furniture-models-switch/>

		<furniture-models-wrap :current="discount_filters.MODEL" @select="local_discount_filtersModelSet" :loading="discount_loadingModels" :models="discount_models">
			<q-tabs inverted v-model="currentTab" no-pane-border>
				<q-tab name="table" label="Таблица" slot="title"/>
				<q-tab name="tile" label="Плитки" slot="title"/>

				<q-tab-pane name="table">
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
							<q-btn color="primary" flat @click="discount_addToCart({ UN: props.row.UN })">
								<q-icon name="shopping_cart"/>
							</q-btn>
						</template>
					</tabless>
				</q-tab-pane>

				<q-tab-pane name="tile">
					<discount-tile-view v-loading="discount_loading" />
				</q-tab-pane>

			</q-tabs>

			<infinite-loading :distance="800" @infinite="discount_infinity" ref="infiniteLoading">
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
import PreviewCloth from '@/components/PreviewCloth'
import { QTabs, QTab, QTabPane, QBtn, QIcon } from 'quasar'
let {
	discountFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		discountTileView,
		InfiniteLoading,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		QTabs,
		QTab,
		QTabPane,
		QBtn,
		PreviewCloth,
		QIcon
	},
	mixins: [mixins],
	data() {
		return {
			discountFieldDescription,
			lastDiscountFilters: {},
			lastDiscountSort: {},
			currentTab: 'table'
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.discount_filtersChange (Object.assign({}, this.lastDiscountFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		async additionalSort (n) {
			await this.discount_sortChange (Object.assign({}, n, this.lastDiscountSort))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
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
			'discount_loadingModels'
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
		discountFieldDescriptionFilred () {
			if (this.main_auth_settings.showModels)
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
			'discount_addToCart',
		]),
		async local_discount_filterChange (n) {
			this.lastDiscountFilters = n
			await this.discount_filtersChange (Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		async local_discount_sortChange (n) {
			this.lastDiscountSort = n
			await this.discount_sortChange (Object.assign({}, n, this.additionalSort))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading)
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
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
