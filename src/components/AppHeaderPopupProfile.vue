<template>
<div class="AppHeaderProfile">
	<q-popover ref="AppHeaderProfilePopover" max-height="90vh">
		<q-card>
			<q-card-media v-if="loginedAs.avatar">
				<div
					class="AppHeaderProfilePopover__avatar"
					:style="{ backgroundImage: `url(${loginedAs.avatar.href})` }"/>
			</q-card-media>

			<q-card-title>{{ loginedAs.fio }}</q-card-title>

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

	<q-btn class="AppHeaderProfile__name" flat wait-for-ripple color="white">
		<q-icon name="account_circle" v-if="app_view_mobile"/>
		{{ app_view_mobile ? '' : loginedAs.fio }}
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
	}
}
</script>


<style lang="stylus" scoped>
.AppHeaderProfile
	&__name
		cursor pointer
		box-sizing border-box
		transition all 0.3s ease-in-out

.AppHeaderProfilePopover
	&__avatar
		width 200px
		height 200px
		border-radius 100px
		background-position center
		background-size cover
		border 3px solid rgba(0, 0, 0, 0.1)
		margin 10px auto


</style>
