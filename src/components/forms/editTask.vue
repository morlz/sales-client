<template>
<div class="editTaskFormWrapper">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Изменить задачу</h2>

		<el-form label-width="130px">
			<el-form-item label="Дата контакта">
				<el-date-picker type="date" v-model="editTaskForm.date" placeholder="Дата контакта" :editable="false" />
			</el-form-item>

			<el-form-item label="Тип задачи">
				{{ editTaskForm.type }}
			</el-form-item>

			<el-form-item label="Ответственный">
				{{ managerResponsible }}
			</el-form-item>

			<el-form-item label="Описание задачи">
				<el-input type="textarea" v-model="editTaskForm.description" placeholder="Описание" />
			</el-form-item>

			<el-form-item label="Сумма расчёта">
				<el-input v-model="editTaskForm.summ" placeholder="Сумма расчёта" />
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
			editTaskForm: {}
		}
	},
	watch: {
		formOpen (n) {
			this.task_edit_visibleSet(n)
		},
		task_edit_visible (n) {
			this.formOpen = n
		},
		task_edit_current (n) {
			if (!n) return
			this.getManagersByIds([n.manager_responsible_id])
			this.editTaskForm = Object.assign(this.editTaskForm, n)
		}
	},
	methods: {
		...mapActions([
			'getManagersByIds',
			'updateTask'
		]),
		canselEdit () {
			this.task_edit_visibleSet(false)
		},
		edit () {
			this.updateTask(this.editTaskForm)
			this.task_edit_visibleSet(false)
		},
		...mapMutations([
			'task_edit_visibleSet'
		])
	},
	computed: {
		...mapGetters([
			'task_edit_visible',
			'task_edit_current',
			'cachedManagers'
		]),
		managerResponsible() {
			if (!this.cachedManagers || this.editTaskForm.manager_responsible_id == undefined) return '...'
			let manager = this.cachedManagers.find(el => el.ID_M == this.editTaskForm.manager_responsible_id)
			if (!manager) return '...'
			return manager.FIO
		}
	}
}
</script>


<style lang="less" scoped>
.editTaskFormWrapper {

}

</style>
