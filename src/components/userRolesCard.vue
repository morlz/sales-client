<template>
	<el-card class="card userRoles">
		<h2 class="title" slot="header">Роли</h2>

		<el-transfer
			:titles="['Все', 'Выбраные']"
			v-model="local_personal_currentRolesSetup"
			:data="transferData"
		/>

		<div class="buttons">
			<el-button type="primary" @click="personal_saveRoleSetupState" v-if="auth_can(3, 'RoleSetup')">Сохранить выбраные роли</el-button>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	data () {
		return {}
	},
	methods: {
		...mapActions([
			'personal_saveRoleSetupState'
		]),
		...mapMutations([
			'personal_currentRolesSetupSet'
		]),
	},
	computed: {
		...mapGetters([
			'personal_currentRoleSetup',
			'personal_roles',
			'personal_current'
		]),
		transferData () {
			return this.personal_roles.map(role => {
				return {
					key: role.id,
					label: role.name
				}
			})
		},
		local_personal_currentRolesSetup: {
			get () {
				return this.personal_currentRoleSetup.map(setup => +setup.role_id)
			},
			set (val) {
				this.personal_currentRolesSetupSet( val.map( role_id => ( { role_id, manager_id: this.personal_current.ID_M } ) ) )
			}
		}
	},
}
</script>


<style lang="less">
	.userRoles {
		.el {

		}
	}
</style>
