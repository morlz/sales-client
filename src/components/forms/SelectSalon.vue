<template>
	<q-modal
		:value="value"
		@input="input"
		ref="modal"
		class="selectSalonForm"
		:content-css="{minWidth: '300px', minHeight: '80vh'}"
		:no-backdrop-dismiss="noClose"
		:no-esc-dismiss="noClose"
	>
		<q-modal-layout>
			<q-toolbar slot="header">
				<q-btn flat wait-for-ripple @click="input(false)" v-if="!noClose">
					<q-icon name="keyboard_arrow_left"/>
				</q-btn>
				<q-toolbar-title>Выбор салона</q-toolbar-title>
			</q-toolbar>

			<div class="selectSalonForm__content">
				<q-field>
					<q-input v-model="search" float-label="Поиск" @keyup.enter.native="enter"/>
				</q-field>

				<q-list class="selectSalonForm__list" no-border>
					<q-item v-for="item, index in salonsListFiltred" :key="index" @click.native="clickHandler(item.ID_SALONA)">
						<q-item-main>
							{{ item.NAME }}
						</q-item-main>
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

import { QBtn, QIcon, QModal, QModalLayout, QToolbar, QToolbarTitle, QList, QItem, QItemMain, QItemSide, QField, QInput } from 'quasar'

export default {
	props: {
		value: {
			type: Boolean,
			required: true
		},
		noClose: {
			type: Boolean,
			default: a => false
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
		QItemSide,
		QField,
		QInput
	},
	data () {
		return {
			search: ""
		}
	},
	watch: {
		value () {
			this.salon_getList()
		}
	},
	computed: {
		...mapGetters([
			'salon_list'
		]),
		salonsListFiltred () {
			if (!this.search)
				return this.salon_list

			return this.salon_list.filter(
				el => el.NAME.toLowerCase().indexOf(this.search.toLowerCase()) + 1
			)
		}
	},
	methods: {
		...mapActions([
			'salon_getList',
		]),
		input (e) {
			this.$emit('input', e)
		},
		enter (e) {
			let first = this.salonsListFiltred[0]
			if (!first) return
			this.clickHandler(first.ID_SALONA)
		},
		clickHandler (e) {
			this.$emit('select', e)
			this.input(false)
		}
	},
	mounted () {
		if (this.value)
			this.salon_getList()
	}
}
</script>


<style lang="less">
.selectSalonForm {
	&__content {
		padding: 10px;

		.q-field {
			margin-top: 0;
		}
	}

	&__list {
		.q-item {
			cursor: pointer;
		}
	}
}
</style>
