<template>
<div class="tableTwoCollumns">
	<slot/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {} from 'quasar'

export default {
	data() {
		return {}
	},
	components: {

	},
	watch: {

	},
	computed: {

	},
	methods: {

	},
}
</script>

<style lang="less">
.tableTwoCollumns {
	display: grid;
}
</style>
