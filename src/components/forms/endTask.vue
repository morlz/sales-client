<template>
<div class="endTaskFormWrapper" v-if="auth_can(3, 'Task')">
	<div class="cards">
		<prev-task-form />
		<next-task-form>
			<div class="buttons" slot="buttons">
				<el-button type="primary">Создать</el-button>
				<el-button @click="goToPreorder('', task_current.preorder_id)">Вернуться к предзаказу</el-button>
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
			'task_current'
		])
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
