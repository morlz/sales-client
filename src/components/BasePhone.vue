<template>
<div class="BasePhone">
	<input
		v-if="show"
		type="text"
		class="BasePhone__input"
		:value="value | phone"
		readonly
		@cut.stop.prevent="copy"
		@copy.stop.prevent="copy" />

	<q-btn
		v-else
		color="primary"
		class="BasePhone__button"
		flat
		wait-for-ripple
		@click="show = true">
		Показать номер
	</q-btn>

	<div class="BasePhone__fill"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import { QSlideTransition } from 'quasar'

export default {
	components: {
		QSlideTransition
	},
	props: {
		value: [Number, String],
		place: Object
	},
	data() {
		return {
			show: false
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
	&__input
		border 0
		background transparent
		width 156px
		height 36px
</style>
