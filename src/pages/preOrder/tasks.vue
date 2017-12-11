<template>
	<div class="mainWrapper">
		<div class="oneClientWrapper" v-if="isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: `/preorder/tasks/${oneId}` }">Задача №{{oneId}}</el-breadcrumb-item>
			</el-breadcrumb>

			<el-form>
				<el-card>
					<h2 slot="header">Общая информация</h2>

					<el-card>
						{{ currentTask }}
					</el-card>
				</el-card>
			</el-form>
		</div>

		<div class="manyClientsWrapper" v-if="!isOne">
			<el-breadcrumb separator="/" class="bc">
				<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/preorder/tasks' }">Список задач</el-breadcrumb-item>
			</el-breadcrumb>
			<tabless :data="data" :fieldDescription="tasksManyFieldDescription" v-loading="loadingTasks" @onClick="routerGoId" />
		</div>
	</div>
</template>



<script>

import fieldDescription from '@/static/fieldDescription'

let { tasksManyFieldDescription } = fieldDescription


import { mapGetters, mapActions } from 'vuex'
import tabless from '@/components/tableSS.vue'
import mixins from '@/components/mixins'

export default {
	data () {
		return {
			tasksManyFieldDescription
		}
	},
	mixins: [mixins],
	components: {
		tabless
	},
	watch: {
		oneId () {
			if (this.oneId !== undefined) {
				this.getOneTask(this.oneId)
			} else {
				this.getAllTasks()
			}
		}
	},
	computed: {
		...mapGetters([
			'cachedTasksFormated',
			'loadingTasks',
			'loadingCurrentTask',
			'currentTask'
		]),
		data () {
			return this.cachedTasksFormated
		},
		isOne(){
			return this.$route.params.id !== undefined
		},
		oneId () {
			return this.$route.params.id
		}
	},
	methods: {
		...mapActions([
			'getAllTasks',
			'getOneTask'
		])
	},
	mounted () {
		if (this.oneId !== undefined) {
			this.getOneTask(this.oneId)
		} else {
			this.getAllTasks()
		}
	}
}

</script>



<style lang="less" scoped>


</style>
