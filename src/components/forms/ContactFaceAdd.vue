<template>
	<q-modal v-model="modal" :content-css="{ minHeight: '500px', minWidth: '90vw' }">
		<q-modal-layout>
			<q-toolbar slot="header">
				<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />

				<q-toolbar-title>Добавить контакт</q-toolbar-title>
			</q-toolbar>

			<div class="layout-padding ContactFaceAdd">
				<q-field>
					<q-input v-model="addContactForm.fio" float-label="ФИО"/>
				</q-field>

				<q-field>
					<q-input v-model="addContactForm.regard" float-label="Отножение"/>
				</q-field>

				<q-field>
					<q-input v-model="addContactForm.phone" float-label="Телефон"/>
				</q-field>

				<q-checkbox v-model="addContactForm.disableSMS" label="SMS-рассылка запрещена"/>

				<q-field>
					<q-input v-model="addContactForm.email" float-label="Email"/>
				</q-field>

				<q-checkbox v-model="addContactForm.disableEmail" label="Email-рассылка запрещена"/>

				<div class="ContactFaceAdd__buttons">
					<q-btn color="primary" @click="add" >Добавить</q-btn>
					<q-btn color="secondary" flat v-close-overlay>Отмена</q-btn>
				</div>
			</div>
		</q-modal-layout>
	</q-modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'


export default {
	mixins: [AuthMixin],
	props: {
		value: Boolean
	},
	data () {
		return {
			addContactForm: {
				fio: "",
				gender: "",
				regard: "",
				phone: "",
				disableSMS: false,
				email: "",
				disableEmail: false
			},
		}
	},
	methods: {
		add () {
			this.$store.dispatch('client_addContact', {
				...this.addContactForm,
				client_id: this.preorder_current.client_id,
				preorder_id: this.preorder_current.id
			})
			this.modal = false
		},
	},
	computed: {
		...mapGetters([
			'preorder_current'
		]),
		modal: {
			get () {
				return this.value
			},
			set (val) {
				this.$emit('input', val)
			}
		}
	}
}
</script>


<style lang="stylus">
.ContactFaceAdd
	display grid
	grid-gap 10px

</style>
