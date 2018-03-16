<template>
	<select-salon-form :value="value" @input="input" @select="auth_currentSalonSet" :no-close="noClose"/>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import SelectSalonForm from '@/components/forms/SelectSalon'

export default {
	props: {
		value: {
			type: Boolean,
			required: true
		},
		noClose: {
			type: Boolean,
			default: a => false
		}
	},
	components: {
		SelectSalonForm
	},
	methods: {
		...mapActions([
			'auth_currentSalonSet'
		]),
		input (e) {
			this.$emit('input', e)
		},
	}
}
</script>


<style lang="less"></style>
