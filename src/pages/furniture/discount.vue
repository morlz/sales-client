<template>
<div class="mainWrapper">
	<div class="oneFurnitureWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount` }">Дисконд</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount/${discount_current.ID}` }">{{ discount_current.ID }}</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="cards" v-loading="discount_loadingOne">
			<el-card class="card">
				<div class="title" slot="header"></div>

				{{ discount_current }}
			</el-card>
		</div>
	</div>


	<div class="manyFurnitureWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/furniture/discount` }">Дисконд</el-breadcrumb-item>
		</el-breadcrumb>

		<el-select v-model="currentSalon" filterable placeholder="Салон" v-loading="salonsListLoading">
			<el-option v-for="salon, index in salonsListDiscount" :key="index" :label="salon.NAME" :value="salon.id" />
		</el-select>

		<el-select v-model="currentFurnitureModel" filterable placeholder="Наименование модели" v-loading="furniture_loadingModels">
			<el-option v-for="model, index in furniture_models" :key="index" :label="model.MODEL" :value="model.MODEL" />
		</el-select>

		<el-tabs tab-position="top" v-model="currentTab">
			<el-tab-pane label="Таблица">
				<tabless
					v-loading="discount_loading"
					key="salon"
					:data="discount_cached"
					:fieldDescription="discountFieldDescription"
					ref="table"
					@filter="localFurnitureFilterChange"
					@sortChange="localFurnitureSortChange"
					@onClick="routerGoId"
				/>
			</el-tab-pane>

			<el-tab-pane label="Плитки">
				<discount-tile-view
					v-loading="discount_loading"
					/>
			</el-tab-pane>
		</el-tabs>

		<infinite-loading @infinite="discount_infinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="discount_loadingBottom" />
		</infinite-loading>

	</div>
</div>
</template>



<script>



import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
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
		InfiniteLoading
	},
	mixins: [mixins],
	data() {
		return {
			discountFieldDescription,
			currentSalon: "999",
			currentFurnitureModel: "Все модели",
			lastDiscountFilters: {},
			lastDiscountSort: {},
			currentTab: 0
		}
	},
	watch: {
		additionalFIlters (n) {
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
		currentSalon (n) {
			if (n == 999) n = null

			this.furniture_getModels(this.currentSalon)
		},
		furniture_models () {
			this.currentFurnitureModel = "Все модели"
		},
	},
	computed: {
		...mapGetters([
			'salonsListDiscount',
			'salonsListLoading',
			'currentUserSalon',
			'furniture_loadingModels',
			'discount_loadingBottom',
			'discount_loadingOne',
			'discount_loading',
			'discount_cached',
			'discount_current',
			'furniture_models',
			'furniture_loadingModels',
			'furniture_models',
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFIlters () {
			return Object.assign({}, {
				salon: this.currentSalon != "999" ? this.currentSalon : null,
				model: this.currentFurnitureModel
			})
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
	},
	methods: {
		...mapActions([
			'discount_init',
			'discount_sortChange',
			'discount_filtersChange',
			'discount_infinity',
			'discount_getOne',
			'getSalonsList',
			'furniture_getModels',
		]),
		localFurnitureFilterChange (n) {
			this.lastDiscountFilters = n
			this.discount_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localFurnitureSortChange (n) {
			this.lastDiscountSort = n
			this.discount_sortChange (Object.assign({}, n, this.additionalSort))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.discount_init(this.oneId)
		this.getSalonsList()
		this.furniture_getModels()
	}
}
</script>



<style lang="less" scoped>
	.el-main {
		padding: 0;
	}
	.buttons {
		margin: 0 0 10px 0;
	}
</style>
