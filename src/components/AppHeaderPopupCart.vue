<template>
<div class="AppHeaderPopupCart">
	<template v-if="auth_can(1, 'Cart')">
		<q-popover
			ref="cartPopover"
			:disable="!app_view_desktop"
			max-height="100vh"
			class="AppHeaderPopupCartPopover">
			<div class="AppHeaderPopupCart__scroll" v-loading="cart_loadingList">
				<app-header-popup-cart-content/>

				<q-btn
					color="primary"
					class="AppHeaderPopupCart__button"
					v-if="(cart_exist.length || cart_new.length) && auth_can(2, 'Invoice')"
					@click="goToCreateInvoice">
					Оформить документ
				</q-btn>
			</div>
		</q-popover>

		<q-modal
			maximized
			v-if="!app_view_desktop"
			v-model="modal"
			ref="modal"
			class="AppHeaderPopupCartModal">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn flat wait-for-ripple @click="modal = false">
						<q-icon name="keyboard_arrow_left"/>
					</q-btn>
					<q-toolbar-title>
						{{cart_cachedSumm}} руб. {{cart_cachedCount}} шт.
					</q-toolbar-title>
					<q-btn
						flat
						icon-right="redo"
						@click="goToCreateInvoice"
						v-if="cart_exist.length || cart_new.length">
						Оформить
					</q-btn>
				</q-toolbar>

				<app-header-popup-cart-content class="AppHeaderPopupCartModal__content"/>
			</q-modal-layout>
		</q-modal>

		<q-btn
			class="AppHeaderPopupCartPopover__toggleButton"
			v-loading="cart_loadingList"
			flat
			@click="modal = !modal"
			wait-for-ripple>
			<q-icon name="shopping_cart" v-if="app_view_mobile"/>
			<template v-if="!app_view_mobile">
				Корзина {{cart_cachedCount}} шт. {{cart_cachedSumm}} руб.
			</template>
		</q-btn>
	</template>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import tabless from '@/components/tableSS.vue'
import TableCollapsible from '@/components/TableCollapsible.vue'
import AppHeaderPopupCartContent from '@/components/AppHeaderPopupCartContent'
import { AuthMixin } from '@/mixins'

import { QModal, QModalLayout, QToolbar, QToolbarTitle, QPopover } from 'quasar'

export default {
	components: {
		TableCollapsible,
		tabless,
		QModal,
		QModalLayout,
		QToolbar,
		QToolbarTitle,
		AppHeaderPopupCartContent,
		QPopover
	},
	mixins: [AuthMixin],
	data() {
		return {
			modal: false,
		}
	},
	computed: {
		...mapGetters([
			'cart_exist',
			'cart_new',
			'cart_cachedCount',
			'cart_cachedSumm',
			'cart_loadingList',
			'app_view_mobile',
			'app_view_desktop'
		]),
	},
	methods: {
		...mapActions([
			'cart_init',
			'cart_removeItem'
		]),
		goToCreateInvoice () {
			this.$router.push('/docs/createInvoice')
			this.modal = false
		}
	},
	created () {
		if (!this.auth_can(1, 'Cart')) return
		this.cart_init()
	}
}
</script>


<style lang="stylus">
.AppHeaderPopupCart
	&__scroll
		padding 20px
		display grid
		width 800px
		max-height 100vh
		grid-template-rows 1fr max-content
		grid-gap 15px

	&__button
		justify-self start

.AppHeaderPopupCartPopover
	&__toggleButton
		cursor pointer
		box-sizing border-box
		color #fff
		transition all 0.3s ease-in-out
		background-color #027be3
		&:hover
			background-color #1565c0


.AppHeaderPopupCartModal
	&__content
		padding 10px 0 10px 10px


</style>
