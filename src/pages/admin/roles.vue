<template>
	<div class="mainWrapper adminRolesWrapper">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/admin/roles` }">Роли</el-breadcrumb-item>
		</el-breadcrumb>

		<el-tabs tab-position="top">
			<el-tab-pane label="Изменение ролей">
				<div class="cards">
					<el-card class="card">
						<div class="title" slot="header">Добавить роль</div>

						<div class="buttons">
							<el-button type="primary">Добавить</el-button>
						</div>
					</el-card>

					<el-card class="card">
						<div class="title" slot="header">Список ролей</div>


					</el-card>
				</div>

			</el-tab-pane>

			<el-tab-pane label="Присвоение ролей пользователям">

			</el-tab-pane>
		</el-tabs>
	</div>
</template>



<script>

export default {

}

</script>



<style lang="less">

.adminRolesWrapper {
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 20px;
		padding: 10px;

		h2 {
			margin: 0;
			font-size: 18px;
			font-weight: bold;
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
