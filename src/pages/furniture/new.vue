<template>
<q-page class="mainWrapper furnitureNewWrapper">
	<div class="newFurniture AppContent__inner">
		<new-furniture-form />
	</div>
</q-page>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import newFurnitureForm from '@/components/forms/newFurniture'

export default {
	components: {
		newFurnitureForm
	},
}
</script>


<style lang="less">
.furnitureNewWrapper {

}
</style>
