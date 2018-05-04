<template>
	<q-card class="PrevTask">
		<q-card-title>Предыдущая задача</q-card-title>

		<q-card-main class="PrevTask__inner">
			<q-field>
				<q-datetime :value="new Date()" disable/>
			</q-field>

			<q-field>
				<q-input :value="data.type ? data.type.title : '...'" float-label="Тип" disable/>
			</q-field>

			<q-field>
				<q-input :value="data.description" float-label="Описание задачи" type="textarea" disable/>
			</q-field>

			<q-field>
				<q-input v-model="form.result" type="textarea" float-label="Результат"/>
			</q-field>
		</q-card-main>
	</q-card>
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


<style lang="stylus">
.PrevTask
	&__inner
		display grid
		grid-gap 10px

</style>
