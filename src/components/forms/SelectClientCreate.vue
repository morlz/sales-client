<template>
	<div class="createClient">
		<q-field>
			<q-toggle v-model="disableSMS" label="sms-рассылка запрещена"/>
		</q-field>

		<q-field>
			<q-input v-model="fio" float-label="ФИО" />
		</q-field>

		<q-field label="Пол">
			<q-option-group :options="genders" v-model="gender"/>
		</q-field>

		<q-field helper="Описание пользователя">
			<q-input v-model="clientDescription" float-label="Приметы"/>
		</q-field>

		<q-field helper="some@email.com">
			<q-input v-model="email" float-label="Эл почта" />
		</q-field>

		<q-toggle v-model="disableEMAIL" label="Email-рассылка запрещена"/>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QField, QInput, QToggle, QOptionGroup } from 'quasar'

export default {
	components: {
		QField,
		QInput,
		QToggle,
		QOptionGroup
	},
	data () {
		return {
			genders: [
				{ label: "Женский", value: false },
				{ label: "Мужкой", value: true },
			],
		}
	},
	computed: {
		disableSMS: {
			get () { return this.$store.state.clients.select.new.disableSMS },
			set (data) { this.client_select_newUpdate({ type: 'disableSMS', data }) }
		},
		fio: {
			get () { return this.$store.state.clients.select.new.fio },
			set (data) { this.client_select_newUpdate({ type: 'fio', data }) }
		},
		gender: {
			get () { return this.$store.state.clients.select.new.gender },
			set (data) { this.client_select_newUpdate({ type: 'gender', data }) }
		},
		clientDescription: {
			get () { return this.$store.state.clients.select.new.clientDescription },
			set (data) { this.client_select_newUpdate({ type: 'clientDescription', data }) }
		},
		email: {
			get () { return this.$store.state.clients.select.new.email },
			set (data) { this.client_select_newUpdate({ type: 'email', data }) }
		},
		disableEMAIL: {
			get () { return this.$store.state.clients.select.new.disableEMAIL },
			set (data) { this.client_select_newUpdate({ type: 'disableEMAIL', data }) }
		},
	},
	methods: {
		...mapMutations([
			'client_select_newUpdate'
		])
	},
}
</script>


<style lang="less">
.createClient {
	overflow: hidden;
}
</style>
