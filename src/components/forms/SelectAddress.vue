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
				<q-input type="number" v-model.number="map.zoom" color="positive" inverted prefix="Масштаб: " class="seectAddress__cord" :min="0" :max="20" />
				<q-input type="number" v-model.number="marker.lat" color="positive" inverted prefix="Широта: " class="seectAddress__cord" />
				<q-input type="number" v-model.number="marker.lng" color="positive" inverted prefix="Долгота: " class="seectAddress__cord" />
			</div>
		</q-toolbar>

		<div class="seectAddress__form" v-if="modal">
			<q-field helper="Поиск по карте">
				<select-address-autocomplete v-model="place" :geocode="geocode" :animation="!!map.animation"/>
			</q-field>

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

			<div class="seectAddress__horGroup1">
				<q-field>
					<q-input v-model="addrHouse" float-label="Дом" />
				</q-field>

				<q-field>
					<q-input v-model="addrEntrance" float-label="Подезд" />
				</q-field>
			</div>

			<div class="seectAddress__horGroup2">
				<q-field>
					<q-input v-model="addrFloor" float-label="Этаж" />
				</q-field>

				<q-field>
					<q-input v-model="addrApartament" float-label="Квартира" />
				</q-field>
			</div>

			<q-field helper="Будет выбрран этот адрес">{{ addr ? addr : 'Пусто' }}</q-field>

			<div class="seectAddress__buttons">
				<q-btn color="primary" @click="save">Сохранить</q-btn>
				<q-btn color="secondary" flat @click="modal = false">Отменить</q-btn>
			</div>
		</div>

		<gmap-map v-if="modal" class="seectAddress__map" ref="map" :center="map.center" :zoom="map.zoom" @click="chickHandler" @zoom_changed="zoomChanged" @center_changed="centerChanged">
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

import {
	sortFnFactory
} from '@/api/core'

import {
	timeline,
	easing
} from 'popmotion'

const regs = {
	route: /\s?(улица|ул(\.)?)\s?/gi,
	house: /\s?(д(\.)|дом)\s?/gi,
	entrance: /\s?(подъезд)\s?/gi,
	floor: /\s?(эт\.|этаж)\s?/gi,
	apartament: /\s?(кв(\.)?|квартира)\s?/gi
}

