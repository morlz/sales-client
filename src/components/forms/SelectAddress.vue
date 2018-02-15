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

			<div class="seectAddress__cords">
				<q-input type="number" v-model.number="map.zoom" color="positive" inverted prefix="Масштаб: " class="seectAddress__cord" :min="0" :max="20"/>
				<q-input type="number" v-model.number="marker.lat" color="positive" inverted prefix="Широта: " class="seectAddress__cord"/>
				<q-input type="number" v-model.number="marker.lng" color="positive" inverted prefix="Долгота: " class="seectAddress__cord"/>
			</div>
		</q-toolbar>

		<div class="seectAddress__form" v-ga="'f'">
			<select-address-autocomplete v-model="place" />

			<q-field>
				<q-input v-model="addrCountry" float-label="Страна" />
			</q-field>

			<q-field>
				<q-input v-model="addrRegion" float-label="Область" />
			</q-field>

			<q-field>
				<q-input v-model="addrDistrict" float-label="Район" />
			</q-field>

			<q-field>
				<q-input v-model="addrCity" float-label="Город" />
			</q-field>

			<q-field>
				<q-input v-model="addrStreet" float-label="Улица" />
			</q-field>

			<div class="seectAddress__horGroup">
				<q-field>
					<q-input v-model="addrHouse" float-label="Дом" />
				</q-field>

				<q-field>
					<q-input v-model="addrHousing" float-label="Корпус" />
				</q-field>

				<q-field>
					<q-input v-model="addrEntrance" float-label="Подезд" />
				</q-field>
			</div>

			<div class="seectAddress__horGroup">
				<q-field>
					<q-input v-model="addrFloor" float-label="Этаж" />
				</q-field>

				<q-field>
					<q-input v-model="addrApartament" float-label="Квартира" />
				</q-field>
			</div>

			<q-field helper="Будет выбрран этот адрес">{{ addr ? addr : 'Пусто' }}</q-field>
		</div>

		<div class="seectAddress__buttons" v-ga="'b'">
			<q-btn color="primary">Сохранить</q-btn>
			<q-btn color="secondary" flat @click="modal = false">Отменить</q-btn>
		</div>

		<gmap-map v-if="modal" v-ga="'m'" class="seectAddress__map" ref="map" :center="map.center" :zoom="map.zoom" @click="chickHandler">
			<gmap-marker v-if="marker.lng && marker.lat" :position="marker" />
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

import {
	QModal,
	QModalLayout,
	QToolbar,
	QBtn,
	QIcon,
	QInput,
	QField,
	QToolbarTitle
} from 'quasar'

import SelectAddressAutocomplete from '@/components/forms/SelectAddressAutocomplete'

import { sortFnFactory } from '@/api/core'

import { timeline, easing } from 'popmotion'

