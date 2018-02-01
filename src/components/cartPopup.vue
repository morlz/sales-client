<template>
<div class="cartWrapper">
	<el-popover ref="cartPopover" title="Корзина" trigger="click">
		<div class="cartItems" v-loading="cart_loadingList">
			<el-tabs class="cartTabs">
				<el-tab-pane label="Мебель из салона (склада)">
					<tabless :data="cart_exist" :fieldDescription="cartPopupExistFieldDescription" :minify="true" :buttons="local_cart_cachedExistButtons" />
				</el-tab-pane>

				<el-tab-pane label="Заказные позиции">
					<tabless :data="cart_new" :fieldDescription="cartPopupNewFieldDescription" :minify="true" :buttons="local_cart_cachedNewButtons" />
				</el-tab-pane>
			</el-tabs>
			<el-button type="primary">Оформить документ</el-button>
		</div>
	</el-popover>
	<div class="cartPopoverToggleButton" v-popover:cartPopover v-loading="cart_loadingList">
		Корзина {{cart_cachedCount}} шт. {{cart_cachedSumm}} руб.
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import tabless from '@/components/tableSS.vue'
import fieldDescription from '@/static/fieldDescription'

let {
	cartPopupExistFieldDescription,
	cartPopupNewFieldDescription
} = fieldDescription

export default {
	data() {
		return {
			cartPopupExistFieldDescription,
			cartPopupNewFieldDescription
		}
	},
	components: {
		tabless
	},
	watch: {

	},
	methods: {
		...mapActions([
			'cart_init',
			'cart_removeItem'
		])
	},
	computed: {
		...mapGetters([
			'cart_exist',
			'cart_new',
			'cart_cachedCount',
			'cart_cachedSumm',
			'cart_loadingList',
			'cart_removing'
		]),
		local_cart_cachedExistButtons () {
			return [{
				type: "danger",
				loading: {
					field: 'ID',
					items: this.cart_removing
				},
				class: {
					'el-icon-delete': true,
					'hoverHide': true
				},
				click: (e, row) => this.cart_removeItem({ id: row.ID, type: 'exist' })
			}]
		},
		local_cart_cachedNewButtons () {
			return [{
				type: "danger",
				loading: {
					field: 'ID',
					items: this.cart_removing
				},
				class: {
					'el-icon-delete': true,
					'hoverHide': true
				},
				click: (e, row) => this.cart_removeItem({ id: row.ID, type: 'new' })
			}]
		}
	},
	mounted () {
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
.cartItems {
	max-height: 600px;
	overflow-y: scroll;
	padding-right: 10px;
	.cartTabs {
		margin-bottom: 10px;
	}
}
</style>
