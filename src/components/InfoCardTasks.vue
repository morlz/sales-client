<template>
	<q-card class="tasks">
		<q-card-title>
			Задачи
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="InfoCardTasks" :rows="data" v-if="data.length"/>

			<div class="" v-else>
				Задач нет
			</div>
		</q-card-main>

		<q-card-actions>
			<q-btn v-if="auth_can(3, 'Task') && (taskToEnd.id && data.length)" @click="clickEndHandle" color="primary" icon="add">Добавить задачу (Завершить текущую)</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { InfoCardTasks } from '@/static/fieldDescription'
import editTaskForm from '@/components/forms/editTask'
import { AuthMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible'

export default {
	props: ['content'],
	mixins: [AuthMixin],
	components: {
		editTaskForm,
		TableCollapsible
	},
	data () {
		return {
			InfoCardTasks
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
