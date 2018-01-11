<template>
	<el-card class="next card nextTask" v-if="auth_can(3, 'Task')">
		<h2 slot="header">Следующая задача</h2>

		<el-form label-width="130px">
			<el-form-item label="Тип">
				<el-select v-model="form.type">
					<el-option v-for="item, index in taskTypes" :value="item.value" :label="item.label" :key="index" />
				</el-select>
			</el-form-item>

			<transition-group class="nextFormTransitionWrapper" name="fade">
				<div v-show="form.type == 1" key="1" class="nextFormTransition">
					<el-form-item label="Дата">
						<el-date-picker type="date" v-model="form.date" placeholder="Дата выполнения задачи" />
					</el-form-item>

					<el-form-item label="Сумма расчёта">
						<el-input v-model="form.summ" placeholder="Сумма расчёта" />
					</el-form-item>

					<el-form-item label="Описание задачи">
						<el-input type="textarea" v-model="form.description" placeholder="Описание задачи" />
					</el-form-item>
				</div>

				<div v-show="form.type == 2" key="2" class="nextFormTransition">
					<el-form-item>
						...
					</el-form-item>
				</div>

				<div v-show="form.type == 3" key="3" class="nextFormTransition">
					<el-form-item label="Описание">
						<el-input type="textarea" v-model="form.description" placeholder="Описание" />
					</el-form-item>
				</div>

				<div v-show="form.type == 4" key="4" class="nextFormTransition">
					<el-form-item label="Дата">
						<el-date-picker type="date" v-model="form.date" placeholder="Дата напоминания" />
					</el-form-item>

					<el-form-item label="Описание">
						<el-input type="textarea" v-model="form.description" placeholder="Описание" />
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

let {
	taskTypes,
} = fieldDescription


export default {
	mixins: [mixins],
	data () {
		return {
			taskTypes,
			form: {
				//all
				type: "1",
				date: "",

				//only contact
				summ: "",

				//only zamer
				region: "",
				address: "",
				comment: "",
				difficly: "",

				//only contact, zamer, orkaz, reminder
				description: ""
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
