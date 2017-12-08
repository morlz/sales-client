<template>
	<div class="mainWrapper">
		<tabless :data="data" :fieldDescription="fieldDescription" v-loading="loadingTasks" />
	</div>
</template>



<script>
let fieldDescription = [
	//{ field: "id", label: "№", type: "string" },
	{ field: "fio", label: "ФИО", type: "string" },
	{ field: "description", label: "Задача", type: "string" },
	{ field: "date", label: "Дата", type: "string" },
	{ field: "manager", label: "Ответсвенный", type: "string" },
	{ field: "type", label: "Тип", type: "string" },
	//{ field: "endManager", label: "Завершил", type: "string" },
	//{ field: "endDate", label: "Дата завершения", type: "string" },
	//{ field: "summ", label: "Сумма", type: "number" },
	//{ field: "created_at", label: "Дата создания", type: "string" },
	//{ field: "creatorManager", label: "Создатель", type: "string" },
	{ field: "salon", label: "Салон", type: "string" },
]

import { mapGetters, mapActions } from 'vuex'
import tabless from '@/components/tableSS.vue'

export default {
	data () {
		return {
			fieldDescription
		}
	},
	components: {
		tabless
	},
	computed: {
		...mapGetters([
			'cachedTasksFormated',
			'loadingTasks'
		]),
		data () {
			return this.cachedTasksFormated
		},
	},
	methods: {
		...mapActions([
			'getAllTasks'
		])
	},
	mounted () {
		this.getAllTasks()
	}
}

</script>



<style lang="less" scoped>


</style>
