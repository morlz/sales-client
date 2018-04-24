<template>
<div class="profileWrapper">
	<q-popover ref="popoverProfie">
		<q-card>
			<q-card-media>
				<img :src="avatar"/>
			</q-card-media>

			<q-card-title>{{ fio }}</q-card-title>

			<q-card-main>
				<q-list no-border>
					<q-item>
						<q-item-main>Должность</q-item-main>
						<q-item-side right>{{ loginedAs.UPOST }}</q-item-side>
					</q-item>

					<q-item>
						<q-item-main>Салон</q-item-main>
						<q-item-side right>
							<preview-salon :content="auth_currentSalon"/>
						</q-item-side>
					</q-item>
				</q-list>
			</q-card-main>

			<q-card-actions>
				<q-btn flat>Задачи</q-btn>
				<q-btn flat>Заказы</q-btn>
				<q-btn flat @click="goToProfile">Профиль</q-btn>
				<q-btn flat color="negative" @click="logOut">Выйти</q-btn>
			</q-card-actions>
		</q-card>
	</q-popover>

	<q-btn class="name" flat wait-for-ripple>
		<q-icon name="account_circle" v-if="app_view_mobile"/>
		{{ app_view_mobile ? '' : fio }}
	</q-btn>
</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PreviewSalon from '@/components/PreviewSalon'


export default {
	components: {
		PreviewSalon
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
		},
		avatar () {
			return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
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
