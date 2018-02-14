<template>
	<q-modal ref="modal" v-model="modal" :content-classes="modalClass">
		<q-modal-layout :content-class="layoutClass">
			<q-toolbar slot="header">
				<q-btn flat @click="$refs.modal.close()">
					<q-icon name="keyboard_arrow_left" />
				</q-btn>

				<q-toolbar-title>
					Выбор адреса
				</q-toolbar-title>
			</q-toolbar>

			<div class="seectAddress__form" v-ga="'f'">
				{{ marker }} {{ map.zoom }}

				<autocomplete @place_changed="setPlace"/>

				<q-field helper="Полный адресс">
					<q-input v-model="selected.fullAddr" float-label="Адресс"/>
				</q-field>

				<q-field>
					<q-input v-model="selected.fullAddr" float-label="Страна"/>
				</q-field>

				<q-field>
					<q-input v-model="selected.fullAddr" float-label="Область"/>
				</q-field>

				<q-field>
					<q-input v-model="selected.fullAddr" float-label="Район"/>
				</q-field>

				<q-field>
					<q-input v-model="selected.fullAddr" float-label="Город"/>
				</q-field>

				<q-field>
					<q-input v-model="selected.fullAddr" float-label="Улица"/>
				</q-field>

				<div class="seectAddress__horGroup">
					<q-field>
						<q-input v-model="selected.fullAddr" float-label="Дом"/>
					</q-field>

					<q-field>
						<q-input v-model="selected.fullAddr" float-label="Корпус"/>
					</q-field>

					<q-field>
						<q-input v-model="selected.fullAddr" float-label="Подезд"/>
					</q-field>
				</div>

				<div class="seectAddress__horGroup">
					<q-field>
						<q-input v-model="selected.fullAddr" float-label="Этаж"/>
					</q-field>

					<q-field>
						<q-input v-model="selected.fullAddr" float-label="Квартира"/>
					</q-field>
				</div>
			</div>

			<div class="seectAddress__buttons" v-ga="'b'">
				<q-btn color="primary">Сохранить</q-btn>
				<q-btn color="secondary" flat @click="modal = false">Отменить</q-btn>
			</div>

			<gmap-map
				v-if="modal"
				v-ga="'m'"
				class="seectAddress__map"
				ref="map"
				:center="map.center"
				:zoom="map.zoom"
				@click="chickHandler">
				<gmap-marker v-if="marker.lng && marker.lat" :position="marker"/>
			</gmap-map>
		</q-modal-layout>
	</q-modal>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QModal, QModalLayout, QToolbar, QBtn, QIcon, QInput, QField, QToolbarTitle } from 'quasar'

import { Autocomplete } from 'vue2-google-maps'

console.log(Autocomplete);

export default {
	props: {
		value: {
			type: Boolean,
			required: true
		}
	},
	components: {
		QModal,
		QModalLayout,
		QToolbar,
		QBtn,
		QIcon,
		QInput,
		QField,
		QToolbarTitle,
		Autocomplete
	},
	data() {
		return {
			map: {
				show: false,
				center: { lat: 55.76, lng: 37.61 },
				zoom: 7
			},
			marker: {
				lat: "",
				lng: ""
			},
			selected: {
				fullAddr: ""
			}
		}
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		modal: {
			get () { return this.value },
			set (n) { this.$emit('input', n) }
		},
		modalClass () {
			return 'seectAddress' + (this.app_view_mobile ? '-mobile' : '')
		},
		layoutClass () {
			return 'seectAddress__layout' + (this.app_view_mobile ? '-mobile' : '')
		}
	},
	methods: {
		chickHandler (e) {
			this.marker = { lat: e.latLng.lat(), lng: e.latLng.lng()}
			console.log(e);
		},
		setPlace (e) {
			console.log(e, e.geometry);
		}
	},
	mounted () {
		this.map.show = true
		console.log(google);
	},
	beforeDestroy () {
		this.map.show = false
	}
}
</script>


<style lang="less">
.seectAddress {
	width: 90%;
	height: 100%;

	&-mobile {
		width: 100%;
		height: auto;
		min-height: 100%;
	}

	&__map {
		width: 100%;
		height: 100%;
	}

	&__layout {
		display: grid;
		grid-template: 	"f m"
						"b m"
					~"/" 300px 1fr;
		&-mobile {
			grid-template-columns: 1fr;
		}
	}

	&__horGroup {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 15px;
	}

	&__form {
		height: 100%;
		box-sizing: border-box;
		padding: 8px;
	}

	&__buttons {
		align-self: end;
		display: grid;
		grid-auto-flow: column;
		grid-gap: 15px;
		padding: 20px;
	}
}

</style>
