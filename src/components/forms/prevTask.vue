<template>
	<el-card class="prev card">
		<h2 slot="header">Предыдущая задача</h2>

		<el-form label-width="130px">
			<el-form-item label="Дата завершения">
				<el-date-picker type="date" :value="new Date()" :readonly="true" :id="null" />
			</el-form-item>

			<el-form-item label="Тип">
				{{ data.type ? data.type.title : '...' }}
			</el-form-item>

			<el-form-item label="Описание задачи">
				{{ data.description }}
			</el-form-item>

			<el-form-item label="Результат">
				<el-input type="textarea" v-model="form.result" />
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	data () {
		return {
			form: {
				result: ""
			}
		}
	},
	watch: {
		local_task_prevForm (n) {
			this.task_add_prevSet(Object.assign({ id: this.task_current.id }, n))
		}
	},
	computed: {
		...mapGetters([
			'task_current'
		]),
		data() {
			return this.task_current || {}
		},
		local_task_prevForm(){
			return Object.assign({}, this.form)
		}
	},
	methods: {
		...mapMutations([
			'task_add_prevSet'
		])
	}
}
</script>


<style lang="less" scoped>

</style>
