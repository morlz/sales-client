<template>
	<el-card class="tasks">
		<div slot="header">
			<h2>Задачи</h2>
		</div>

		<tabless :data="data" :fieldDescription="clientTasksFieldDescription" :onClick="goToPreorder" :buttons="afterTableTasksButtons" :minify="true"/>
		<edit-task-form v-if="auth_can(3, 'Task')"/>
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
		...mapMutations([])
	},
	computed: {
		...mapGetters([
			'cachedSalons',
			'task_types'
		]),
		data () {
			return this.content ? this.content.map(task => {
				task.type = this.task_types[task.type_id] ? this.task_types[task.type_id].title : '...'
				task.salon = task.salon.NAME ? task.salon.NAME : task.salon
				return task
			}) : []
		},
	}
}
</script>


<style lang="less">

</style>
