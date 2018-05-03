<template>
	<q-card class="card userRoles" v-if="auth_can(1, 'RoleSetup')">
		<q-card-title>
			Роли
		</q-card-title>

		<q-card-main>
			<q-list>
				<q-item v-for="item, index in transferData" :key="index">
					<q-item-main>
						<q-checkbox
							:value="local_personal_currentRolesSetup.includes(item.key)"
							:label="item.label"
							@input="local_personal_currentRolesSetupSet($event, item.key)"/>
					</q-item-main>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary"@click="personal_saveRoleSetupState" v-if="auth_can(4, 'RoleSetup')">Сохранить выбраные группы и роли</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import { QCheckbox } from 'quasar'

export default {
	mixins: [AuthMixin],
	components: {
		QCheckbox
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
	methods: {
		...mapActions([
			'personal_saveRoleSetupState',
			'permissions_getRoles',
		]),
		...mapMutations([
			'personal_currentRolesSetupSet'
		]),
		local_personal_currentRolesSetupSet (n, role_id) {
			this.local_personal_currentRolesSetup = n ?
				[...this.local_personal_currentRolesSetup, role_id]
			:	this.local_personal_currentRolesSetup.filter(el => el != role_id)
		}
	},
	created () {
		this.permissions_getRoles()
	}
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
