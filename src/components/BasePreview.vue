<template>
	<div class="PasePreview">
		<clickable @click.native.stop="open = !open" :inline="inline" :width="width">
			<slot name="button"/>
		</clickable>

		<q-popover v-model="open" class="PasePreview__popover">
			<slot/>
		</q-popover>
	</div>
</template>

<script>
import Clickable from '@/components/Clickable'

export default {
	props: {
		inline: {
			type: Boolean,
			default: a => false
		},
		width: {
			type: [Number, String],
			default: a => 'auto'
		}
	},
	components: {
		Clickable
	},
	data() {
		return {
			open: false
		}
	},
}
</script>


<style lang="stylus">
.PasePreview
	&__popover
		box-shadow 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)
		overflow hidden
		max-width 96vw
		transform translateX(2vw)
		> div
			width 100%
			height 100%
</style>
