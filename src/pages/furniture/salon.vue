<template>
<div class="mainWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/furniture/salon` }">В салоне</el-breadcrumb-item>
	</el-breadcrumb>

	<el-tabs tab-position="top" v-model="currentTab">
		<el-tab-pane v-for="tab, index in tabs" :label="tab.name" :key="index" />
	</el-tabs>

	<transition name="fade">
		<el-select v-model="currentSalon" filterable placeholder="Салон" v-loading="salonsListLoading" v-if="currentTab != 2">
			<el-option v-for="salon, index in salonsList" :key="index" :label="salon.NAME" :value="salon.id" />
		</el-select>
	</transition>

	<transition name="fade">
		<el-select v-model="currentFurnitureModel" filterable placeholder="Наименование" v-loading="loadingFutnitureModels" v-if="currentTab == 0">
			<el-option v-for="model, index in futnitureModels" :key="index" :label="model.MODEL" :value="model.MODEL" />
		</el-select>
	</transition>

	<tabless
		key="salon"
		:data="data"
		:fieldDescription="furnitureSalonFieldDescription"
		ref="table"
		@filter="localFurnitureFilterChange"
		@sortChange="localFurnitureSortChange"
		@onClick="routerGoId"
	/>

	<infinite-loading @infinite="furnituresInfinity" ref="infiniteLoading">
		<div class="end" slot="no-results" />
		<div class="end" slot="no-more" />
		<div class="spinner" slot="spinner" v-loading="loadingBottomFurnitures" />
	</infinite-loading>
</div>
</template>



<script>



import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'

let {
	furnitureSalonFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading
	},
	mixins: [mixins],
	data() {
		return {
			furnitureSalonFieldDescription,
			currentSalon: 999,
			currentFurnitureModel: "",
			currentTab: 0,
			tabs: [
				{ name: "Склад", filters: { type: "storage" } },
				{ name: "Все новые", filters: { type: "new" } },
				{ name: "Продажи из других салонов", filters: { type: "selled" } },
			]
		}
	},
	watch: {
		currentUserSalon (n) {
			this.currentSalon = n
		},
		additionalFIlters (n) {
			this.furnituresFiltersChange (Object.assign({}, this.lastFurnitureFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		currentSalon (n) {
			if (n = 999) n = null

			this.getFurninuteModels(this.currentSalon)
		},
		futnitureModels () {
			this.currentFurnitureModel = ""
		}
	},
	computed: {
		...mapGetters([
			'salonsList',
			'salonsListLoading',
			'currentUserSalon',
			'futnitureModels',
			'loadingFutnitureModels',
			'loadingBottomFurnitures',
			'cachedFurnitures',
			'salonsList'
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFIlters () {
			return Object.assign({
				ID_SALONA: this.currentSalon != 999 ? this.currentSalon : null,
				MODEL: this.currentFurnitureModel
			}, this.tabs[this.currentTab].filters)
		}
	},
	methods: {
		...mapActions([
			'getSalonsList',
			'getFurninuteModels',
			'furnituresInfinity',
			'furnituresFiltersChange',
			'furnituresSortChanged',
		]),
		selectFuriture () {

		},
		localFurnitureFilterChange (n) {
			this.lastFurnituresFilters = n
			this.furnituresFiltersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localFurnitureSortChange (n) {
			this.furnituresSortChanged (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.currentSalon = this.currentUserSalon
		this.getSalonsList()

		setTimeout(() => {
			if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
		}, 1e3)
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
