<template>
<div class="cartItemWrapper">
	<div class="id">

	</div>
	<div class="un">

	</div>
	<div class="name">

	</div>
	<div class="price">

	</div>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	props: {
		content: {}
	},
	data () {
		return {}
	},
	watch: {

	},
	methods: {

	},
	computed: {
		data () {
			return this.content || {}
		}
	}
}
</script>


<style lang="less">
.cartItemWrapper {
	display: grid;
	grid-auto-flow: column;
}
</style>
