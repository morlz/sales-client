<template>
	<q-toolbar class="header">
		<q-btn class="header__menuToggle" @click="nav_openToggle" v-if="main_view_mobile" flat/>
		<q-toolbar-title>
		</q-toolbar-title>
		<app-header-popup-cart class="header__popupCart"/>
		<app-header-popup-profile class="header__popupProfile"/>
	</q-toolbar>
</template>

<script>
import {
	mapMutations,
	mapGetters,
	mapActions
} from 'vuex'
import AppHeaderPopupProfile from '@/components/AppHeaderPopupProfile.vue'
import AppHeaderPopupCart from '@/components/AppHeaderPopupCart.vue'
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
		...mapGetters([
			'main_view_mobile'
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




<style lang="less">

.header {
	display: grid;
	grid-template-columns: max-content 1fr max-content max-content;

	&__menuToggle {
		&:before {
			font-family: fontAwesome;
            content: "\f0c9";
            color: #f6f6f6;
			font-size: 18px;
        }
	}

	&__popupProfile, &__popupCart {
		justify-self: end;
	}
}
</style>
