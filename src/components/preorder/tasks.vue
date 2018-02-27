<template>
	<el-card class="tasks">
		<div slot="header">
			<h2>Задачи</h2>
		</div>

		<tabless
			:data="data"
			:fieldDescription="clientTasksFieldDescription"
			:onClick="goToPreorder"
			:buttons="afterTableTasksButtons"
			:buttonsCondition="task_buttonCondition"
			:minify="true"/>
		<edit-task-form v-if="auth_can(3, 'Task')"/>

		<div class="buttons">
			<el-button v-if="auth_can(3, 'Task') && (taskToEnd.id || !data.length)" @click="clickEndHandle" type="primary">Добавить задачу (Завершить)</el-button>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import editTaskForm from '@/components/forms/editTask.vue'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'

let {
	clientTasksFieldDescription
} = fieldDescription

export default {
	props: ['content'],
	mixins: [mixins],
	components: {
		editTaskForm,
		tabless
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
