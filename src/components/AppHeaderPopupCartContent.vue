<template>
	<div class="items scroll">
		<template v-if="cart_exist.length">
			<div class="title">Мебель из салона (склада)</div>
			<table-collapsible :rows="cart_exist" :columns="cartPopupExistFieldDescription">
				<div slot="end" slot-scope="props" class="tableCollapsible__rowColumnEnd">
					<q-btn
						v-for="button, index in local_cart_cachedExistButtons"
						:key="`${props.row.ID}-${index}`"
						flat
						@click.stop="button.click($event, props.row)">
						<q-icon name="remove_shopping_cart"/>
					</q-btn>
				</div>
			</table-collapsible>
		</template>

		<template v-if="cart_new.length">
			<div class="title">Заказные позиции</div>
			<table-collapsible :rows="cart_new" :columns="cartPopupNewFieldDescription">
				<div slot="end" slot-scope="props" class="tableCollapsible__rowColumnEnd">
					<q-btn
						v-for="button, index in local_cart_cachedNewButtons"
						:key="`${props.row.ID}-${index}`"
						flat
						@click.stop="button.click($event, props.row)">
						<q-icon name="remove_shopping_cart"/>
					</q-btn>
				</div>
			</table-collapsible>
		</template>

		<div class="title" v-if="!cart_exist.length && !cart_new.length">
			Корзина пуста
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
import TableCollapsible from '@/components/TableCollapsible.vue'
import fieldDescription from '@/static/fieldDescription'

import { AuthMixin } from '@/mixins'

let {
	cartPopupExistFieldDescription,
	cartPopupNewFieldDescription
} = fieldDescription

export default {
	components: {
		TableCollapsible,
		tabless,
	},
	mixins: [AuthMixin],
	data() {
		return {
			cartPopupExistFieldDescription,
			cartPopupNewFieldDescription
		}
	},
	computed: {
		...mapGetters([
			'cart_exist',
			'cart_new',
			'cart_removing',
		]),
		local_cart_cachedExistButtons () {
			if (!this.auth_can(4, 'Cart'))
				return []

			return [{
				type: "danger",
				loading: {
					field: 'ID',
					items: this.cart_removing
				},
				class: {
					'el-icon-delete': true
				},
				click: (e, row) => this.cart_removeItem({ id: row.ID, type: 'exist' })
			}]
		},
		local_cart_cachedNewButtons () {
			if (!this.auth_can(4, 'Cart'))
				return []

			return [{
				type: "danger",
				loading: {
					field: 'ID',
					items: this.cart_removing
				},
				class: {
					'el-icon-delete': true
				},
				click: (e, row) => this.cart_removeItem({ id: row.ID, type: 'new' })
			}]
		}
	},
	methods: {
		...mapActions([
			'cart_removeItem'
		]),
	},
}
</script>


<style lang="less">
</style>
