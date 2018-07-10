<template>
	<q-card class="InfoCardCurrentTasksManager">
		<q-card-title>
			Мои задачи
		</q-card-title>

		<q-card-main>
			<q-list no-border v-if="task_today.length">
				<q-item
					v-for="task in task_today"
					:key="task.id"
					@click.native="$router.push('preorder/preorders/' + task.preorder_id)"
					class="cursor-pointer">
					<q-item-main>
						{{ task.description }}
					</q-item-main>

					<q-item-side right>
						{{ task.type.title }}
					</q-item-side>
				</q-item>
			</q-list>

			<div v-else>
				Задач нет
			</div>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { InfoCardTasks } from '@/static/fieldDescription'
import { AuthMixin, RouteMixin } from '@/mixins'
import PreviewClient from '@/components/PreviewClient'

export default {
	props: ['content'],
	mixins: [AuthMixin, RouteMixin],
	components: {
		PreviewClient
	},
	data () {
		return {
			InfoCardTasks
		}
	},
	watch: {

	},
	methods: {
		clickEndHandle () {
			router.push({ path: `/preorder/tasks/${this.taskToEnd.id || 0}` })
		}
	},
	computed: {
		...mapGetters([
			'task_today'
		])
	},
	created () {
		this.$store.dispatch('task_getUserCurrentTasks')
	}
}
</script>


<style lang="stylus">

</style>
