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
				<div class="fio">{{ fio }}</div>
				<div class="dol">{{ loginedAs.UPOST }}</div>
				<div class="salon">{{ loginedAs.UPOST }}</div>
			</div>
			<div class="buttons">
				<el-button>Задачи</el-button>
				<el-button>Заказы</el-button>
				<el-button @click="goToProfile">Профиль</el-button>
				<el-button type="danger" @click="logOut">Выйти</el-button>
			</div>
		</div>
	</el-popover>

	<div v-popover:popoverProfie class="name">{{ fio }}</div>
</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
	methods: {
		...mapMutations([]),
		...mapActions([
			'logOut'
		]),
		goToProfile () {
			router.push({ path: `/profile/${this.loginedAs.id}` })
		}
	},
	computed: {
		...mapGetters([
			'loginedAs'
		]),
		fio () {
			return `${this.loginedAs.FIO} ${this.loginedAs.IMY} ${this.loginedAs.OTCH}`
		}
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
		background-color: #027be3;
		&:hover {
			background-color: #1565c0;
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
