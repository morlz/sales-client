<template>
	<q-card v-if="auth_can(3, 'Task')" class="NextTask">
		<q-card-title>Следующая задача</q-card-title>

		<q-card-main class="NextTask__inner">
			<q-field helper="Тип новой задачи">
				<q-select v-model="form.type" :options="currentScenario" float-label="Тип"/>
			</q-field>

			<q-slide-transition>
				<div v-if="form.type == '1'">
					<q-field>
						<q-input v-model="form.description" float-label="Причина"/>
					</q-field>
				</div>
			</q-slide-transition>

			<q-slide-transition>
				<div v-if="form.type == '2'">
					<q-field>
						<q-datetime v-model="form.date" float-label="Плановая дата"/>
					</q-field>

					<q-field>
						<q-input v-model="form.description" type="textarea" float-label="Описание"/>
					</q-field>
				</div>
			</q-slide-transition>

			<q-slide-transition>
				<div v-if="form.type == '3'">
					<q-field>
						<q-datetime v-model="form.date" float-label="Плановая дата"/>
					</q-field>

					<q-field>
						<q-toggle v-model="form.podium" label="Заказ на подиум"/>
					</q-field>

					<q-field>
						<q-input v-model="form.comment" type="textarea" float-label="Комментарий" :disable="form.podium"/>
					</q-field>
				</div>
			</q-slide-transition>
		</q-card-main>

		<q-card-actions>
			<slot name="buttons"/>
		</q-card-actions>
	</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import { AuthMixin } from '@/mixins'
import { QSlideTransition } from 'quasar'

export default {
	components: {
		QSlideTransition
	},
	props: {
		scenario: {
			type: String,
			default: () => "CREATE_PREORDER"
		}
	},
	mixins: [AuthMixin],
	data() {
		return {
			form: {
				//all
				type: "",
				date: "",

				//not oformleniye
				description: "",

				//only oformleniye
				payment_type: "",
				podium: false,
				region: "",
				address: "",
				comment: ""
			},
			scenarios: {
				END_TASK: [1, 2, 3],
				CREATE_PREORDER: [2, 3, 4]
			}
		}
	},
	watch: {
		local_task_nextForm(n) {
			let optional = {}
			if (this.form.type == 1) optional.date = new Date()
			this.task_add_nextSet(Object.assign({}, n, optional))
		},
		'form.podium' (n) {
			if (n) {
				this.form.address = this.loginedAs.salon.ADRES
			} else {
				this.form.address = ""
			}
		}
	},
	computed: {
		...mapGetters([
			'task_current',
			'task_types',
			'loginedAs'
		]),
		currentScenario() {
			return this.scenarios[this.scenario]
				.map(el => this.task_types.find(type => type.id == el) || {})
				.map(el => ({
					label: el.title,
					value: el.id
				}))
		},
		local_task_nextForm() {
			return Object.assign({}, this.form)
		}
	},
	methods: {
		...mapMutations([
			'task_add_nextSet'
		])
	}
}
</script>


<style lang="stylus">
.NextTask
	&__inner
		display grid
		grid-gap 10px
		> div
			display grid
			grid-gap 10px
</style>
