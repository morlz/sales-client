<template>
<div class="mainWrapper">
	<div class="oneFurnitureWrapper" v-if="isOne">
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


	<div class="manyFurnitureWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/storage` }">На складе</el-breadcrumb-item>
		</el-breadcrumb>

		<el-tabs tab-position="top" v-model="currentTab">
			<el-tab-pane v-for="tab, index in tabs" :label="tab.name" :key="index" />
		</el-tabs>

		<el-select v-model="currentFurnitureModel" filterable placeholder="Наименование" v-loading="furniture_loadingModels">
			<el-option v-for="model, index in furniture_models" :key="index" :label="model.MODEL" :value="model.MODEL" />
		</el-select>

		<tabless
			v-loading="storage_loading"
			key="salon"
			:data="storage_cached"
			:fieldDescription="storageFieldDescription"
			ref="table"
			@filter="localFurnitureFilterChange"
			@sortChange="localFurnitureSortChange"
			@onClick="routerGoId"
		/>

		<infinite-loading @infinite="storage_infinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="storage_loadingBottom" />
		</infinite-loading>
	</div>
</div>
</template>



<script>



import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'

let {
	storageFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading
	},
	mixins: [mixins],
	data() {
		return {
			storageFieldDescription,
			currentFurnitureModel: "Все модели",
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
		storage_models () {
			this.currentFurnitureModel = "Все модели"
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
			'furniture_models',
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFIlters () {
			return Object.assign({}, {
				model: this.currentFurnitureModel
			}, this.tabs[this.currentTab].filters)
		}
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
		localFurnitureFilterChange (n) {
			this.lastStorageFilters = n
			this.storage_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localFurnitureSortChange (n) {
			this.storage_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.storage_init(this.oneId)
		this.furniture_getModels()
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
	@media screen and (max-width: 1250px) {
		.oneFurnitureWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
