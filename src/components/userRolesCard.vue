<template>
	<el-card class="card userRoles">
		<h2 class="title" slot="header">Роли</h2>

		<el-transfer
			filterable
			:filter-method="filterMethod"
			filter-placeholder="Поиск"
			:titles="['Все', 'Выбраные']"
			v-model="selectedRoles"
			:data="allRoles"
		/>

		<div class="buttons"></div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	data () {
		return {
			allRoles: [],
			selectedRoles: []
		}
	},
	watch: {

	},
	methods: {

	},
	computed: {

	}
}
</script>


<style lang="less">

</style>
