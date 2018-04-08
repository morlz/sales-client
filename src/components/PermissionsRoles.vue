<template>
<div class="permissionsRoles">
	<q-btn icon="save" color="primary" @click="permissions_saveState" class="permissionsRoles__save">Сохранить состояние</q-btn>

	<q-card class="permissionsRoles__addRole">
		<q-card-title>
			<h5>Добавить роль</h5>
		</q-card-title>

		<q-card-main>
			<q-input value="" @input="permissions_setAddRole" float-label="Имя новной роли"/>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="permissions_createRole" icon="check" flat>
				Добавить
			</q-btn>
		</q-card-actions>
	</q-card>

	<q-card class="permissionsRoles__addController">
		<q-card-title>
			<h5>Добавить действие</h5>
		</q-card-title>

		<q-card-main>
			<q-input value="" @input="permissions_setAddController" float-label="Имя нового действия"/>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="permissions_createController" icon="check" flat>
				Добавить
			</q-btn>
		</q-card-actions>
	</q-card>

	<q-card class="permissionsRoles__roles" v-loading="permissions_loading_roles">
		<q-card-title>
			<h5>Список ролей</h5>
		</q-card-title>

		<q-card-main>
			<q-list no-border>
				<permissions-roles-role v-for="item, index in permissions_roles" :key="item.id" :content="item"/>
			</q-list>
		</q-card-main>
	</q-card>


	<q-card class="permissionsRoles__controllers" v-loading="permissions_loading_controllers">
		<q-card-title>
			<h5>Список действий</h5>
		</q-card-title>

		<q-card-main>
			<q-list no-border>
				<permissions-roles-controller v-for="item, index in permissions_controllers" :key="item.id" :content="item"/>
			</q-list>
		</q-card-main>
	</q-card>
</div>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

import PermissionsRolesRole from '@/components/PermissionsRolesRole'
import PermissionsRolesController from '@/components/PermissionsRolesController'

import permissionRole from '@/components/permissionRole.vue'
import permissionController from '@/components/permissionController.vue'
import mixins from '@/mixins'

import { QList, QItem, QItemMain, QItemSide, QCheckbox, QItemTile, QCard, QCardMain, QCardTitle, QCardActions, QBtn, QField, QInput, QIcon } from 'quasar'

export default {
	mixins: [mixins],
	components: {
		QList, QItem, QItemMain, QItemSide, QCheckbox, QItemTile, QCard, QCardMain, QCardTitle, QCardActions, QBtn, QField, QInput, QIcon,
		permissionRole,
		permissionController,
		PermissionsRolesRole,
		PermissionsRolesController
	},
	methods: {
		...mapActions([
			'permissions_init',
			'permissions_createRole',
			'permissions_createController',
			'permissions_saveState'
		]),
		...mapMutations([
			'permissions_setAddRole',
			'permissions_setAddController'
		]),
	},
	computed: {
		...mapGetters([
			'permissions_managers',
			'permissions_roles',
			'permissions_controllers',
			'permissions_ranges',
			'permissions_selectedType',
			'permissions_loading_roles',
			'permissions_loading_controllers',
			'permissions_addRoleFieldShow',
			'permissions_addControllerFieldShow',
		])
	},
	mounted() {
		this.permissions_init()
	}
}
</script>



<style lang="less">
.permissionsRoles {
	display: grid;
	grid-template: max-content max-content max-content ~"/" 1fr 1fr;
	grid-gap: 10px;
	background: #EEEEEE;
	align-items: start;

	&__addRole, &__addController {
		.q-card-primary {
			padding: 16px 16px 0 16px;
		}
		.q-card-main {
			padding: 0 16px;
		}
	}

	&__roles, &__controllers, &__addRole, &__addController {
		background: #fff;
	}

	&__roles {

	}

	&__controllers {

	}

	&__save {
		grid-area: ~"1 / 1 / 2 / 3";
		justify-self: end;
	}
}


@media screen and (max-width: 600px) {
    .permissionsRoles {
        grid-template-columns: 1fr;
    }
}
</style>
