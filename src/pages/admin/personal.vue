<template>
<div class="mainWrapper personalWrapper" v-if="auth_can(1, 'Manager')">
	<div class="onePersonalWrapper" v-if="isOne" v-loading="personal_loadingOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/admin/personal` }">Персонал</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/admin/personal/${personal_current.id}` }">{{ personal_current.FIO }}</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="cards">
			<user-profile-card :content="personal_current"/>

			<user-roles-card v-if="auth_can(1, 'RoleSetup')" />
		</div>
	</div>

	<div class="manyPersoalWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/admin/personal` }">Персонал</el-breadcrumb-item>
		</el-breadcrumb>

		<tabless
			v-loading="personal_loading"
			key="personal"
			:data="personal_cached"
			:fieldDescription="personalFieldDescription"
			ref="table"
			@filter="local_personal_filtersChange"
			@sortChange="local_personal_sortChange"
			@onClick="routerGoId"
		/>

		<infinite-loading @infinite="personal_infinity" ref="infiniteLoading">
			<div class="end" slot="no-results" />
			<div class="end" slot="no-more" />
			<div class="spinner" slot="spinner" v-loading="personal_loadingBottom" />
		</infinite-loading>
	</div>
</div>
</template>

<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'
import userProfileCard from '@/components/userProfileCard.vue'
import userRolesCard from '@/components/userRolesCard.vue'

let {
	personalFieldDescription
} = fieldDesription

export default {
	mixins: [mixins],
	components: {
		InfiniteLoading,
		tabless,
		userProfileCard,
		userRolesCard
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
	methods: {
		...mapActions([
			"personal_infinity",
			'personal_filtersChange',
			'personal_sortChange',
			'personal_init'
		]),
		...mapMutations([

		]),
		local_personal_filtersChange (n) {
			this.personal_filtersChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_personal_sortChange (n) {
			this.personal_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	computed: {
		...mapGetters([
			"personal_loadingBottom",
			"personal_loading",
			"personal_cached",
			'personal_current',
			'personal_loadingOne'
		])
	},
	mounted() {
		this.personal_init(this.oneId)
	}
}
</script>



<style lang="less">
.personalWrapper {
	.cards {
		display: grid;
		grid-gap: 10px;
		padding: 10px;
		grid-template-columns: 1fr 1fr;

	}
}


@media screen and (max-width: 1050px) {
	.personalWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}
</style>
