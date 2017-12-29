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
				<div class="title" slot="header"></div>

				{{ furniture_current }}
			</el-card>
		</div>
	</div>


	<div class="manyFurnitureWrapper" v-if="!isOne">
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
				<el-option v-for="salon, index in salonsListFurniture" :key="index" :label="salon.NAME" :value="salon.id" />
			</el-select>
		</transition>

		<transition name="fade">
			<el-select v-model="currentFurnitureModel" filterable placeholder="Наименование" v-loading="furniture_loadingModels" v-if="currentTab == 0">
				<el-option v-for="model, index in furniture_models" :key="index" :label="model.MODEL" :value="model.MODEL" />
			</el-select>
		</transition>

		<tabless
			v-loading="furniture_loading"
			key="salon"
			:data="furniture_cached"
			:fieldDescription="furnitureSalonFieldDescription"
			ref="table"
			@filter="localFurnitureFilterChange"
			@sortChange="localFurnitureSortChange"
			@onClick="routerGoId"
		/>

		<infinite-loading @infinite="furniture_infinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="furniture_loadingBottom" />
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
			this.furniture_filtersChange (Object.assign({}, this.lastFurnitureFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		currentSalon (n) {
			if (n == 999) n = null

			this.furniture_getModels(this.currentSalon)
		},
		furniture_models () {
			this.currentFurnitureModel = ""
		},
		oneId (n) {
			if (n != undefined)
				this.furniture_getOne(n)
		}
	},
	computed: {
		...mapGetters([
			'salonsListFurniture',
			'salonsListLoading',
			'currentUserSalon',
			'furniture_loadingModels',
			'furniture_loadingBottom',
			'furniture_loadingOne',
			'furniture_loading',
			'furniture_cached',
			'furniture_current',
			'furniture_models',
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
			'furniture_init',
			'furniture_sortChange',
			'furniture_filtersChange',
			'furniture_infinity',
			'furniture_getModels',
			'furniture_getOne',
			'getSalonsList'
		]),
		localFurnitureFilterChange (n) {
			this.lastFurnituresFilters = n
			this.furniture_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localFurnitureSortChange (n) {
			this.furniture_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.currentSalon = this.currentUserSalon
		this.furniture_init(this.oneId)
		this.getSalonsList()
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
