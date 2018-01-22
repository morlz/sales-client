<template>
<div class="endTaskFormWrapper" v-if="auth_can(3, 'Task')">
	<div class="cards" v-loading="task_loadingAdd">
		<prev-task-form v-if="+oneId" />

		<next-task-form scenario="END_TASK">
			<div class="buttons" slot="buttons">
				<el-button type="primary" @click="task_create">Создать</el-button>
				<el-button @click="goToPreorder('', preorder_current.id || task_current.preorder_id)">К предзаказу</el-button>
			</div>
		</next-task-form>
	</div>
</div>
</template>

<script>
import nextTaskForm from '@/components/forms/nextTask.vue'
import prevTaskForm from '@/components/forms/prevTask.vue'
import mixins from '@/components/mixins'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	mixins: [mixins],
	components: {
		nextTaskForm,
		prevTaskForm
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
		])
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
