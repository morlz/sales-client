<template>
<div class="BasePhone" :class="{ 'hiddenNumber': !focus }">
	<div class="BasePhone__inner">
		{{ value | phone }}
	</div>
	<input type="text" class="BasePhone__input" :value="value | phone" readonly @focus="focus = true" @blur="focus = false" @cut.stop.prevent="copy" @copy.stop.prevent="copy" />
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

export default {
	props: {
		value: [Number, String],
		place: Object
	},
	data() {
		return {
			focus: false
		}
	},
	methods: {
		copy(e) {
			const el = document.createElement('textarea')
			el.value = this.value
			document.body.appendChild(el)
			el.select()
			document.execCommand('copy')
			document.body.removeChild(el)
		}
	},
	filters: {
		phone(value) {
			var numbers = value.replace(/\D/g, ''),
				char = {
					1: ' (',
					4: ') ',
					7: '-',
					9: '-'
				}

			value = ''
			for (var i = 0; i < numbers.length; i++)
				value += (char[i] || '') + numbers[i]

			return value
		}
	}
}
</script>


<style lang="stylus">
.BasePhone
	position relative
	transition all .3s ease-in-out
	&__input
		margin-left 3px
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		border 0
		background transparent
		color transparent

	&__inner
		user-select none
</style>
