<template>
<q-modal :value="value" @input="input" ref="selectPlaceModal" class="selectPlaceModal" minimized :content-css="{padding: '50px'}">
	<h4 class="selectPlaceModal__title">Отметить прибывшие</h4>

	<q-field helper="Салон" v-if="salons.length > 1">
		<q-select v-model="salon" :options="salons"/>
	</q-field>

	<q-field helper="Место хранения">
		<q-select v-model="place" :options="places"/>
	</q-field>

	<q-btn color="primary" @click="save">Сохранить</q-btn>
	<q-btn color="secondary" flat v-close-overlay>Отменить</q-btn>
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
	QBtn,
	QSelect,
	QField
} from 'quasar'

export default {
	props: {
		value: {
			type: Boolean,
			required: true
		}
	},
	components: {
		QModal,
		QBtn,
		QSelect,
		QField
	},
	data() {
		return {
			salon: null,
			place: ""
		}
	},
	watch: {
		auth_currentSalon (n) {
			this.salon = n.ID_SALONA + ""
		},
		salon (n) {
			this.salon_getPlaces(n)
		},
		places (n) {
			this.place = n[0] ? n[0].value : ""
		},
		value (n) {
			if (!n) return
			if (this.salons.length < 2 && this.places.length == 1)
				this.save()
		}
	},
	computed: {
		...mapGetters([
			'auth_currentSalon',
			'salon_places',
			'salon_listWithAll'
		]),
		salons () {
			return this.salon_listWithAll.map(el => ({
				label: el.NAME,
				value: el.ID_SALONA
			}))
		},
		places () {
			return this.salon_places.map(el => ({
				label: el.NAME,
				value: el.IDN
			}))
		}
	},
	methods: {
		...mapActions([
			'salon_getPlaces',
			'salon_getList'
		]),
		input (e) {
			this.$emit('input', e)
		},
		save () {
			this.$emit('select', { salon: this.salon, place: this.place })
			this.$emit('input', false)
		}
	},
	async mounted () {
		await this.salon_getList()
		this.salon = this.auth_currentSalon.ID_SALONA + ""
	}
}
</script>


<style lang="less">
.selectPlaceModal {
	&__title {
		margin: 5px 0 30px 0;
	}
}
</style>
