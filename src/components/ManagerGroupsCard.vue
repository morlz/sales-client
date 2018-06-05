<template>
	<q-card class="ManagerGroupsCard" v-if="auth_can(1, 'SalonGroupSetup')">
		<q-card-title>
			Группы салонов
		</q-card-title>

		<q-card-main>
			<q-list>
				<q-item v-for="group, index in managerGroups_list" :key="index">
					<q-item-main>
						<q-checkbox
							:value="managerGroups_checked.includes(group.id)"
							:label="group.name"
							@input="managerGroups_groupsSetupSet({ value: $event, group_id: group.id, manager_id: managerId })"/>
					</q-item-main>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary"@click="managerGroups_saveState(managerId)" v-if="auth_can(4, 'SalonGroupSetup')">Сохранить выбраные группы</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'

export default {
	mixins: [AuthMixin],
	props: {
		managerId: [String, Number]
	},
	watch: {
		managerId () {
			this.managerGroups_init(this.managerId)
		}
	},
	computed: {
		...mapGetters ('managerGroups', [
			'managerGroups_list',
			'managerGroups_checked'
		])
	},
	methods: {
		...mapActions('managerGroups', [
			'managerGroups_groupsSetupSet',
			'managerGroups_init',
			'managerGroups_saveState'
		]),
	},
	created () {
		this.managerGroups_init(this.managerId)
	}
}
</script>


<style lang="stylus">

</style>
