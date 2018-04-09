<template>
<q-page class="permissions">
	<q-tabs class="permissions__tabs">
		<q-tab slot="title" name="roles" label="Роли" default/>
		<q-tab slot="title" name="groups" label="Группы салонов"/>

		<q-tab-pane name="roles" class="permissions__inner">
			<permissions-roles/>
		</q-tab-pane>

		<q-tab-pane name="groups" class="permissions__inner">
			<permissions-groups/>
		</q-tab-pane>
	</q-tabs>
</q-page>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import PermissionsRoles from '@/components/PermissionsRoles'
import PermissionsGroups from '@/components/PermissionsGroups'

import { QTabs, QTab, QTabPane } from 'quasar'

export default {
	components: {
		QTabs,
		QTab,
		QTabPane,
		PermissionsRoles,
		PermissionsGroups
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {

	},
	methods: {
		...mapMutations([
			'app_layout_headerShadowSet'
		])
	},
	mounted () {
		this.app_layout_headerShadowSet(false)
	},
	beforeDestroy() {
		this.app_layout_headerShadowSet(true)
	}
}
</script>


<style lang="less">
.permissions {
	height: 100%;
	background: #EEEEEE;

	.q-tabs-panes {
		height: 100%;
	}

	&__tabs {
		display: grid;
		grid-template-rows: 50px ~"calc(100% - 50px)";
		.q-tabs-head {
			box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2),
						0 4px 5px rgba(0,0,0,0.14),
						0 1px 10px rgba(0,0,0,0.12);
		}

		height: 100%;
	}

	&__inner {
		height: 100%;
		overflow-y: auto;
	}
}
</style>
