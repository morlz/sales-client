<template>
	<q-card class="InfoCardCurrentTasksSalon">
		<q-card-title>
			Задачи салона
		</q-card-title>

		<q-card-main>
			<q-list no-border v-if="task_todaySalon.length">
				<q-item
					v-for="task in task_todaySalon"
					:key="task.id"
					@click.native="$router.push('preorder/preorders/' + task.preorder_id)"
					class="cursor-pointer">
					<q-item-side
						v-if="task.expired"
						icon="error_outline"/>

					<q-item-main>
						<q-item-tile v-if="task.client">
							{{ task.client.fio }}
						</q-item-tile>

						<q-item-tile>
							{{ task.description }}
						</q-item-tile>
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
			'task_todaySalon'
		])
	},
	created () {
		this.$store.dispatch('task_getSalonCurrentTasks')
	}
}
</script>


<style lang="stylus">

</style>
