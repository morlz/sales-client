<template>
<div class="profileWrapper">

	<q-popover ref="popoverProfie">
		<div class="profileModalWrapper">
			<div class="bg">
				<div class="avatar"></div>
				<div class="fio">{{ fio }}</div>
				<div class="dol">{{ loginedAs.UPOST }}</div>
				<div class="salon">{{ auth_currentSalon ? auth_currentSalon.NAME : '...' }}</div>
			</div>
			<div class="buttons">
				<q-btn flat>Задачи</q-btn>
				<q-btn flat>Заказы</q-btn>
				<q-btn flat @click="goToProfile">Профиль</q-btn>
				<q-btn flat color="negative" @click="logOut">Выйти</q-btn>
			</div>
		</div>
	</q-popover>

	<q-btn class="name" flat wait-for-ripple>
		<q-icon name="account_circle" v-if="app_view_mobile"/>
		{{ app_view_mobile ? '' : fio }}
	</q-btn>
</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { QBtn, QIcon, QPopover } from 'quasar'

export default {
	components: {
		QBtn,
		QIcon,
		QPopover
	},
	methods: {
		...mapMutations([]),
		...mapActions([
			'logOut'
		]),
		goToProfile () {
			router.push({ path: `/admin/personal/${this.loginedAs.ID_M}` })
		}
	},
	computed: {
		...mapGetters([
			'loginedAs',
			'app_view_mobile',
			'auth_currentSalon'
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
		transition: all 0.3s ease-in-out;
		&:hover {
			background-color: #1565c0;
		}
	}
}
.profileModalWrapper {
	display: grid;
	grid-auto-flow: row;
	width: 500px;
	max-width: ~"calc(100vw - 15px)";
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
		grid-template-columns: repeat(auto-fit, minmax(100px, auto));
		grid-gap: 10px;
		justify-items: center;
	}
}
</style>
