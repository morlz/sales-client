<template>
<div class="editContactFormWrapper">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Изменить контакт</h2>

		<el-form label-width="100px">
			<el-form-item label="ФИО">
				<el-input v-model="editContactForm.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол">
				<el-switch v-model="editContactForm.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Отношение">
				<el-input placeholder="Основной" v-model="editContactForm.regard" />
			</el-form-item>

			<el-form-item label="Телефон">
				<el-input v-model="editContactForm.phone" placeholder="8 (900) 800 70 60" />
				<el-checkbox v-model="editContactForm.disableSMS">SMS-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="Эл почта">
				<el-input v-model="editContactForm.email" placeholder="some@email.com" />
				<el-checkbox v-model="editContactForm.disableEMAIL">Email-рассылка запрещена</el-checkbox>
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

export default {
	data () {
		return {
			formOpen: false,
			editContactForm: {
				fio: "",
				gender: "",
				regard: "",
				phone: "",
				disableSMS: 0,
				email: "",
				disableEMAIL: 0
			}
		}
	},
	watch: {
		formOpen (n) {
			this.updateEditClientContactFormVisible(n)
		},
		editClientContactFormVisible (n) {
			this.formOpen = n
		},
		currentEditedContact (n) {
			if (!n) return
			this.editContactForm = Object.assign(this.editContactForm, n, {
				gender: n.gender == "Мужской"
			})
		}
	},
	methods: {
		canselEdit () {
			this.updateEditClientContactFormVisible(false)
		},
		edit () {
			console.log(this.editContactForm);
			this.updateEditClientContactFormVisible(false)
		},
		...mapMutations([
			'updateEditClientContactFormVisible'
		])
	},
	computed: {
		...mapGetters([
			'editClientContactFormVisible',
			'currentEditedContact'
		])
	}
}
</script>


<style lang="less" scoped>
.editContactFormWrapper {

}

</style>
