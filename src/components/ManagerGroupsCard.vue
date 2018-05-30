<template>
	<q-card class="ManagerGroupsCard" v-if="auth_can(1, 'SalonGroupSetup')">
		<q-card-title>
			Группы салонов
		</q-card-title>

		<q-card-main>
			<q-list>
				<q-item v-for="group, index in salonGroups_list" :key="index">
					<q-item-main>
						<q-checkbox
							:value="salonGroups_checked.includes(group.id)"
							:label="group.name"
							@input="salonGroups_groupsSetupSet({ value: $event, group_id: group.id, manager_id: managerId })"/>
					</q-item-main>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary"@click="salonGroups_saveState(managerId)" v-if="auth_can(4, 'SalonGroupSetup')">Сохранить выбраные группы</q-btn>
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
			this.salonGroups_init(this.managerId)
		}
	},
	computed: {
		...mapGetters ('salonGroups', [
			'salonGroups_list',
			'salonGroups_checked'
		])
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_groupsSetupSet',
			'salonGroups_init',
			'salonGroups_saveState'
		]),
	},
	created () {
		this.salonGroups_init(this.managerId)
	}
}
</script>


<style lang="stylus">

</style>
