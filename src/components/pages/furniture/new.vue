<template>
<div class="mainWrapper furnitureNewWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/furniture/new` }">Заказать изготовление</el-breadcrumb-item>
	</el-breadcrumb>

	<div class="newFurniture">
		<newFurnitureForm />
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import newFurnitureForm from '@/components/forms/newFurniture'

export default {
	data() {
		return {}
	},
	components: {
		newFurnitureForm
	},
	watch: {

	},
	computed: {

	},
	methods: {

	},
	mounted () {

	}
}
</script>


<style lang="less">
.furnitureNewWrapper {

}

</style>
