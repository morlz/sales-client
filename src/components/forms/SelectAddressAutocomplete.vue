<template>
<q-input float-label="Адресс" v-model="inputModel" @blur="blurHandler" autofocus @click="focusHander">
	<q-autocomplete
		ref="ac"
		@search="search"
		@selected="selected"
		:min-characters="3"/>
</q-input>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QInput, QAutocomplete } from 'quasar'

export default {
	props: {
		value: {
			type: String
		},
		componentRestrictions: {
			type: [Array, String]
		},
		geocode: {
			type: Function,
			required: true
		},
		animation: {
			type: Boolean,
			default: a => false
		}
	},
	components: {
		QInput,
		QAutocomplete
	},
	data() {
		return {
			focus: false,
			inputModel: "",
			throttleTimeout: false
		}
	},
	watch: {
		animation (n) {
			if (n) return

			return
			this.setValueToModel()
		},
		value () {
			if (this.focus || this.animation) return
			this.setValueToModel()
		},
	},
	methods: {
		focusHander (e) {
			if (!this.focus) this.$emit('trigger')
			this.focus = true
		},
		blurHandler (e) {
			this.focus = false
			this.setValueToModel()
		},
		setValueToModel () {
			if (this.inputModel == this.value) return
			this.inputModel = this.value
		},
		async search (address, done) {
			let res = await this.geocode({ address })
			if (!res && !res.data) return
			done(res.data.map(el => ({ ...el, value: el.formatted_address, label: el.formatted_address })))
		},
		selected (e) {
			this.$emit('input', e)
		},
	},
	mounted() {
		this.inputModel = this.value
		this.$on('trigger', a => {
			if (!this.$refs.ac) return
			this.$refs.ac.trigger()
		})
	}
}
</script>


<style lang="less">
.autocomplete {
    &__input {}
}
</style>
