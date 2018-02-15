<template>
<div class="q-field row no-wrap items-start q-field-floating q-field-no-label">
	<div class="row col">
		<div class="q-field-content col-xs-12 col-sm">
			<div :class="wrapClass" class="q-if row no-wrap items-center relative-position q-input q-if-has-label text-primary autocomplete" @click="clickHandler">
				<div class="q-if-inner col row no-wrap items-center relative-position">
					<div :class="floatLabelClass" class="q-if-label ellipsis full-width absolute self-start">Адресс</div>
					<autocomplete @input.native="imputChange" :value="inputModel" type="text" @place_changed="placeChanged" select-first-on-enter class="col q-input-target text-left autocomplete__input" placeholder="" @focus.native="focus" @blur.native="blur" />
				</div>
			</div>
			<div class="q-field-bottom row no-wrap">
				<div class="q-field-helper col">Полный адресс на карте</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {} from 'quasar'

import {
	Autocomplete
} from 'vue2-google-maps'

export default {
	props: {
		value: {
			type: String
		}
	},
	components: {
		Autocomplete
	},
	data() {
		return {
			focused: false,
			inputModel: ""
		}
	},
	watch: {
		value (n) {
			if (this.inputModel != n)
				this.inputModel = n
		}
	},
	computed: {
		wrapClass() {
			return this.focused ? 'q-if-focused' : ''
		},
		floatLabelClass() {
			return this.focused || this.inputModel ? 'q-if-label-above' : ''
		},
	},
	methods: {
		clickHandler(e) {

		},
		focus(e) {
			this.focused = true
		},
		blur(e) {
			this.focused = false
		},
		placeChanged(e) {
			this.$emit('input', e)
		},
		imputChange(e) {
			this.inputModel = e.target.value
		}
	},
	mounted() {

	}
}
</script>


<style lang="less">
.autocomplete {
    &__input {
        }
}
</style>
