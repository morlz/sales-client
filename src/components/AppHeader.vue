<template>
	<q-toolbar class="header">
		<q-btn class="header__menuToggle" @click="nav_openToggle" v-if="!app_view_desktop" flat icon="menu"/>
		<q-toolbar-title> {{ route.meta.name }}</q-toolbar-title>
		<app-header-popup-salon class="header__popupSalon"/>
		<app-header-popup-cart class="header__popupCart"/>
		<app-header-popup-profile class="header__popupProfile"/>
	</q-toolbar>
</template>

<script>
import {
	mapMutations,
	mapGetters,
	mapActions,
	mapState
} from 'vuex'
import AppHeaderPopupProfile from '@/components/AppHeaderPopupProfile.vue'
import AppHeaderPopupCart from '@/components/AppHeaderPopupCart.vue'
import AppHeaderPopupSalon from '@/components/AppHeaderPopupSalon.vue'
/**
 invoice - заказы
 SP_OTGRUZOK - доставки
 */

import { QToolbar, QToolbarTitle, QBtn } from 'quasar'


export default {
	data () {
		return {
			autoMenuCollapce: false,
			autoBenuCollapceState: true
		}
	},
	components: {
		AppHeaderPopupProfile,
		AppHeaderPopupCart,
		AppHeaderPopupSalon,
		QToolbar,
		QToolbarTitle,
		QBtn
	},
	watch: {
		autoMenuCollapce (n) {
			this.changeMenuFixed(n)
		},
		autoBenuCollapceState (n) {
			this.changeMenuFixedState(n)
		}
	},
	computed: {
		...mapState([
			'route'
		]),
		...mapGetters([
			'app_view_desktop'
		])
	},
	methods: {
		...mapMutations([
			'nav_openToggle',
			'changeMenuFixed',
			'changeMenuFixedState'
		])
	},
}
</script>




<style lang="stylus">
.header
	height 50px
	display grid
	align-items center
	grid-template-columns max-content 1fr max-content max-content max-content

	&__popupProfile
	&__popupCart
	&__popupSalon
		justify-self end

</style>
