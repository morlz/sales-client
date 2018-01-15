<template>
<div class="mainWrapper">
	<div class="oneStorageWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/storage` }">На складе</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/storage/${storage_current.ID}` }">{{ storage_current.ID }}</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="cards" v-loading="storage_loadingOne">
			<el-card class="card">
				<div class="title" slot="header">Основная информация</div>

				<div class="infoGrid">
					<div>Уч №</div>
					<div>{{ storage_current.UCH_N }}</div>
					<div>Фаб.н.</div>
					<div>{{ storage_current.UN }}</div>
					<div>Тип</div>
					<div>{{ storage_current.TIP }}</div>
					<div>Ткань 1</div>
					<div>{{ storage_current.TKAN }}</div>
					<div>Ткань 2</div>
					<div>{{ storage_current.cKOMP }}</div>
					<div>Ткань 3</div>
					<div>{{ storage_current.KOMP1 }}</div>
					<div>Кат</div>
					<div>{{ storage_current.KAT }}</div>
					<div>Примечание</div>
					<div>{{ storage_current.COMMENT }}</div>
					<div>Декор</div>
					<div>{{ storage_current.DEKOR }}</div>
					<div>Стежка</div>
					<div>{{ storage_current.stegka }}</div>
					<div>Акция</div>
					<div>{{ storage_current.NAKC }}</div>
					<div>Сост.</div>
					<div>{{ storage_current.Sostoynie }}</div>
					<div>Цех</div>
					<div>{{ storage_current.DATE_CEX }}</div>
					<div class="lc">Номер заказа</div>
					<div class="lc">{{ storage_current.cNDOC }}</div>
				</div>

				<div class="buttons">
					<el-button type="primary">Добавить в корзину</el-button>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyStorageWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/storage` }">На складе</el-breadcrumb-item>
		</el-breadcrumb>

		<furniture-models-switch/>

		<el-tabs tab-position="top" v-model="currentTab">
			<el-tab-pane v-for="tab, index in tabs" :label="tab.name" :key="index" />
		</el-tabs>

		<furniture-models-wrap :current="storage_filters.MODEL" @select="local_furniture_filtersSalonSet">
			<tabless
				v-loading="storage_loading"
				key="storage"
				:data="storage_cached"
				:fieldDescription="storageFieldDescriptionFiltred"
				:filters="storage_filters"
				:select-fields="local_storage_selectFields"
				ref="table"
				@filter="local_storage_filterChange"
				@sortChange="local_storage_sortChange"
				@onClick="routerGoId"
			/>

			<infinite-loading @infinite="storage_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="storage_loadingBottom" />
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
	storageFieldDescription
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
			storageFieldDescription,
			lastStorageFilters: {},
			currentTab: 0,
			tabs: [
				{ name: "СГП", filters: { type: "sgp" } },
				{ name: "Интернет", filters: { type: "internet" } },
				{ name: "e-commerce", filters: { type: "e" } },
			]
		}
	},
	watch: {
		additionalFIlters (n) {
			this.storage_filtersChange (Object.assign({}, this.lastStorageFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId (n) {
			if (n != undefined)
				this.storage_getOne(n)
		}
	},
	computed: {
		...mapGetters([
			'furniture_loadingModels',
			'storage_loadingBottom',
			'storage_loadingOne',
			'storage_loading',
			'storage_cached',
			'storage_current',
			'storage_filters',
			'furniture_models',
			'auth_settings'
		]),
		additionalFIlters () {
			return Object.assign({}, this.tabs[this.currentTab].filters)
		},
		local_storage_selectFields () {
			let rez = []
			if (this.furniture_models)
				rez.push({ data: this.furniture_models, field: "MODEL", fields: { label: "MODEL" }, filterable: true })

			return rez
		},
		storageFieldDescriptionFiltred () {
			if (this.auth_settings.showModels)
				return this.storageFieldDescription.filter(el => el.field != 'MODEL')
			return this.storageFieldDescription
		},
	},
	methods: {
		...mapActions([
			'storage_init',
			'storage_sortChange',
			'storage_filtersChange',
			'storage_infinity',
			'furniture_getModels',
			'storage_getOne',
		]),
		local_storage_filterChange (n) {
			this.lastStorageFilters = n
			this.storage_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_storage_sortChange (n) {
			this.storage_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_furniture_filtersSalonSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = ""
			let filters = { ...this.storage_filters, MODEL }
			this.local_storage_filterChange(filters)
		}
	},
	mounted () {
		this.storage_init(this.oneId)
		this.furniture_getModels()
	}
}
</script>



<style lang="less">
	.oneStorageWrapper {
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
	.manyStorageWrapper {
		width: 100%;
	}
	@media screen and (max-width: 1250px) {
		.oneStorageWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
