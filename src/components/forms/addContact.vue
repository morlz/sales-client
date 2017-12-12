<template>
<div class="addContactFormWrapper">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Добавить контакт</h2>

		<el-form label-width="100px">
			<el-form-item label="ФИО">
				<el-input v-model="addContactForm.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол">
				<el-switch v-model="addContactForm.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Отношение">
				<el-input placeholder="Основной" v-model="addContactForm.regard" />
			</el-form-item>

			<el-form-item label="Телефон">
				<el-input v-model="addContactForm.phone" placeholder="8 (900) 800 70 60" />
				<el-checkbox v-model="addContactForm.disableSMS">SMS-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="Эл почта">
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

export default {
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
			}
		}
	},
	watch: {
		formOpen (n) {
			this.updateAddClientContactFormVisible(n)
		},
		addClientContactFormVisible (n) {
			this.formOpen = n
		}
	},
	methods: {
		canselAdd () {
			this.updateAddClientContactFormVisible(false)
		},
		add () {
			console.log(this.addContactForm);
			this.updateAddClientContactFormVisible(false)
		},
		...mapMutations([
			'updateAddClientContactFormVisible'
		])
	},
	computed: {
		...mapGetters([
			'addClientContactFormVisible'
		])
	}
}
</script>


<style lang="less" scoped>
.addContactFormWrapper {

}

</style>
