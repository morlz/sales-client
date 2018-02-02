<template>
<div class="mainWrapper adminRolesWrapper" v-if="auth_can(1, 'Role')">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/admin/roles` }">Роли</el-breadcrumb-item>
	</el-breadcrumb>

	<div class="saveState">
		<el-button type="primary" @click="permissions_saveState" v-if="auth_can(3, 'ActionSetup')">Сохранить текущее состояние</el-button>
	</div>

	<div class="roleBoxWrapper">
		<div class="roleBox">
			<div class="roles" v-loading="permissions_loading_roles" v-if="auth_can(1, 'Role')">
				<div class="title">
					Список всех ролей
					<el-input class="create" placeholder="Имя новой роли" @change="permissions_setAddRole" v-if="auth_can(2, 'Role')" :class="{ 'create-show': permissions_addRoleFieldShow }" />
				</div>
				<div class="button">
					<el-button @click="permissions_createRole" v-if="auth_can(2, 'Role')">Добавить роль</el-button>
				</div>
				<div class="list">
					<div class="list__item">
						<div>Ид</div>
						<div>Название</div>
						<div>Уровень доступа</div>
						<div>Действия</div>
					</div>

					<permission-role v-for="item, index in permissions_roles" :content="item" :key="index+`-`+item.id+`-`+item.access_level"/>
				</div>
			</div>

			<div class="controllers" v-loading="permissions_loading_controllers" v-if="auth_can(1, 'Action')">
				<div class="title">
					Список контроллеров
					<el-input class="create" placeholder="Имя нового контроллера" @change="permissions_setAddController" v-if="auth_can(2, 'Action')" :class="{ 'create-show': permissions_addControllerFieldShow }" />
				</div>
				<div class="button">
					<el-button @click="permissions_createController" v-if="auth_can(2, 'Action')">Добавить контроллер</el-button>
				</div>
				<div class="list">
					<div class="list__item">
						<div>Ид</div>
						<div>Имя контроллера</div>
						<div>Уровень доступа</div>
						<div>Действия</div>
					</div>

					<permission-controller v-for="item, index in permissions_controllers" :content="item" :key="index+`-`+item.id+`-`+item.access_level"/>
				</div>
			</div>
		</div>
	</div>
</div>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

import permissionRole from '@/components/permissionRole.vue'
import permissionController from '@/components/permissionController.vue'
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	components: {
		permissionRole,
		permissionController
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
.adminRolesWrapper {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: min-content 1fr;
	.saveState {
		justify-self: end;
	}
	> div:not(:nth-child(1)):not(:nth-child(2)) {
		grid-column: 1 ~"/" 3;
	}
    .roleBoxWrapper {
        .roleBox {
            width: 100%;
            display: grid;
            grid-gap: 10px;
            grid-template-columns: repeat(2, 1fr);
            transition: all 0.3s ease-in-out;
            > div {
                display: grid;
                grid-template: "t b" "l l" ~"/" 1fr min-content;
                align-content: start;
                grid-gap: 10px;
                padding: 10px;
                overflow-y: auto;
                .title {
                    font-size: 24px;
                    position: relative;
                    justify-self: stretch;
                    .create {
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        transition: all 0.3s ease-in-out;
                        &:hover {
                            opacity: 1;
                        }
                    }
					.create-show {
						opacity: 1;
					}
                }
                .list {
                    margin-top: 10px;
                    grid-area: l;
                }
                .button {
                    justify-self: end;
                }
            }
            .list {
                display: grid;
                grid-auto-flow: row;
                grid-gap: 10px;
                &__item {
                    padding: 10px;
                    display: grid;
					grid-gap: 10px;
                    grid-auto-flow: column;
                    grid-template-columns: 30px 1fr 1fr min-content;
                    align-items: center;
					justify-items: center;
                    grid-gap: 10px;
                    box-shadow: 0 1.6px 4px 0 rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease-in-out;
                    > div {
                        transition: all 0.3s ease-in-out;
                    }
                    .buttons {
						display: grid;
						grid-auto-flow: column;
                        justify-self: end;
                    }
                    .slider {
                        transition: all 0.3s ease-in-out;
                        justify-self: stretch;
						padding: 0 10px;
                    }
					.name {
						justify-self: stretch;
						cursor: pointer;
						padding: 7px;
						border-bottom: 1px solid transparent;
						transition: all 0.3s ease-in-out;
						&:hover {
							border-bottom: 1px solid rgba(64, 158, 255, 1);
						}
					}
                }
				.edit {
					grid-template-columns: 30px 1fr 105px;
				}
                .hide {
                    opacity: 0;
                    pointer-events: none;
                }
                .selected {
                    box-shadow: 0 2px 5px 0 rgba(64, 158, 255, 0.5);
					background: rgba(64, 158, 255, 0.1);
                }
            }

        }
    }

}

@media screen and (max-width: 1250px) {
    .adminRolesWrapper {
        .cards {
            grid-template-columns: 1fr;
        }
    }
}
</style>
