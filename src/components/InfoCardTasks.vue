<template>
	<q-card class="tasks">
		<q-card-title>
			Задачи
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="clientTasksFieldDescription" :rows="data"/>
		</q-card-main>

		<q-card-actions>
			<q-btn v-if="auth_can(3, 'Task') && (taskToEnd.id || !data.length)" @click="clickEndHandle" color="primary" icon="add">Добавить задачу (Завершить)</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import editTaskForm from '@/components/forms/editTask'
import mixins from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible'

let {
	clientTasksFieldDescription
} = fieldDescription

export default {
	props: ['content'],
	mixins: [mixins],
	components: {
		editTaskForm,
		TableCollapsible
	},
	data () {
		return {
			clientTasksFieldDescription
		}
	},
	watch: {

	},
	methods: {
		...mapMutations([]),
		clickEndHandle () {
			router.push({ path: `/preorder/tasks/${this.taskToEnd.id || 0}` })
		}
	},
	computed: {
		...mapGetters([
			'salon_list',
			'task_types'
		]),
		data () {
			return this.content ? this.content.map(task => {
				let type = this.task_types.find(el => el.id == task.type_id)
				task.type = type ? type.title : '...'
				task.salon = task.salon.NAME ? task.salon.NAME : task.salon
				return task
			}) : []
		},
		taskToEnd () {
			return this.data.find(el => el.end_date == null) || {}
		}
	}
}
</script>


<style lang="less">
.tasks {
	.buttons {
		margin-top: 10px;
	}
}
</style>
