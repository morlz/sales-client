<template>
<div class="mainWrapper personalWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/admin/personal` }">Персонал</el-breadcrumb-item>
	</el-breadcrumb>
</div>
</template>

<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

export default {
	data() {
		return {}
	},
	methods: {
		...mapActions([

		]),
		...mapMutations([

		])
	},
	computed: {
		...mapGetters([

		])
	},
	mounted() {

	}
}
</script>



<style lang="less">

</style>
