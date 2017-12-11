<template>
<div class="profileWrapper">

	<el-popover
		ref="popoverProfie"
		class="modal"
		placement="bottom"
		trigger="click"
	>
		<div class="profileModalWrapper">
			<div class="bg">
				<div class="avatar"></div>
				<div class="fio">{ user.fio }</div>
				<div class="dol">{ user.dolznost }</div>
				<div class="salon">{ salon.name }</div>
			</div>
			<div class="buttons">
				<el-button>Задачи</el-button>
				<el-button>Заказы</el-button>
				<el-button>Профиль</el-button>
				<el-button type="danger">Выйти</el-button>
			</div>
		</div>
	</el-popover>

	<div v-popover:popoverProfie class="name">{ user.name }</div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	methods: {
		...mapMutations([])
	}
}
</script>


<style lang="less" scoped>
.profileWrapper {
	> .name {
		cursor: pointer;
		box-sizing: border-box;
		color: #fff;
		height: 50px;
		line-height: 50px;
		padding: 0 20px;
		transition: all 0.3s ease-in-out;
		background-color: #3c8dbc;
		&:hover {
			background-color: #367fa9;
		}
	}
}
.profileModalWrapper {
	display: grid;
	grid-auto-flow: row;
	.bg {
		display: grid;
		justify-content: center;
		text-align: center;
		.avatar {
			width: 100px;
			height: 100px;
			border-radius: 50px;
			background-position: center;
			background-size: cover;
			border: 3px solid rgba(0, 0, 0, 0.1);
			margin: 10px;
		}
	}
	.buttons {
		margin-top: 10px;
		padding: 10px;
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
		justify-items: center;
	}
}
</style>
