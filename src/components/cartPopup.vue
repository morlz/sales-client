<template>
<div class="cartWrapper">
	<el-popover ref="cartPopover" trigger="click">
		<div class="cartItems" v-loading="cart_loadingList">
			<div class="items scroll">
				<template v-if="cart_exist.length">
					<div class="title">Мебель из салона (склада)</div>
					<table-collapsible :rows="cart_exist" :columns="cartPopupExistFieldDescription">
						<template slot="buttons" slot-scope="props">
							<q-btn
								v-for="button, index in local_cart_cachedExistButtons"
								:key="`${props.row.ID}-${index}`"
								:class="button.class"
								flat
								@click.stop="button.click($event, props.row)"/>
						</template>
					</table-collapsible>
				</template>

				<template v-if="cart_new.length">
					<div class="title">Заказные позиции</div>
					<table-collapsible :rows="cart_new" :columns="cartPopupNewFieldDescription"/>
				</template>

				<div class="title" v-if="!cart_exist.length && !cart_new.length">
					Корзина пуста
				</div>
			</div>

			<q-btn color="primary" class="goButton" v-if="cart_exist.length || cart_new.length">Оформить документ</q-btn>
		</div>
	</el-popover>
	<div class="cartPopoverToggleButton" v-popover:cartPopover v-loading="cart_loadingList">
		Корзина {{cart_cachedCount}} шт. {{cart_cachedSumm}} руб.
	</div>
</div>
</template>

<script>
//<tabless :data="cart_exist" :fieldDescription="cartPopupExistFieldDescription" :minify="true" :buttons="local_cart_cachedExistButtons" />
//<tabless :data="cart_new" :fieldDescription="cartPopupNewFieldDescription" :minify="true" :buttons="local_cart_cachedNewButtons" />

import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QBtn
} from 'quasar'

import tabless from '@/components/tableSS.vue'
import TableCollapsible from '@/components/TableCollapsible.vue'
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
		TableCollapsible,
		tabless,
		QBtn
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
	display: grid;
	width: 700px;
	max-height: 600px;
	.goButton {
		margin-top: 15px;
		justify-self: start;
	}
	.items {
		display: grid;
		grid-gap: 10px;
		align-content: start;
		overflow-y: auto;
		padding-right: 10px;
	}
	.title {
		font-size: 18px;
		font-weight: bold;
	}
}
</style>
