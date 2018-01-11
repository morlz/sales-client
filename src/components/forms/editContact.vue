<template>
<div class="editContactFormWrapper" v-if="auth_can(3, 'ContactFace')">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Изменить контакт</h2>

		<el-form :model="editContactForm" label-width="100px" :rules="rules" ref="editContactForm">
			<el-form-item label="ФИО" prop="fio">
				<el-input v-model="editContactForm.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол" prop="gender">
				<el-switch v-model="editContactForm.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Отношение" prop="regard">
				<el-input placeholder="Основной" v-model="editContactForm.regard" />
			</el-form-item>

			<el-form-item label="Телефон" prop="phone">
				<el-input v-model="editContactForm.phone" placeholder="8 (900) 800 70 60" />
				<el-checkbox v-model="editContactForm.disableSMS">SMS-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="Эл почта" prop="email">
				<el-input v-model="editContactForm.email" placeholder="some@email.com" />
				<el-checkbox v-model="editContactForm.disableEMAIL">Email-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item>
				<el-checkbox v-model="editContactForm.lost">Контакт утерян</el-checkbox>
			</el-form-item>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="canselEdit">Отмена</el-button>
			<el-button type="primary" @click="edit">Сохраниь</el-button>
		</div>
	</el-dialog>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import rules from '@/static/formRules'
import mixins from '@/components/mixins'

let {
	contacts
} = rules

export default {
	mixins: [mixins],
	data () {
		return {
			formOpen: false,
			editContactForm: {
				fio: "",
				gender: "",
				regard: "",
				phone: "",
				disableSMS: false,
				email: "",
				disableEMAIL: false,
				lost: false
			},
			rules: contacts,
			bool: ['disableSMS', 'disableEMAIL', 'lost']
		}
	},
	watch: {
		formOpen (n) {
			this.client_visible_editContactFormSet(n)
			this.assignFields(n)
		},
		client_visible_editContactForm (n) {
			this.formOpen = n
		},
		client_edit_currentContact (n) {
			this.assignFields(n)
		}
	},
	methods: {
		assignFields (n) {
			if (!n) return
			for (var prop in n) {
				if (n.hasOwnProperty(prop)) {
					if (typeof n[prop] != 'boolean' && this.bool.indexOf(prop) + 1) {
						n[prop] = !!(+n[prop])
					}
				}
			}
			this.editContactForm = Object.assign(this.editContactForm, n, {
				gender: n.gender == "Мужской"
			})
			if (!this.$refs.editContactForm) return
			this.$refs.editContactForm.clearValidate()
		},
		canselEdit () {
			this.client_visible_editContactFormSet(false)
		},
		edit () {
			this.$refs.editContactForm.validate(valid => {
				if (valid) {
					this.client_updateContact(this.editContactForm)
					this.client_visible_editContactFormSet(false)
				}
			})
		},
		...mapActions([
			'client_updateContact'
		]),
		...mapMutations([
			'client_visible_editContactFormSet'
		])
	},
	computed: {
		...mapGetters([
			'client_visible_editContactForm',
			'client_edit_currentContact'
		])
	}
}
</script>


<style lang="less" scoped>
.editContactFormWrapper {

}

</style>
