<template>
<div class="mainWrapper">
	<div class="oneFurnitureWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/salon` }">В салоне</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/salon/${furniture_current.ID}` }">{{ furniture_current.ID }}</el-breadcrumb-item>
		</el-breadcrumb>

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
					<el-button type="primary">Добавить в корзину</el-button>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyFurnitureWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/salon` }">В салоне</el-breadcrumb-item>
		</el-breadcrumb>

		<furniture-models-switch/>

		<el-tabs tab-position="top" v-model="currentTab">
			<el-tab-pane v-for="tab, index in tabs" :label="tab.name" :key="index" />
		</el-tabs>

		<furniture-models-wrap :current="furniture_filters.MODEL" @select="local_furniture_filtersModelSet" :loading="furniture_loadingModels" :models="furniture_models">
			<tabless
				key="salon"
				:data="furniture_cached"
				:fieldDescription="furnitureSalonFieldDescriptionFiltred"
				:filters="furniture_filters"
				:select-fields="local_furniture_selectFields"
				:localSort="false"
				ref="table"
				@filter="local_furniture_filterChange"
				@sortChange="local_furniture_sortChange"
				@onClick="routerGoId"
				@select="local_furniture_handleFieldSelect"
			/>

			<infinite-loading @infinite="furniture_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="furniture_loadingBottom" />
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
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'

let {
	furnitureSalonFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading,
		furnitureModelsSwitch,
		furnitureModelsWrap
	},
	mixins: [mixins],
	data() {
		return {
			furnitureSalonFieldDescription,
			currentTab: 0,
			lastFurnituresFilters: {},
			tabs: [
				{ name: "Склад", type: "storage" },
				{ name: "Все новые", type: "new" },
				{ name: "Продажи из других салонов", type: "selled" },
			]
		}
	},
	watch: {
		additionalFilters (n) {
			this.furniture_filtersChange (Object.assign({}, this.lastFurnituresFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId (n) {
			if (n != undefined)
				this.furniture_getOne(n)
		},
		furniture_type (n) {
			this.furniture_getModels({ salon: this.lastFurnituresFilters.ID_SALONA, type: n })
		}
	},
	computed: {
		...mapGetters([
			'salon_list_furniture',
			'salonsListLoading',
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
			'auth_settings',
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFilters () {
			return { type: this.tabs[this.currentTab].type }
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
			if (this.auth_settings.showModels)
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
		]),
		local_furniture_filterChange (n) {
			this.lastFurnituresFilters = n
			this.furniture_filtersChange (Object.assign({}, this.additionalFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_furniture_sortChange (n) {
			this.furniture_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_furniture_handleFieldSelect (data) {
			if (data.field != 'td.salon.NAME') return
			this.furniture_getModels({ filters: { 'td.salon.ID_SALONA': data.value }, type: this.furniture_type })
		},
		local_furniture_filtersModelSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = ""
			let filters = { ...this.furniture_filters, MODEL, type: this.furniture_type }
			this.local_furniture_filterChange(filters)
		}
	},
	mounted () {
		this.furniture_init(this.oneId)
	}
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
	}
	.manyFurnitureWrapper {
		width: 100%;

	}
	@media screen and (max-width: 1250px) {
		.oneFurnitureWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