const prefixes = {
	street_number: { reg: regs.house, prefix: 'д. ' },
	route: { reg: regs.route, prefix: 'ул. ' },
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
				currentPosition: {
					lat: 55.76,
					lng: 37.61
				},
				zoom: 10, //~вся москва
				animation: false
			},
			marker: {
				lat: 55.76,
				lng: 37.61
			},
			selected: {
				onMapPart: "",
				onMapPartShort: "",
				onMapPartSplited: [],
				nonMapPartSplited: [],
				marker: false
			},
			geocoder: new google.maps.Geocoder()
		}
	},
	watch: {
		addrM(n, o) {
			if (this.selected.marker)
				return this.selected.marker = false

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
		addr() {
			return [this.selected.onMapPartShort, this.addrNM].filter(el => el).join(', ')
		},
		addrM() {
			return this.selected.onMapPartSplited.map(el => el.long_name).filter(el => el).reverse().join(', ')
		},
		addrNM() {
			return this.selected.nonMapPartSplited.sort(sortFnFactory('index', true)).map(el => el.long_name).filter(el => el).join(', ')
		},
		addrCountry: {
			get() {
				return this.findDataM("country") || ''
			},
			set(n) {
				this.setM("country", n)
			}
		},
		addrRegion: {
			get() {
				return this.findDataM("administrative_area_level_1") || ''
			},
			set(n) {
				this.setM("administrative_area_level_1", n)
			}
		},
		addrDistrict: {
			get() {
				return this.findDataM("administrative_area_level_2") || ''
			},
			set(n) {
				this.setM("administrative_area_level_2", n)
			}
		},
		addrCity: {
			get() {
				return this.findDataM("locality") || ''
			},
			set(n) {
				this.setM("locality", n)
			}
		},
		addrStreet: {
			get() {
				return this.findDataM("route").replace(prefixes.route.reg, '') || ''
			},
			set(n) {
				this.setM("route", prefixes.route.prefix + n)
			}
		},
		addrHouse: {
			get() {
				return this.findDataM("street_number").replace(prefixes.street_number.reg, '') || ''
			},
			set(n) {
				this.setM("street_number", prefixes.street_number.prefix + n)
			}
		},
		addrEntrance: { //подезд
			get() {
				let data = this.findDataNM(regs.entrance)
				if (data)
					return data.long_name.replace(regs.entrance, '')
			},
			set(n) {
				this.setNM(this.findDataNM(regs.entrance), n ? 'подъезд ' + n : '', 2)
			}
		},
		addrFloor: { //этаж
			get() {
				let data = this.findDataNM(regs.floor)
				if (data)
					return data.long_name.replace(regs.floor, '')
			},
			set(n) {
				this.setNM(this.findDataNM(regs.floor), n ? 'этаж ' + n : '', 3)
			}
		},
		addrApartament: { //квартира
			get() {
				let data = this.findDataNM(regs.apartament)
				if (data)
					return data.long_name.replace(regs.apartament, '')
			},
			set(n) {
				this.setNM(this.findDataNM(regs.apartament), n ? 'кв. ' + n : '', 4)
			}
		},
		place: {
			get() {
				return this.selected.onMapPart
			},
			set(e) {
				if (!e.geometry) return

				this.setSplitedAddr(e.address_components)
				this.selected.onMapPartShort = e.formatted_address

				let cords = {
					lat: +e.geometry.location.lat().toFixed(6),
					lng: +e.geometry.location.lng().toFixed(6)
				}

				let zoom = this.selected.onMapPartSplited.length * 2.5

				let tl = [{
						track: 'center',
						from: this.map.currentPosition,
						to: cords,
						ease: easing.easeInOut,
						duration: 1000
					},
					{
						track: 'zoom',
						from: this.map.zoom,
						to: zoom,
						ease: easing.easeInOut,
						duration: 1000
					}
				]

				if (zoom < this.map.zoom)
					tl = tl.reverse()

				this.map.animation = timeline(tl)

				this.map.animation.start({
					update: v => {
						if (v.center) this.map.center = { ...v.center }
						if (v.zoom) this.map.zoom = +v.zoom.toFixed()
					},
					complete: a => this.map.animation = false
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
		setM(type, long_name) {
			let data = this.selected.onMapPartSplited.find(el => el.types.indexOf(type) + 1)
			if (!data)
				this.selected.onMapPartSplited.push({
					long_name,
					types: [type]
				})
			else
				data.long_name = long_name
		},
		setNM(data, long_name, index = 0) {
			if (!data)
				this.selected.nonMapPartSplited.push({
					long_name,
					index
				})
			else
				data.long_name = long_name
		},
		async chickHandler(e) {
			this.selected.marker = true
			let cords = {
				lat: +e.latLng.lat().toFixed(6),
				lng: +e.latLng.lng().toFixed(6)
			}
			this.marker = cords
			await this.getCordsInfo(cords)
		},
		zoomChanged (e) {
			if (this.map.zoom != e)
				this.map.zoom = e
		},
		async getCordsInfo (location) {
			let res = await this.geocode({ location })
			if (!(res && res.data && res.data[0])) return
			console.log(res.data[0]);
			this.setSplitedAddr(res.data[0].address_components)
			this.selected.onMapPartShort = res.data[0].formatted_address
		},
		geocode (props) {
			return new Promise((resolve, reject) => {
				this.geocoder.geocode(props, (data, status) => {
					if (status == google.maps.GeocoderStatus.OK || status == google.maps.GeocoderStatus.ZERO_RESULTS)
						return resolve({ data, status })

					if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
						data = "Лимит использования Geocoding API на сегодня превышен! Вы можете сменить тариф для получения большего количества запросов."

					this.$store.dispatch('alert',  '[Geocoder API] ' + (data ? data : status))
					resolve()
				})
			})
		},
		centerChanged (e) {
			this.map.currentPosition = {
				lat: +e.lat().toFixed(6),
				lng: +e.lng().toFixed(6)
			}
		},
		setSplitedAddr (address_components) {
			if (!address_components) return

			const reduce = el =>
				el.types.indexOf(prop) + 1 ?
					({ ...el, long_name: prefixes[prop].prefix + el.long_name })
				:	el

			for (var prop in prefixes)
				if (prefixes.hasOwnProperty(prop))
					address_components = address_components.map(reduce)

			this.selected.onMapPartSplited = address_components
		},
		save () {
			this.$emit('select', this.addr)
			this.modal = false
		}
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
        grid-template-columns: 300px 1fr;
        &-mobile {
            grid-template-columns: 1fr;
        }
    }

    &__horGroup1 {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 15px;
    }

	&__horGroup2 {
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
