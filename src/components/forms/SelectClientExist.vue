<template>
	<div class="SelectClientExist">
		<q-field>
			<q-toggle v-model="mainContact.disableSMS" disabled label="sms-рассылка запрещена"/>
		</q-field>

		<q-field>
			<q-input v-model="mainContact.fio" float-label="ФИО" readonly />
		</q-field>

		<q-field label="Пол">
			{{ mainContact.gender ? 'Мужской' : 'Женский' }}
		</q-field>

		<q-field helper="Описание пользователя">
			<q-input v-model="mainContact.signs" float-label="Приметы" readonly/>
		</q-field>

		<q-field helper="some@email.com">
			<q-input v-model="mainContact.email" float-label="Эл почта" readonly />
		</q-field>

		<q-field>
			<q-toggle v-model="mainContact.disableEMAIL" disabled label="Email-рассылка запрещена"/>
		</q-field>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QField, QInput, QToggle } from 'quasar'

export default {
	components: {
		QField,
		QInput,
		QToggle
	},
	data() {
		return {

		}
	},
	computed: {
		...mapGetters([
			'client_select_current'
		]),
		mainContact () {
			if (!this.client_select_current.contactfaces)
				return {}
			let contact = this.client_select_current.contactfaces.find(el => el.regard == 'Основной')
			return { ...contact, disableEMAIL: !!contact.disableEMAIL, disableSMS: !!contact.disableSMS }
		},
	},
	methods: {

	},
}
</script>


<style lang="stylus">
.SelectClientExist
	overflow hidden
	display grid
	grid-gap 10px
	margin-bottom 10px

</style>
