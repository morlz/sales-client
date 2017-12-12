<template>
<div class="editTaskFormWrapper">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Изменить задачу</h2>

		<el-form label-width="100px">
			<el-form-item label="ФИО">
				<el-input v-model="editTaskForm.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол">
				<el-switch v-model="editTaskForm.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Отношение">
				<el-input placeholder="Основной" v-model="editTaskForm.regard" />
			</el-form-item>

			<el-form-item label="Телефон">
				<el-input v-model="editTaskForm.phone" placeholder="8 (900) 800 70 60" />
				<el-checkbox v-model="editTaskForm.disableSMS">SMS-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="Эл почта">
				<el-input v-model="editTaskForm.email" placeholder="some@email.com" />
				<el-checkbox v-model="editTaskForm.disableEMAIL">Email-рассылка запрещена</el-checkbox>
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
			editTaskForm: {
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
			this.updateEditTaskFormVisible(n)
		},
		editTaskFormVisible (n) {
			this.formOpen = n
		},
		currentEditedTask (n) {
			if (!n) return
			this.editTaskForm = Object.assign(this.editTaskForm, n)
		}
	},
	methods: {
		canselEdit () {
			this.updateEditTaskFormVisible(false)
		},
		edit () {
			this.updateEditTaskFormVisible(false)
		},
		...mapMutations([
			'updateEditTaskFormVisible'
		])
	},
	computed: {
		...mapGetters([
			'editTaskFormVisible',
			'currentEditedTask'
		])
	}
}
</script>


<style lang="less" scoped>
.editTaskFormWrapper {

}

</style>
