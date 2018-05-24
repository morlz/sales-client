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
						<q-toggle v-model="form.shipment.podium" label="Заказ на подиум"/>
					</q-field>

					<q-field helper="Выберите дату доставки">
						<q-datetime v-model="form.shipment.date" float-label="Дата доставки" :min="options.dateMin"/>
					</q-field>

					<q-slide-transition>
						<div v-if="!form.shipment.podium" class="NextTask__shipment">
							<q-btn-toggle v-model="form.shipment.type" :options="options.type" class="NextTask__shipmentType"/>

							<q-field helper="Выбирете адрес доставки">
								<q-input type="textarea" v-model="form.shipment.to.address" float-label="Куда" @click.native="options.to = !form.shipment.type"/>
								<form-select-address v-model="options.to" @select="form.shipment.to = $event" :initial="form.shipment.to"/>
							</q-field>

							<q-field>
								<q-input v-model.number="form.shipment.price" type="number" float-label="Цена доставки"/>
							</q-field>

							<q-field>
								<q-input v-model="form.shipment.comment" float-label="Комментарий к доставке"/>
							</q-field>
						</div>
					</q-slide-transition>

					<q-slide-transition>
						<template v-if="form.shipment.podium">
							<q-field helper="Выбирете адрес доставки">
								<q-input type="textarea" v-model="form.shipment.to.address" float-label="Куда" @click.native="options.to = !form.shipment.type"/>
								<form-select-address v-model="options.to" @select="form.shipment.to = $event" :initial="form.shipment.to"/>
							</q-field>
						</template>
					</q-slide-transition>
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
import FormSelectAddress from '@/components/forms/SelectAddress'
import { AuthMixin } from '@/mixins'
import { QSlideTransition, QBtnToggle } from 'quasar'

export default {
	components: {
		QSlideTransition,
		QBtnToggle,
		FormSelectAddress
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
				region: "",
				address: "",
				comment: "",

				shipment: {
					type: false,
					date: this.$moment().toDate(),
					podium: false,
					price: 0,
					to: {
						address: '',
						lat: 0,
						lng: 0
					},
					comment: ''
				}
			},
			scenarios: {
				END_TASK: [1, 2, 3],
				CREATE_PREORDER: [2, 3, 4]
			},
			options: {
				type: [
					{ label: 'Доставка', value: false },
					{ label: 'Самовывоз', value: true },
				],
				dateMin: this.$moment().add(1, 'day').toDate(),
				to: false,
				tmpTo: {},
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
		},
		'form.shipment.type' (n) {
			if (n) {
				this.options.tmpTo = this.form.shipment.to
				this.form.shipment.to = {
					...this.form.shipment.to,
					address: `Самовывоз из салона ${this.auth_salon.NAME} (${this.auth_salon.ID_SALONA})`
				}
			} else {
				this.form.shipment.to = this.options.tmpTo
			}
		},
	},
	computed: {
		...mapGetters([
			'task_current',
			'task_types',
			'loginedAs',
			'auth_salon'
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

	&__shipmentType
		justify-self start

	&__shipment
		display grid
		grid-gap 10px
</style>
