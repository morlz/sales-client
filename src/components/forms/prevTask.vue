<template>
	<el-card class="prev card">
		<h2 slot="header">Предыдущая задача</h2>

		<el-form label-width="130px">
			<el-form-item label="Дата завершения">
				<el-date-picker type="date" :value="data.date" :editable="false" :id="null" />
			</el-form-item>

			<el-form-item label="Тип">
				{{ data.type ? data.type.title : '...' }}
			</el-form-item>

			<el-form-item label="Сумма расчёта">
				{{ data.summ }}
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
		local_form (n) {
			this.task_add_prevSet(n)
		}
	},
	computed: {
		...mapGetters([
			'task_current'
		]),
		data() {
			return this.task_current || {}
		},
		local_form(){
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
