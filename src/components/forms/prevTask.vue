<template>
	<el-card class="prev card">
		<h2 slot="header">Предыдущая задача</h2>

		<el-form label-width="130px">
			<el-form-item label="Срок">
				<el-date-picker type="date" :value="data.date" :editable="false" />
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
	computed: {
		...mapGetters([
			'task_current'
		]),
		data() {
			return this.task_current || {}
		}
	}
}
</script>


<style lang="less" scoped>

</style>
