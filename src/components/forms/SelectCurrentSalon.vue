<template>
	<q-modal :value="value" @input="input" ref="modal" class="selectSalonForm" :content-css="{minWidth: '300px', minHeight: '80vh'}">
		<q-modal-layout>
			<q-toolbar slot="header">
				<q-btn flat wait-for-ripple @click="input(false)">
					<q-icon name="keyboard_arrow_left"/>
				</q-btn>
				<q-toolbar-title>{ salon.NAME }</q-toolbar-title>
			</q-toolbar>

			<div class="selectSalonForm__content">
				<q-list class="" no-border>

					<q-item v-for="item, index in salonsListFiltred">
						<q-item-main>{{ item.NAME }}</q-item-main>
					</q-item>
				</q-list>
			</div>
		</q-modal-layout>
	</q-modal>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QBtn, QIcon, QModal, QModalLayout, QToolbar, QToolbarTitle, QList, QItem, QItemMain, QItemSide } from 'quasar'

export default {
	props: {
		value: {
			type: Boolean,
			required: true
		}
	},
	components: {
		QBtn,
		QIcon,
		QModal,
		QModalLayout,
		QToolbar,
		QToolbarTitle,
		QList,
		QItem,
		QItemMain,
		QItemSide
	},
	data () {
		return {
			search: ""
		}
	},
	computed: {
		...mapGetters([
			'salon_list'
		]),
		salonsListFiltred () {
			if (this.search)
				return this.salon_list

			return this.salon_list.filter(el => el.NAME.indexOf(this.search) + 1)
		}
	},
	methods: {
		...mapActions([
			'salon_getList'
		]),
		input (e) {
			this.$emit('input', e)
		}
	},
	mounted () {
		this.salon_getList()
	}
}
</script>


<style lang="less">
.selectSalonForm {
	&__content {

	}
}
</style>
