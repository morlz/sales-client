<template>
<div class="endTaskFormWrapper" v-if="auth_can(3, 'Task')">
	<div class="cards">
		<prev-task-form v-if="+oneId" />

		<next-task-form scenario="END_TASK">
			<div class="buttons" slot="buttons">
				<q-btn color="primary" @click="task_create">Создать</q-btn>
				<q-btn @click="goToPreorder(preorder_current.id || task_current.preorder_id)" flat color="secondary">К предзаказу</q-btn>
			</div>
		</next-task-form>

		<loading :value="task_loadingAdd"/>
	</div>
</div>
</template>

<script>
import nextTaskForm from '@/components/forms/nextTask.vue'
import prevTaskForm from '@/components/forms/prevTask.vue'
import { AuthMixin, RouteMixin } from '@/mixins'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Loading from '@/components/Loading'

export default {
	mixins: [AuthMixin, RouteMixin],
	components: {
		nextTaskForm,
		prevTaskForm,
		Loading
	},
	computed: {
		...mapGetters([
			'task_current',
			'task_loadingAdd',
			'preorder_current'
		])
	},
	methods: {
		...mapActions([
			'task_create'
		]),
		...mapMutations([
			'task_add_prevSet'
		]),
		goToPreorder (id) {
			this.$router.push(`/preorder/preorders/${id}`)
		}
	},
	mounted () {
		if (!this.preorder_current.id && !this.task_current.preorder_id)
			router.push({ path: `/` })

		this.task_add_prevSet({})
	}
}
</script>


<style lang="less">
.endTaskFormWrapper {
    .cards {
        display: grid;
        grid-gap: 20px;
        grid-template-columns: 1fr 1fr;
		position: relative;
		.card {
			position: relative;
		}
        .nextFormTransitionWrapper {
            .buttons {
                display: grid;
                grid-auto-flow: column;
                justify-content: flex-start;
            }
        }
    }
}

@media screen and (max-width: 1200px) {
    .endTaskFormWrapper {
        .cards {
            grid-template-columns: 1fr;
        }
    }
}
</style>
