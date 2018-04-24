<template>
<div class="cartWrapper">
	<template v-if="auth_can(1, 'Cart')">
		<q-popover ref="cartPopover" :disable="!app_view_desktop">
			<div class="cartItems" v-loading="cart_loadingList">
				<app-header-popup-cart-content/>

				<q-btn color="primary" class="goButton" v-if="(cart_exist.length || cart_new.length) && auth_can(2, 'Invoice')" @click="goToCreateInvoice">Оформить документ</q-btn>
			</div>
		</q-popover>

		<q-modal maximized v-if="!app_view_desktop" v-model="modal" ref="modal" class="cartModal">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn flat wait-for-ripple @click="modal = false">
						<q-icon name="keyboard_arrow_left"/>
					</q-btn>
					<q-toolbar-title>{{cart_cachedSumm}} руб. {{cart_cachedCount}} шт.</q-toolbar-title>
					<q-btn flat icon-right="redo" @click="goToCreateInvoice" v-if="cart_exist.length || cart_new.length">Оформить</q-btn>
				</q-toolbar>

				<app-header-popup-cart-content class="cartModal__content"/>
			</q-modal-layout>
		</q-modal>

		<q-btn class="cartPopoverToggleButton" v-loading="cart_loadingList" flat @click="modal = !modal" wait-for-ripple>
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
			if (!this.$refs.modal)
				return router.push('/docs/createInvoice')

			this.$refs.modal.$once('close', a => router.push('/docs/createInvoice'))
			this.modal = false
		}
	},
	created () {
		if (!this.auth_can(1, 'Cart')) return
		this.cart_init()
	}
}
</script>


<style lang="less">
.cartWrapper {
    .cartPopoverToggleButton {
        cursor: pointer;
        box-sizing: border-box;
        color: #fff;
        transition: all 0.3s ease-in-out;
        background-color: #027be3;
		&:hover {
			background-color: #1565c0;
		}
    }
}
.cartItems {
	padding: 20px;
	display: grid;
	width: 800px;
	max-height: 600px;
	grid-gap: 15px;
	.items {
		display: grid;
		grid-gap: 10px;
		align-content: start;
		overflow-y: auto;
		padding-right: 10px;
		max-height: 500px;
	}
	.title {
		font-size: 18px;
		font-weight: bold;
	}
	.goButton {
		justify-self: start;
	}
}

.cartModal {
	&__content {
		padding: 10px 0 10px 10px;
	}
}
</style>
