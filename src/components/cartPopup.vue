<template>
<div class="cartWrapper">
	<div class="cartPopoverToggleButton" v-popover:cartPopover>
		Корзина
	</div>
	<el-popover ref="cartPopover" title="Корзина" trigger="click">
		<div class="cartItems">

		</div>
	</el-popover>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	data () {

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
