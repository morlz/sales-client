<template>
<q-modal class="InvoiceAddPayment" v-model="modal" :content-css="{ minHeight: '380px', minWidth: '400px' }">
	<q-modal-layout>
		<q-toolbar slot="header">
			<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />

			<q-toolbar-title>
				Добавить оплату в заказ {{ content.N_DOC }}
			</q-toolbar-title>
		</q-toolbar>

		<div class="layout-padding InvoiceAddPayment__form">
			<q-field>
				<q-input v-model.number="form.summ" type="number" float-label="Сумма оплаты"/>
			</q-field>

			<q-field>
				<q-input v-model="form.comment" type="textarea" float-label="Примечание"/>
			</q-field>

			<div class="InvoiceAddPayment__buttons">
				<q-btn color="primary" @click="add">Добавить</q-btn>
				<q-btn color="secondary" flat v-close-overlay>Назад</q-btn>
			</div>
		</div>
	</q-modal-layout>
</q-modal>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

export default {
	props: {
		value: Boolean,
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data() {
		return {
			form: {
				summ: 0,
				comment: ''
			}
		}
	},
	computed: {
		modal: {
			get () {
				return this.value
			},
			set (val) {
				this.$emit('input', val)
			}
		},
	},
	methods: {
		...mapActions([
			'invoice_addPayment'
		]),
		async add () {
			await this.invoice_addPayment({
				...this.form,
				id: this.content.ID
			})
			this.modal = false
		}
	}
}
</script>


<style lang="stylus">
.InvoiceAddPayment
	&__form
		display grid
		grid-gap 10px
	&__buttons
		margin 15px 0
</style>
