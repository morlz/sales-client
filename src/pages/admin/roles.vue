<template>
<div class="mainWrapper adminRolesWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/admin/roles` }">Роли</el-breadcrumb-item>
	</el-breadcrumb>


	<div class="roleBoxWrapper">
		<div class="roleBox">
			<div class="roles">
				<div class="title">
					Список всех ролей
					<el-input class="create" placeholder="Имя новой роли" @change="permissions_setAddRole" />
				</div>
				<div class="button">
					<el-button>Добавить роль</el-button>
				</div>
				<div class="list">
					<div class="list__item">
						<div>Ид</div>
						<div>Название</div>
						<div>Уровень доступа</div>
						<div>Действия</div>
					</div>
					<div class="list__item" v-for="item, index in local_permissions_roles" :class="{selected: item.selected}" @click="permissions_selectItem({ type: 'roles', id: item.id})" :key="item.id">
						<div>{{ item.id }}</div>
						<div>{{ item.name }}</div>
						<div class="slider" :class="{hide: permissions_rolesSliderHide}" @click="stopProp" v-if="sliders.roles[index]">
							<el-slider v-model="sliders.roles[index].level" :step="1" :max="5" @change="permissions_roleLevelChange({ e: $event, item })"/>
						</div>
						<div class="buttons">
							<el-button size="small">Изменить</el-button>
							<el-button size="small">Удалить</el-button>
						</div>
					</div>
				</div>
			</div>

			<div class="controllers">
				<div class="title">
					Список контроллеров
					<el-input class="create" placeholder="Имя нового контроллера" @change="permissions_setAddController" />
				</div>
				<div class="button">
					<el-button>Добавить контроллер</el-button>
				</div>
				<div class="list">
					<div class="list__item">
						<div>Ид</div>
						<div>Имя контроллера</div>
						<div>Уровень доступа</div>
						<div>Действия</div>
					</div>
					<div class="list__item" v-for="item, index in permissions_controllers" :class="{selected: item.selected}" @click="permissions_selectItem({ type: 'controllers', id: item.id})" :key="item.id">
						<div>{{ item.id }}</div>
						<div>{{ item.name }}</div>
						<div class="slider" :class="{hide: permissions_controllersSliderHide}" @click="stopProp" v-if="sliders.controllers[index]">
							<el-slider v-model="sliders.controllers[index].level" :step="1" :max="5" @change="permissions_controllerLevelChange({ e: $event, item })"/>
						</div>
						<div class="buttons">
							<el-button size="small">Удалить</el-button>
						</div>
					</div>
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

export default {
	data() {
		return {
			sliders: {
				roles: [],
				controllers: []
			}
		}
	},
	methods: {
		...mapActions([
			'permissions_init',
			'permissions_roleLevelChange',
			'permissions_controllerLevelChange'
		]),
		...mapMutations([
			'permissions_selectItem',
			'permissions_setAddRole',
			'permissions_setAddController'
		]),
		stopProp: e => e.stopPropagation()
	},
	computed: {
		...mapGetters([
			'permissions_managers',
			'permissions_roles',
			'permissions_controllers',
			'permissions_ranges',
			'permissions_selectedType',
			'permissions_rolesSliderHide',
			'permissions_controllersSliderHide',
		]),
		local_permissions_roles () {
			this.sliders.roles = this.permissions_roles.map(({ id, level }) => ({ id, level }))
			return this.permissions_roles
		}
	},
	mounted() {
		this.permissions_init()
	}
}
</script>



<style lang="less">
.adminRolesWrapper {
    .roleBoxWrapper {
        .roleBox {
            width: 100%;
            display: grid;
            grid-gap: 30px;
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
                    grid-auto-flow: column;
                    grid-template-columns: 30px 30px 1fr 100px;
                    align-items: center;
                    grid-gap: 10px;
                    box-shadow: 0 1.6px 4px 0 rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease-in-out;
                    > div {
                        transition: all 0.3s ease-in-out;
                    }
                    .buttons {
                        justify-self: end;
                    }
                    .slider {
                        transition: all 0.3s ease-in-out;
                        justify-self: stretch;
                    }
                }
                .hide {
                    opacity: 0;
                    pointer-events: none;
                }
                .selected {
                    box-shadow: 0 2px 5px 0 rgba(64, 158, 255, 1);
                }
            }
            .roles {
                .list {
                    &__item {
                        grid-template-columns: 30px 1fr 1fr 180px;
                    }
                }
            }
            .selectedController {
                .list {
                    &__item {
                        grid-template-columns: 30px 1fr 1fr 180px;
                    }
                }
            }
            .controllers {
                .list {
                    &__item {
                        grid-template-columns: 30px 1fr 1fr 100px;
                    }
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
