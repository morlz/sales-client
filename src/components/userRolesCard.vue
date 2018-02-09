<template>
	<el-card class="card userRoles">
		<h2 class="title" slot="header">Роли</h2>

		<el-transfer
			:titles="['Все', 'Выбраные']"
			v-model="local_personal_currentRolesSetup"
			:data="transferData"
		/>

		<div class="buttons">
			<QBtn color="primary" @click="personal_saveRoleSetupState" v-if="auth_can(3, 'RoleSetup')">Сохранить выбраные роли</QBtn>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import { QBtn } from 'quasar'

export default {
	mixins: [mixins],
	components: {
		QBtn
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
			&-transfer {
				display: grid;
				grid-template-columns: 1fr 56px 1fr;
				justify-items: stretch;
				grid-gap: 10px;
				width: 100%;
				&__buttons {
					padding: 0 10px;
					width: 36px;
					display: grid;
					align-items: center;
					align-content: center;
					grid-gap: 10px;
					button {
						margin: 0;
					}
				}
				&-panel {
					height: 100%;
					display: grid;
					grid-auto-flow: row;
					grid-template-rows: ~"min-content" 1fr;
					width: auto;
					//min-width: 100px;
					overflow-x: hidden;
					&__body, &__list {
						height: 100%;
					}
				}
			}
		}
	}
</style>
