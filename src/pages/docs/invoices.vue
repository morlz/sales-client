<template>
	<div class="mainWrapper">
		<el-tabs tab-position="top">
			<el-tab-pane label="Все" />
			<el-tab-pane label="Счета" />
			<el-tab-pane label="Оплаченые" />
			<el-tab-pane label="В работе" />
			<el-tab-pane label="Отгружено" />
			<el-tab-pane label="Отказ" />
		</el-tabs>

		<tabless
			key="invoices"
			:data="data"
			:fieldDescription="invoicesFieldDescription"
			ref="table"
		/>
		<infinite-loading @infinite="invoicesInfinity" ref="infiniteLoading" key="invoicesinf">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="loadingBottomInvoices" />
		</infinite-loading>
	</div>
</template>



<script>


/**
 * 			@onClick="routerGoId"
 			@filter="localClientFilterChange"
 			@sortChange="localClientSortChange"
 */


import { mapGetters, mapActions, mapMutations } from 'vuex'
import tabless from '@/components/tableSS.vue'
import fieldDesription from '@/static/fieldDescription'
import InfiniteLoading from 'vue-infinite-loading'

let {
	invoicesFieldDescription
} = fieldDesription

export default {
	data () {
		return {
			invoicesFieldDescription
		}
	},
	components: {
		tabless,
		InfiniteLoading
	},
	computed: {
		...mapGetters([
			'loadingBottomInvoices',
			'cachedInvoices'
		]),
		data () {
			return this.cachedInvoices
		}
	},
	methods: {
		...mapActions([
			'invoicesInfinity'
		])
	},
	mounted () {
		setTimeout(() => {
			if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
		}, 1e3)
	}
}

</script>



<style lang="less" scoped>


</style>
