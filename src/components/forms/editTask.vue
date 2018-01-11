<template>
<div class="editTaskFormWrapper" v-if="auth_can(3, 'Task')">
	<el-dialog  :visible.sync="formOpen" :lock-scroll="false">
		<h2 slot="title">Изменить задачу</h2>

		<el-form label-width="130px">
			<el-form-item label="Дата контакта">
				<el-date-picker type="date" v-model="editTaskForm.date" placeholder="Дата контакта" :editable="false" />
			</el-form-item>

			<el-form-item label="Тип задачи">
				{{ editTaskForm.type && editTaskForm.type.title ? editTaskForm.type.title : editTaskForm.type }}
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
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
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
			this.editTaskForm = Object.assign({}, this.editTaskForm, n)
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
			return this.editTaskForm && this.editTaskForm.managerresponsible ?
				`${this.editTaskForm.managerresponsible.FIO} ${this.editTaskForm.managerresponsible.IMY} ${this.editTaskForm.managerresponsible.OTCH}` : "..."
		}
	}
}
</script>


<style lang="less" scoped>
.editTaskFormWrapper {

}

</style>
