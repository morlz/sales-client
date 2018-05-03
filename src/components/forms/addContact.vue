<template>
<div class="addContactFormWrapper" v-if="auth_can(2, 'ContactFace')">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Добавить контакт</h2>

		<el-form :model="addContactForm" label-width="100px" :rules="rules" ref="addContactForm">
			<el-form-item label="ФИО" prop="fio">
				<el-input v-model="addContactForm.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол" prop="gender">
				<el-switch v-model="addContactForm.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Отношение" prop="regard">
				<el-input placeholder="Основной" v-model="addContactForm.regard" />
			</el-form-item>

			<el-form-item label="Телефон" prop="phone">
				<el-input v-model="addContactForm.phone" placeholder="8 (900) 800 70 60" />
				<el-checkbox v-model="addContactForm.disableSMS">SMS-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="Эл почта" prop="email">
				<el-input v-model="addContactForm.email" placeholder="some@email.com" />
				<el-checkbox v-model="addContactForm.disableEmail">Email-рассылка запрещена</el-checkbox>
			</el-form-item>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="canselAdd">Отмена</el-button>
			<el-button type="primary" @click="add">Добавить</el-button>
		</div>
	</el-dialog>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import rules from '@/static/formRules'
import { AuthMixin } from '@/mixins'

let {
	contacts
} = rules

export default {
	mixins: [AuthMixin],
	data () {
		return {
			formOpen: false,
			addContactForm: {
				fio: "",
				gender: "",
				regard: "",
				phone: "",
				disableSMS: 0,
				email: "",
				disableEmail: 0
			},
			rules: contacts
		}
	},
	watch: {
		formOpen (n) {
			if (n && this.$refs.addContactForm) this.$refs.addContactForm.resetFields()
			this.client_visible_addContactFormSet(n)
		},
		client_visible_addContactForm (n) {
			this.formOpen = n
		}
	},
	methods: {
		canselAdd () {
			this.client_visible_addContactFormSet(false)
		},
		add () {
			this.$refs.addContactForm.validate(valid => {
				if (valid) {
					this.client_addContact(Object.assign({
						client_id: this.preorder_current.client_id,
						preorder_id: this.preorder_current.id
					}, this.addContactForm))
					this.client_visible_addContactFormSet(false)
				}
			})
		},
		...mapActions([
			'client_addContact'
		]),
		...mapMutations([
			'client_visible_addContactFormSet'
		])
	},
	computed: {
		...mapGetters([
			'client_visible_addContactForm',
			'preorder_current'
		])
	}
}
</script>


<style lang="less" scoped>
.addContactFormWrapper {

}

</style>
