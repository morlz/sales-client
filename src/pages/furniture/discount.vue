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

		<el-select v-model="currentFurnitureModel" filterable placeholder="Наименование" v-loading="furniture_loadingModels">
			<el-option v-for="model, index in furniture_models" :key="index" :label="model.MODEL" :value="model.MODEL" />
		</el-select>

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
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'

let {
	discountFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading
	},
	mixins: [mixins],
	data() {
		return {
			discountFieldDescription,
			currentFurnitureModel: "",
			lastDiscountFilters: {}
		}
	},
	watch: {
		additionalFIlters (n) {
			this.discount_filtersChange (Object.assign({}, this.lastDiscountFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		discount_models () {
			this.currentFurnitureModel = ""
		},
		oneId (n) {
			if (n != undefined)
				this.discount_getOne(n)
		}
	},
	computed: {
		...mapGetters([
			'furniture_loadingModels',
			'discount_loadingBottom',
			'discount_loadingOne',
			'discount_loading',
			'discount_cached',
			'discount_current',
			'furniture_models',
		]),
		data () {
			return this.cachedFurnitures
		},
		additionalFIlters () {
			return Object.assign({})
		}
	},
	methods: {
		...mapActions([
			'discount_init',
			'discount_sortChange',
			'discount_filtersChange',
			'discount_infinity',
			'furniture_getModels',
			'discount_getOne',
		]),
		localFurnitureFilterChange (n) {
			this.lastDiscountFilters = n
			this.discount_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localFurnitureSortChange (n) {
			this.discount_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted () {
		this.discount_init(this.oneId)
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
