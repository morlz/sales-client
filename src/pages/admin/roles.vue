<template>
	<div class="mainWrapper adminRolesWrapper">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/admin/roles` }">Роли</el-breadcrumb-item>
		</el-breadcrumb>


		<div class="roleBoxWrapper">
			<div class="roleBox" :class="{activeEdit: currentTab == 1}">
				<div class="managers">
					<div class="title">
						Персонал
					</div>
					<div class="button">

					</div>
					<div class="list">
						<div class="list__item">
							<div><el-checkbox :class="{hide: permissions_managersAllCheckBoxHide}" /></div>
							<div>Ид</div>
							<div>ФИО</div>
							<div>Действия</div>
						</div>
						<div class="list__item"
							v-for="item, index in permissions_managers"
							:class="{selected: item.selected}"
						 	@click="permissions_selectItem({ type: 'managers', id: item.ID_M})"
							>
							<div :class="{hide: !item.selectable}">
								<el-checkbox :value="item.checked"/>
							</div>
							<div>{{ item.ID_M }}</div>
							<div>{{ item.FIO }} {{ item.IMY }} {{ item.OTCH }}</div>
							<div class="buttons">
								<el-button size="small">Профиль</el-button>
							</div>
						</div>
					</div>
				</div>

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
							<div><el-checkbox :class="{hide: permissions_rolesAllCheckBoxHide}"/></div>
							<div>Ид</div>
							<div>Название</div>
							<div>Действия</div>
						</div>
						<div class="list__item"
							v-for="item, index in permissions_roles"
							:class="{selected: item.selected, selectedController: permissions_rolesShowRangeSelect}"
							@click="permissions_selectItem({ type: 'roles', id: item.id})"
							>
							<div :class="{hide: !item.selectable}" v-if="!permissions_rolesShowRangeSelect">
								<el-checkbox :value="item.checked"/>
							</div>
							<div>{{ item.id }}</div>
							<div>{{ item.name }}</div>
							<div v-if="permissions_rolesShowRangeSelect">
								<el-slider
									:value="item.level"
									:step="1"
									:max="5">
								</el-slider>
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
						<div class="list__item"
							v-for="item, index in permissions_controllers"
							:class="{selected: item.selected}"
							@click="permissions_selectItem({ type: 'controllers', id: item.id})"
							>
							<div>{{ item.id }}</div>
							<div>{{ item.name }}</div>
							<div class="slider" :class="{hide: !item.selectable}">
								<el-slider
									:value="item.level"
									:step="1"
									:max="5">
								</el-slider>
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
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	data () {
		return {
			currentTab: 0
		}
	},
	methods: {
		...mapActions([
			'permissions_init'
		]),
		...mapMutations([
			'permissions_selectItem',
			'permissions_setAddRole',
			'permissions_setAddController'
		])
	},
	computed: {
		...mapGetters([
			'permissions_managers',
			'permissions_roles',
			'permissions_controllers',
			'permissions_ranges',
			'permissions_selectedType',
			'permissions_managersAllCheckBoxHide',
			'permissions_rolesAllCheckBoxHide',
			'permissions_rolesShowRangeSelect'
		])
	},
	mounted () {
		this.permissions_init()
	}
}

</script>



<style lang="less">

.adminRolesWrapper {
	.roleBoxWrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		.roleBox {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: grid;
			grid-gap: 30px;
			grid-template-columns: repeat(3, 1fr);
			transition: all 0.3s ease-in-out;
			> div {
				display: grid;
				grid-template: 	"t b"
								"l l"
							~"/" 1fr min-content;
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
					box-shadow: 0 1.6px 4px 0px rgba(0, 0, 0, 0.2);
					transition: all 0.3s ease-in-out;
					> div {
						transition: all 0.3s ease-in-out;
					}
					.buttons {
						justify-self: end;
					}
					.slider {
						justify-self: stretch;
					}
				}
				.hide {
					opacity: 0;
					pointer-events: none;
				}
				.selected {
					box-shadow: 0 2px 5px 0px rgba(64, 158, 255, 1);
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
		.activeEdit {
			left: -50%;
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
