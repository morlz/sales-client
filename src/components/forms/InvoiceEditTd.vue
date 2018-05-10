<template>
<q-modal class="InvoiceEditTd" v-model="modal" :content-css="{ minHeight: '270px', minWidth: '400px' }" minimized>
	<q-modal-layout>
		<q-toolbar slot="header">
			<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />

			<q-toolbar-title>
				Изменить скидку на диван
			</q-toolbar-title>
		</q-toolbar>

		<div class="layout-padding InvoiceEditTd__form">
			<q-field>
				<q-input v-model.number="form.amount" type="number" float-label="Скидка" :suffix="form.type ? 'руб.' : '%'"/>
			</q-field>

			<q-field>
				<q-select v-model="form.type" :options="options" float-label="Тип скидки"/>
			</q-field>

			<div class="InvoiceEditTd__buttons">
				<q-btn color="primary" @click="save">Сохранить</q-btn>
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
				type: false,
				amount: 0
			},
			options: [
				{ label: '%', value: false },
				{ label: 'руб.', value: true },
			]
		}
	},
	watch: {
		content (n) {
			console.log(this.content);
			this.copyVals()
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
			'furniture_updateTdDiscount'
		]),
		async save () {
			await this.furniture_updateTdDiscount({
				...this.form,
				id: this.content.id
			})
			this.modal = false
		},
		copyVals () {
			if (!Object.values(this.content).length) return
			this.form = {
				type: !!+this.content.instance.discountType || false,
				amount: this.content.instance.discount || 0
			}
		}
	},
	mounted () {
		this.copyVals()
	}
}
</script>


<style lang="stylus">
.InvoiceEditTd
	&__form
		display grid
		grid-gap 10px
		padding 20px

	&__buttons
		margin 15px 0
</style>
