<template>
<div class="SelectOrCreateAddressForm">
	<q-select v-model="model" :options="options"/>
	<select-address-form v-model="showSelectAddress" @select="select"/>
</div>
</template>

<script>
import SelectAddressForm from '@/components/forms/SelectAddress'
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

export default {
	components: {
		SelectAddressForm
	},
	props: {
		value: {
			type: Object,
			default: a => ({})
		},
		markers: {
			type: Array,
			default: a => [
				{ address: 'test address', lat: 123, lng: 12 },
				{ address: 'test address2', lat: 143, lng: 2 },
				{ address: 'test fggsdf gsdf gsdfgsd g dsfgsdfgsdfgsdfgsdfgsdfgdfsfgdg', lat: 22, lng: 11 },
			]
		}
	},
	data() {
		return {
			localModel: {},
			showSelectAddress: false
		}
	},
	watch: {

	},
	computed: {
		options () {
			let markers = this.markers.map((value, index) => {
				return {
					index,
					label: value.address,
					value
				}
			})

			return [...markers, {
				label: this.localModel.address,
				sublabel: 'Создать',
				value: false
			}]
		},
		model: {
			get () {
				return this.selectedNew ? false : this.value
			},
			set (val) {
				if (!val)
					return this.showSelectAddress = true

				this.$emit('input', val)
			}
		},
		selectedNew () {
			return this.markers.indexOf(this.value) == -1
		}
	},
	methods: {
		select (e) {
			console.log(e);
			this.localModel = e
			this.$emit('input', e)
		}
	},
	mounted () {

	}
}
</script>


<style lang="stylus">

</style>
