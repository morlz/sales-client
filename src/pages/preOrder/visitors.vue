<template>
	<q-page class="AppContent" v-if="auth_can(1, 'Visitor')">
		<q-card class="Visitors__card AppContent__inner">
			<infinite-table
				:columns="CRMVisitors"
				:rows="visitor_cached"
				:complete="visitor_complete"
				:filter-values="visitor_filters"
				@infinite="visitor_infinity"
				@sort="local_visitor_sortChange"
				@filter="local_visitor_filtersChange"
				no-row-click
			>
				<q-icon
					slot="buttons"
					slot-scope="{ row }"
					color="negative"
					name="delete"
					v-if="row.canRemove && auth_can(4, 'Visitor') && row.manager_id == auth_user.id"
					/>
			</infinite-table>
		</q-card>
	</q-page>
</template>


<script>
import { CRMVisitors } from '@/static/fieldDescription'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import InfiniteTable from '@/components/InfiniteTable'

import { AuthMixin } from '@/mixins'

export default {
	data () {
		return {
			CRMVisitors,
			lastVisitorsFilters: {},
			searchByPhone: "",
			searchByPhone2: "",
			seachTimeout: false
		}
	},
	mixins: [AuthMixin],
	components: {
		InfiniteTable,
	},
	watch: {
		async additionalFilters (n) {
			await this.visitor_filtersChange (Object.assign({}, this.lastVisitorsFilters, n))
		}
	},
	computed: {
		...mapGetters([
			'visitor_cached',
			'visitor_loading',
			'visitor_filters',
			'visitor_complete',
			'app_view_mobile',
			'auth_user'
		]),
		additionalFilters () {
			return {}
		}
	},
	methods: {
		...mapActions([
			'visitor_init',
			'visitor_getOne',
			'visitor_infinity',
			'visitor_sortChange',
			'visitor_filtersChange',
			'visitor_destroy'
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
		]),
		async local_visitor_filtersChange (n) {
			this.lastVisitorsFilters = n
			await this.visitor_filtersChange (Object.assign({}, this.additionalFilters, n))
		},
		async local_visitor_sortChange (n) {
			await this.visitor_sortChange (n)
		}
	},
	mounted(){
		//this.app_layout_headerShadowSet(false)
		this.lastVisitorsFilters = this.visitor_filters
	},
	async created () {
		await this.visitor_init()
	},
	beforeDestroy () {
		//this.app_layout_headerShadowSet(true)
		this.visitor_destroy()
	}
}

</script>



<style lang="stylus">

</style>
