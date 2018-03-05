<template>
<div class="mainWrapper">
	<div class="oneFurnitureWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/salon' }">В салоне</router-link></li>
			<li><router-link :to="{ path: `/furniture/salon/${furniture_current.ID}` }">{{ furniture_current.ID }}</router-link></li>
		</ul>

		<div class="cards" v-loading="furniture_loadingOne">
			<el-card class="card">
				<div class="title" slot="header">
					<h2>Основная информация</h2>
				</div>

				<div class="infoGrid">
					<div>Модель</div>
					<div>{{ furniture_current.MODEL }}</div>
					<div>Салон</div>
					<div>{{ currentSalonName.NAME }}</div>
					<div>Фаб.н.</div>
					<div>{{ furniture_current.UN }}</div>
					<div>М.хр.</div>
					<div>{{ furniture_current.mXR }}</div>
					<div>Тип</div>
					<div>{{ furniture_current.TIP }}</div>
					<div>Исп.</div>
					<div>{{ furniture_current.ISP }}</div>
					<div>Дней на складе</div>
					<div>{{ furniture_current.DATE_VX }}</div>
					<div>Ткань 1</div>
					<div>{{ furniture_current.cOSNOVA }}</div>
					<div>Ткань 2</div>
					<div>{{ furniture_current.cKOMP }}</div>
					<div>Ткань 3</div>
					<div>{{ furniture_current.cKOMP2 }}</div>
					<div>Примечание</div>
					<div>{{ furniture_current.COMMENT }}</div>
					<div>Категория</div>
					<div>{{ furniture_current.KAT }}</div>
					<div>Декор</div>
					<div>{{ furniture_current.DEKOR }}</div>
					<div>Стежка</div>
					<div>{{ furniture_current.stegka }}</div>
					<div>Состояние</div>
					<div>{{ furniture_current.Sostoynie }}</div>
					<div>Цена</div>
					<div>{{ furniture_current.CENA }} руб.</div>
					<div>Цена модели опт</div>
					<div>{{ furniture_current.ModelPriceOpt }} руб.</div>
					<div>Цена модели розн</div>
					<div>{{ furniture_current.ModelPriceR }} руб.</div>
					<div class="lc">Цена (зал)</div>
					<div class="lc">{{ furniture_current.CENA_ZAL }} руб.</div>
				</div>

				<div class="buttons">
					<q-btn color="primary" @click="furniture_addToCart(furniture_current)">Добавить в корзину</q-btn>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyFurnitureWrapper" v-if="!isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/salon' }">В салоне</router-link></li>
		</ul>

		<furniture-models-switch/>

		<q-tabs v-model="currentTab" inverted>
			<q-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title"/>
		</q-tabs>

		<furniture-models-wrap
			:current="furniture_filters.MODEL"
			@select="local_furniture_filtersModelSet"
			:loading="furniture_loadingModels"
			:models="furniture_models">
			<tabless
				key="salon"
				:data="furniture_cached"
				:complete="furniture_complete"
				:field-description="furnitureSalonFieldDescriptionFiltred"
				:filters="furniture_filters"
				:select-fields="local_furniture_selectFields"
				:local-sort="false"
				:infinite="!!furniture_cached.length"
				ref="table"
				@filter="local_furniture_filterChange"
				@sortChange="local_furniture_sortChange"
				@onClick="routerGoId"
				@select="local_furniture_handleFieldSelect"
				@infinite="furniture_infinity"
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
					<q-btn color="primary" flat @click="furniture_addToCart({ UN: props.row.UN })">
						<q-icon name="shopping_cart"/>
					</q-btn>
				</template>
			</tabless>
		</furniture-models-wrap>
	</div>
</div>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSSNew'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'
import PreviewCloth from '@/components/PreviewCloth'

import { QTabs, QTab, QBtn, QIcon } from 'quasar'

let {
	furnitureSalonFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		QTabs,
		QTab,
		QBtn,
		PreviewCloth,
		QIcon
	},
	mixins: [mixins],
	data() {
		return {
			furnitureSalonFieldDescription,
			currentTab: 'storage',
			lastFurnituresFilters: {},
			tabs: [
				{ name: "Склад", type: "storage" },
				{ name: "Все новые", type: "new" },
				{ name: "Продажи из других салонов", type: "selled" },
			]
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.furniture_filtersChange (Object.assign({}, this.lastFurnituresFilters, n))
		},
		oneId (n) {
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
		data () {
			return this.cachedFurnitures
		},
		additionalFilters () {
			return { type: this.currentTab }
		},
		currentSalonName () {
			return this.salon_list_furniture.find(salon => salon.id == this.furniture_current.ID_SALONA) || {}
		},
		local_furniture_selectFields () {
			let rez = []
			if (this.salon_list_furniture)
				rez.push({ data: this.salon_list_furniture, field: "td.salon.NAME", fields: { label: "NAME", value: "ID_SALONA", output: 'td.salon.ID_SALONA' }, filterable: true })

			if (this.furniture_models)
				rez.push({ data: this.furniture_models, field: "MODEL", fields: { label: "MODEL" }, filterable: true })

			return rez
		},
		furnitureSalonFieldDescriptionFiltred () {
			if (this.main_auth_settings.showModels)
				return this.furnitureSalonFieldDescription.filter(el => el.field != 'MODEL')
			return this.furnitureSalonFieldDescription
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
			'furniture_preload'
		]),
		async local_furniture_filterChange (n) {
			this.lastFurnituresFilters = n
			await this.furniture_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_furniture_sortChange (n) {
			await this.furniture_sortChange (n)
		},
		local_furniture_handleFieldSelect (data) {
			if (data.field != 'td.salon.NAME') return
			this.furniture_getModels({ filters: { 'td.salon.ID_SALONA': data.value }, type: this.furniture_type })
		},
		local_furniture_filtersModelSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = undefined
			let filters = { ...this.furniture_filters, MODEL, type: this.furniture_type }
			this.local_furniture_filterChange(filters)
		}
	},
	async mounted () {
		await this.furniture_init(this.oneId)
		this.lastFurnituresFilters = this.furniture_filters
	},
}
</script>



<style lang="less">
	.oneFurnitureWrapper {
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

		&__discount {
			font-weight: bold;
			color: red;
			display: grid;
			s {
				font-size: 70%;
			}
		}
	}
	.manyFurnitureWrapper {
		width: 100%;
		height: ~"calc(100% - 100px)";
	}
	@media screen and (max-width: 1250px) {
		.oneFurnitureWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