const regs = {
	housing: /\s?(корпус|корп(\.)?)\s?/gi,
	entrance: /\s?(подъезд)\s?/gi,
	floor: /\s?(эт\.|этаж)\s?/gi,
	apartament: /\s?(кв(\.)?|квартира)\s?/gi
}


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
		SelectAddressAutocomplete
	},
	data() {
		return {
			map: {
				show: false,
				center: {
					lat: 55.76,
					lng: 37.61
				}, //центр москвы
				zoom: 10, //~вся москва
				animation: false
			},
			marker: {
				lat: 55.76,
				lng: 37.61
			},
			selected: {
				onMapPart: "",
				onMapPartSplited: [],
				nonMapPartSplited: []
			}
		}
	},
	watch: {
		addrM (n) {
			this.selected.onMapPart = n
		}
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		modal: {
			get() {
				return this.value
			},
			set(n) {
				this.$emit('input', n)
			}
		},
		modalClass() {
			return 'seectAddress' + (this.app_view_mobile ? '-mobile' : '')
		},
		layoutClass() {
			return 'seectAddress__layout' + (this.app_view_mobile ? '-mobile' : '')
		},
		addr () {
			return [this.addrM, this.addrNM].filter(el => el).join(', ')
		},
		addrM () {
			return this.selected.onMapPartSplited.map(el => el.long_name).filter(el => el).reverse().join(', ')
		},
		addrNM () {
			return this.selected.nonMapPartSplited.sort(sortFnFactory('index', true)).map(el => el.long_name).filter(el => el).join(', ')
		},
		addrCountry: {
			get () {
				return this.findDataM("country") || ''
			},
			set (n) {
				this.setM("country", n)
			}
		},
		addrRegion: {
			get () {
				return this.findDataM("administrative_area_level_1") || ''
			},
			set (n) {
				this.setM("administrative_area_level_1", n)
			}
		},
		addrDistrict: {
			get () {
				return this.findDataM("administrative_area_level_2") || ''
			},
			set (n) {
				this.setM("administrative_area_level_2", n)
			}
		},
		addrCity: {
			get () {
				return this.findDataM("locality") || ''
			},
			set (n) {
				this.setM("locality", n)
			}
		},
		addrStreet: {
			get () {
				return this.findDataM("route") || ''
			},
			set (n) {
				this.setM("route", n)
			}
		},
		addrHouse: {
			get () {
				return this.findDataM("street_number") || ''
			},
			set (n) {
				this.setM("street_number", n)
			}
		},
		addrHousing: { //корпус
			get () {
				let data = this.findDataNM(regs.housing)
				if (data)
					return data.long_name.replace(regs.housing, '')
			},
			set (n) {
				this.setNM(this.findDataNM(regs.housing), n ? 'корп. ' + n : '', 1)
			}
		},
		addrEntrance: { //подезд
			get () {
				let data = this.findDataNM(regs.entrance)
				if (data)
					return data.long_name.replace(regs.entrance, '')
			},
			set (n) {
				this.setNM(this.findDataNM(regs.entrance), n ? 'подъезд ' + n : '', 2)
			}
		},
		addrFloor: { //этаж
			get () {
				let data = this.findDataNM(regs.floor)
				if (data)
					return data.long_name.replace(regs.floor, '')
			},
			set (n) {
				this.setNM(this.findDataNM(regs.floor), n ? 'этаж ' + n : '', 3)
			}
		},
		addrApartament: { //квартира
			get () {
				let data = this.findDataNM(regs.apartament)
				if (data)
					return data.long_name.replace(regs.apartament, '')
			},
			set (n) {
				this.setNM(this.findDataNM(regs.apartament), n ? 'кв. ' + n : '', 4)
			}
		},
		place: {
			get () {
				return this.selected.onMapPart
			},
			set (e) {
				console.log(e);
				if (!e.geometry) return

				this.selected.onMapPartSplited = e.address_components
				this.selected.onMapPart = this.addrM

				let cords = {
					lat: +e.geometry.location.lat().toFixed(6),
					lng: +e.geometry.location.lng().toFixed(6)
				}

				let zoom = this.selected.onMapPartSplited.length * 2.5

				let tl = [
					{ track: 'center', from: this.map.center, to: cords, ease: easing.easeInOut, duration: 1000 },
					{ track: 'zoom', from: this.map.zoom, to: zoom, ease: easing.easeInOut, duration: 1000 }
				]

				if (zoom < this.map.zoom)
					tl = tl.reverse()

				this.map.animation = timeline(tl)

				this.map.animation.start(({ center, zoom }) => {
					this.map.center = { ...center }
					this.map.zoom = +zoom.toFixed()
				})

				this.marker = cords
			}
		}
	},
	methods: {
		findDataM(type) { // M - map
			let data = this.selected.onMapPartSplited.find(el => el.types.indexOf(type) + 1)
			return data ? data.long_name : ''
		},
		findDataNM(reg) { // NM - not on map
			return this.selected.nonMapPartSplited.find(el => el.long_name.search(reg) + 1)
		},
		setM (type, long_name) {
			let data = this.selected.onMapPartSplited.find(el => el.types.indexOf(type) + 1)
			if (!data)
				this.selected.onMapPartSplited.push({ long_name, types: [type] })
			else
				data.long_name = long_name
		},
		setNM (data, long_name, index = 0) {
			if (!data)
				this.selected.nonMapPartSplited.push({ long_name, index })
			else
				data.long_name = long_name
		},
		chickHandler(e) {
			this.marker = {
				lat: +e.latLng.lat().toFixed(6),
				lng: +e.latLng.lng().toFixed(6)
			}
		},
	},
	mounted() {
		this.map.show = true
	},
	beforeDestroy() {
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
		height: ~"calc(100% - 50px)";
        display: grid;
        grid-template: "f m" "b m" ~"/" 300px 1fr;
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
		overflow-x: auto;
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

	&__cords {
		display: grid;
		grid-auto-flow: column;
		justify-content: end;
		grid-gap: 10px;
	}

	&__cord {
		width: 165px;
		margin: 0;
		padding: 5px;
		min-height: 20px;
	}

	&__zoom {
		width: 165px;
		margin: 0;
		padding: 5px;
		min-height: 20px;

	}
}

.pac {
    &-container {
        z-index: 6000;
    }
}
</style>
