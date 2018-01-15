<template>
	<el-card class="next card nextTask" v-if="auth_can(3, 'Task')">
		<h2 slot="header">Следующая задача</h2>

		<el-form label-width="130px">
			<el-form-item label="Тип">
				<el-select v-model="form.type">
					<el-option v-for="item, index in currentScenario" :value="item.id" :label="item.title" :key="index" />
				</el-select>
			</el-form-item>

			<transition-group class="nextFormTransitionWrapper" name="fade">
				<div v-show="form.type == 1" key="1" class="nextFormTransition">
					<el-form-item label="Описание">
						<el-input type="textarea" v-model="form.description" placeholder="Описание" />
					</el-form-item>
				</div>

				<div v-show="form.type == 2" key="1" class="nextFormTransition">
					<el-form-item label="Описание">
						<el-input type="textarea" v-model="form.description" placeholder="Описание" />
					</el-form-item>
				</div>

				<div v-show="form.type == 3" key="3" class="nextFormTransition">
					<el-form-item label="Дата">
						<el-date-picker type="date" v-model="form.date" placeholder="Плановая дата" :id="null" />
					</el-form-item>

					<el-form-item label="Тип оплаты">
						<el-select v-model="form.payment_type">
							<el-option value="???" label="???"/>
						</el-select>
					</el-form-item>

					<el-form-item label="Регион">
						<el-input v-model="form.region" placeholder="Регион" />
					</el-form-item>

					<el-form-item label="Адрес">
						<el-input v-model="form.address" placeholder="Адрес" />
					</el-form-item>

					<el-form-item label="Комментарий">
						<el-checkbox v-model="form.internet">Интернет магазин</el-checkbox>
						<el-checkbox v-model="form.podium">Заказ на подиум</el-checkbox>
					</el-form-item>

					<el-form-item label="Комментарий">
						<el-input type="textarea" v-model="form.comment" placeholder="Комментарий" />
					</el-form-item>
				</div>
			</transition-group>
		</el-form>
		<slot name="buttons"/>
	</el-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import fieldDescription from '@/static/fieldDescription'
import mixins from '@/components/mixins'

export default {
	props: {
		scenario: {
			default: () => "CREATE_PREORDER"
		}
	},
	mixins: [mixins],
	data () {
		return {
			form: {
				//all
				type: "",
				date: "",

				//not oformleniye
				description: "",

				//only oformleniye
				payment_type: "",
				internet: false,
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
		local_form (n) {
			let optional = {}
			if (this.form.type == 1) optional.date = new Date()
			this.task_add_nextSet(Object.assign({}, n, optional))
		}
	},
	computed: {
		...mapGetters([
			'task_current',
			'task_types'
		]),
		currentScenario () {
			return this.scenarios[this.scenario].map(el => this.task_types.find(type => type.id == el) || {})
		},
		local_form(){
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


<style lang="less">
.nextTask {
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .6s;
	}

	.fade-leave-active, .fade-leave {
		position: absolute;
		top: 141px;
	}


	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		justify-content: flex-start;
	}
}
</style>
