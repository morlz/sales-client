<template>
<q-input float-label="Адресс" v-model="inputModel" @focus="focusHander" @blur="blurHandler" autofocus/>
</template>

<script>

/*
<div class="q-field row no-wrap items-start q-field-floating q-field-no-label">
	<div class="row col">
		<div class="q-field-content col-xs-12 col-sm">
			<div :class="wrapClass" class="q-if row no-wrap items-center relative-position q-input q-if-has-label text-primary autocomplete" @click="clickHandler">
				<div class="q-if-inner col row no-wrap items-center relative-position">
					<div :class="floatLabelClass" class="q-if-label ellipsis full-width absolute self-start">Адресс</div>
					<autocomplete @input.native="inputChange" @place_changed="placeChanged" @focus.native="focus" @blur.native="blur" :value="inputModel" :component-restrictions="componentRestrictions" type="text" select-first-on-enter class="col q-input-target text-left autocomplete__input"
					    placeholder="" ref="ac" />
				</div>
			</div>
			<div class="q-field-bottom row no-wrap">
				<div class="q-field-helper col">Полный адресс на карте</div>
			</div>
		</div>
	</div>
</div>
*/
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QInput } from 'quasar'

import {
	Autocomplete
} from 'vue2-google-maps'

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
		QInput
	},
	data() {
		return {
			focus: false,
			searchModel: "",
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
		inputModel (n) {
			if (this.throttleTimeout)
				clearTimeout(this.throttleTimeout)

			this.throttleTimeout = setTimeout(a => this.searchModel = n, 1000)
		},
		async searchModel (address) {
			if (!address) return
			let res = await this.geocode({ address })
			if (res && res.data && res.data[0]) this.$emit('input', res.data[0])
		}
	},
	methods: {
		focusHander (e) {
			this.focus = true
		},
		blurHandler (e) {
			this.focus = false
			this.setValueToModel()
		},
		setValueToModel () {
			if (this.inputModel == this.value) return

			this.inputModel = this.value
		}
	},
	mounted() {
		this.inputModel = this.value
	}
}
</script>


<style lang="less">
.autocomplete {
    &__input {}
}
</style>
