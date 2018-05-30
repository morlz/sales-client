<template>
<q-page class="AppContent" v-if="auth_can(1, 'Manager')">
	<div class="onePersonalWrapper" v-if="isOne" v-loading="personal_loadingOne">
		<div class="cards AppContent__inner">
			<manager-profile-card :content="personal_current"/>

			<manager-roles-card v-if="auth_can(1, 'RoleSetup')" />
			<manager-groups-card v-if="auth_can(1, 'RoleSetup')" :manager-id="$route.params.id"/>
			<manager-salons-card v-if="auth_can({
				'Salon': 1,
				'SalonsSetup': 1
			})"/>
		</div>
	</div>

	<div class="manyPersoalWrapper" v-if="!isOne">
		<q-card class="manyPersoalWrapper__card AppContent__inner">
			<infinite-table
				:columns="AdminPersonal"
				:rows="personal_cached"
				:complete="personal_complete"
				:filter-values="personal_filters"
				@infinite="personal_infinity"
				@click="routerGoId"
				@sort="local_personal_sortChange"
				@filter="local_personal_filtersChange"
			/>
		</q-card>
	</div>
</q-page>
</template>

<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

import { AuthMixin, RouteMixin } from '@/mixins'
import InfiniteTable from '@/components/InfiniteTable'
import { AdminPersonal } from '@/static/fieldDescription'
import ManagerProfileCard from '@/components/ManagerProfileCard'
import ManagerRolesCard from '@/components/ManagerRolesCard'
import ManagerGroupsCard from '@/components/ManagerGroupsCard'
import ManagerSalonsCard from '@/components/ManagerSalonsCard'

export default {
	mixins: [AuthMixin, RouteMixin],
	components: {
		InfiniteTable,
		ManagerProfileCard,
		ManagerRolesCard,
		ManagerGroupsCard,
		ManagerSalonsCard
	},
	data() {
		return {
			AdminPersonal
		}
	},
	watch: {
		oneId (n) {
			if (n) this.personal_init(n)
		}
	},
	computed: {
		...mapGetters([
			"personal_loadingBottom",
			"personal_loading",
			"personal_cached",
			'personal_current',
			'personal_loadingOne',
			'personal_filters',
			'personal_complete'
		])
	},
	methods: {
		...mapActions([
			"personal_infinity",
			'personal_filtersChange',
			'personal_sortChange',
			'personal_init',
			'personal_getRoleSetup'
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'personal_destroy'
		]),
		local_personal_filtersChange (n) {
			this.personal_filtersChange(n)
		},
		local_personal_sortChange (n) {
			this.personal_sortChange(n)
		}
	},
	async mounted() {
		await this.personal_init(this.oneId)
		if (this.oneId && this.auth_can(1, 'RoleSetup'))
			this.personal_getRoleSetup(this.oneId)
	},
	beforeDestroy () {
		this.personal_destroy()
	}
}
</script>



<style lang="less">
.onePersonalWrapper {
	.cards {
		display: grid;
		grid-gap: 10px;
		padding: 10px;
		grid-template-columns: 1fr 1fr;
	}
}

.manyPersoalWrapper {
	width: 100%;
	height: 100%;
	padding-top: 8px;

	&__card {
		margin-top: 0;
		height: ~"calc(100vh - 68px)";
	}
}


@media screen and (max-width: 1050px) {
	.onePersonalWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}
</style>
