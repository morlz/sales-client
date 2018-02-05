<template>
<div class="mainWrapper furnitureNewWrapper">
	<ul class="breadcrumb">
		<li><router-link :to="{ path: '/' }">Главная</router-link></li>
		<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
		<li><router-link :to="{ path: '/furniture/new' }">Заказать изготовление</router-link></li>
	</ul>

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
