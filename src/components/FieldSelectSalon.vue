<template>
<div class="FieldsSelectSalon">
	<q-input :value="current.name" readonly @click.native="form = true" float-label="Салон"/>
	<select-salon-form v-model="form" @select="select"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'
import SelectSalonForm from '@/components/forms/SelectSalon'

export default {
	components: {
		SelectSalonForm
	},
	props: {
		value: [String, Number]
	},
	data() {
		return {
			form: false
		}
	},
	watch: {
		salon_list () {
			if (this.disabled && this.salon_list[0])
				this.$emit('input', this.salon_list[0])
		}
	},
	computed: {
		...mapGetters([
			'salon_list'
		]),
		disabled () {
			return this.salon_list.length < 2
		},
		current () {
			return this.salon_list.find(el => el.id == this.value) || {}
		}
	},
	methods: {
		select (salon) {;
			this.$emit('input', salon)
		}
	},
	mounted () {
		if (this.disabled && this.salon_list[0])
			this.$emit('input', this.salon_list[0].id)
	}
}
</script>


<style lang="stylus">

</style>
