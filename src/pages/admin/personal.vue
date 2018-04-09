<template>
<q-page class="AppContent" v-if="auth_can(1, 'Manager')">
	<div class="onePersonalWrapper" v-if="isOne" v-loading="personal_loadingOne">
		<div class="cards AppContent__inner">
			<manager-profile-card :content="personal_current"/>

			<manager-roles-card v-if="auth_can(1, 'RoleSetup')" />
		</div>
	</div>

	<div class="manyPersoalWrapper" v-if="!isOne">
		<q-card class="manyPersoalWrapper__card AppContent__inner">
			<tabless
				key="personal"
				:data="personal_cached"
				:complete="personal_complete"
				:field-description="personalFieldDescription"
				:filters="personal_filters"
				ref="table"
				@filter="local_personal_filtersChange"
				@sort="local_personal_sortChange"
				@click="routerGoId"
				@infinite="personal_infinity"
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

import mixins from '@/mixins'
import tabless from '@/components/tableSSNew'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'
import ManagerProfileCard from '@/components/ManagerProfileCard'
import ManagerRolesCard from '@/components/ManagerRolesCard'
import { QCard } from 'quasar'

let {
	personalFieldDescription
} = fieldDesription

export default {
	mixins: [mixins],
	components: {
		InfiniteLoading,
		tabless,
		ManagerProfileCard,
		ManagerRolesCard,
		QCard
	},
	data() {
		return {
			personalFieldDescription
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
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'personal_destroy'
		]),
		local_personal_filtersChange (n) {
			this.personal_filtersChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		},
		local_personal_sortChange (n) {
			this.personal_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
			})
		}
	},
	async mounted() {
		await this.personal_init(this.oneId)
		if (this.$refs.infiniteLoading)
			this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
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
