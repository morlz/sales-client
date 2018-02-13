<template>
<q-card class="formSelectClient" v-if="auth_can(1, 'Client')">
	<q-card-title>Выбор клиента</q-card-title>

	<q-card-main>
		<q-field helper="Поиск по номеру телефона">
			<q-input v-model="phoneFormated" float-label="Телефон" />
		</q-field>

		<q-slide-transition>
			<q-list no-border v-loading="client_loadingByPhone" class="formSelectClient__clientsList" v-if="newClient.phone && !create && !client_selected.id">
				<q-item
					v-for="client, index in client_byPhone"
					:key="index"
					@click="selectClient(client)"
					:class="{ 'formSelectClient__clientSelected': client_selected.id == client.id }"
					class="formSelectClient__clientListItem">

					<q-item-main>
						{{ mainContact(client).fio }}
						<q-item-tile>
							{{ mainContact(client).phone | phoneFormat }}
						</q-item-tile>

						<q-item-tile v-for="contact, index in notMainContacts(client)" :key="index">
							{{ contact }}
						</q-item-tile>
					</q-item-main>
					<q-item-side>
						{{ client.salon.NAME }}
					</q-item-side>
				</q-item>

				<template v-if="client_byPhone.length == 30">
					Показано {{ client_byPhone.length }} клиентов. Тут пока не бесконечной прокрутки :(
				</template>
			</q-list>
		</q-slide-transition>

		<q-slide-transition>
			<div v-if="client_selectType == 'exist'" class="formSelectClient__clientForm">
				<q-field>
					<q-toggle v-model="mainContact(client_selected).disableSMS" disabled label="sms-рассылка запрещена"/>
				</q-field>

				<q-field>
					<q-input v-model="mainContact(client_selected).fio" float-label="ФИО" readonly />
				</q-field>

				<q-field label="Пол">
					<el-switch v-model="mainContact(client_selected).gender == 'Мужской'" active-text="Мужской" inactive-text="Женский" readonly/>
				</q-field>

				<q-field helper="Описание пользователя">
					<q-input v-model="mainContact(client_selected).signs" float-label="Приметы" readonly/>
				</q-field>

				<q-field helper="some@email.com">
					<q-input v-model="mainContact(client_selected).email" float-label="Эл почта" readonly />
				</q-field>

				<q-field>
					<q-toggle v-model="mainContact(client_selected).disableEMAIL" disabled label="Email-рассылка запрещена"/>
				</q-field>
			</div>
		</q-slide-transition>

		<q-slide-transition>
			<div v-if="create && auth_can(2, 'Client')" class="formSelectClient__clientForm">
				<q-field>
					<q-toggle v-model="newClient.disableSMS" label="sms-рассылка запрещена"/>
				</q-field>

				<q-field>
					<q-input v-model="newClient.fio" float-label="ФИО" />
				</q-field>

				<q-field label="Пол">
					<q-option-group :options="genders" v-model="newClient.gender"/>
				</q-field>

				<q-field helper="Описание пользователя">
					<q-input v-model="newClient.clientDescription" float-label="Приметы"/>
				</q-field>

				<q-field helper="some@email.com">
					<q-input v-model="newClient.email" float-label="Эл почта" />
				</q-field>

				<q-toggle v-model="newClient.disableEMAIL" label="Email-рассылка запрещена"/>
			</div>
		</q-slide-transition>

		<q-slide-transition>
			<q-field v-if="newClient.phone && !create && !client_selected.id">
				<q-btn color="primary" @click="create = true">Создать клиента</q-btn>
			</q-field>
		</q-slide-transition>

		<q-slide-transition>
			<q-field v-if="newClient.phone && create">
				<q-btn color="primary" @click="create = false">Вернуться к поиску</q-btn>
			</q-field>
		</q-slide-transition>
	</q-card-main>
</q-card>
</template>

<script>
/*

<el-select
	v-model="newClient.phone"
	placeholder="8 (800) 555 35 35"
	:allow-create="!client_loadingByPhone"
	remote
	filterable
	:remote-method="client_searchByPhone"
	:loading="client_loadingByPhone"
	:loading-text="'Загрузка...'"
	:no-data-text="'Клиентов не найдено'">
	<el-option v-for="client, index in client_byPhone" :label="client.phone" :value="client.phone" :key="index" class="clientOption">
		<div class="name">{{ client.fio }}</div>
		<div>{{ client.phone }}</div>
		<div class="salon">{{ client.salon }}</div>
	</el-option>
</el-select>

*/

import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import mixins from '@/components/mixins'

import phoneFormat from '@/lib/phoneFormat'

import { QField, QInput, QOptionGroup, QCard, QCardTitle, QCardMain, QCheckbox, QToggle, QList, QItem, QItemMain, QItemSide, QItemTile, QBtn, QSlideTransition } from 'quasar'

export default {
	mixins: [mixins],
	components: {
		QField,
		QInput,
		QOptionGroup,
		QCard,
		QCardTitle,
		QCardMain,
		QCheckbox,
		QToggle,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QItemTile,
		QBtn,
		QSlideTransition
	},
	data() {
		return {
			create: false,
			newClient: {
				phone: "",
				email: "",
				fio: "",
				gender: false,
				disableSMS: false,
				disableEMAIL: false,
				clientDescription: ""
			},
			genders: [
				{ label: "Женский", value: false },
				{ label: "Мужкой", value: true },
			],
			seachTimeout: false
		}
	},
	watch: {
		searchByPhone(n) {
			if (this.seachTimeout)
				clearTimeout(this.seachTimeout)

			this.seachTimeout = setTimeout(a => this.client_searchByPhone(n), 500)
		},
		local_client_select_newClient (n) {
			this.client_select_newSet(n)
		},
		local_client_select_existClient (n) {
			this.client_select_existSet(n)
		},
	},
	methods: {
		...mapActions([
			'client_searchByPhone'
		]),
		...mapMutations([
			'client_select_newSet',
			'client_select_existSet',
		]),
		mainContact: client => {
			let contact = client.contactfaces.find(el => el.regard == 'Основной')
			return { ...contact, disableEMAIL: !!contact.disableEMAIL, disableSMS: !!contact.disableSMS }
		},
		notMainContacts: client => client.contactfaces.filter(el => el.regard != 'Основной'),
		selectClient (client) {
			this.client_select_existSet(client)
		}
	},
	computed: {
		...mapGetters([
			'client_loadingByPhone',
			'client_byPhone',
			'client_selected',
			'client_selectType'
		]),
		local_client_select_newClient () {
			return Object.assign({}, this.newClient)
		},
		local_client_select_existClient () {
			return this.client_byPhone.find(el => el.phone == this.newClient.phone)
		},
		searchByPhone () {
			return this.newClient.phone
		},
		phoneFormated: {
			get () {
				return phoneFormat(this.newClient.phone)
			},
			set (n) {
				this.newClient.phone = n.replace(/\D/g, ``)
			}
		}
	},
	filters: {
		phoneFormat: n => phoneFormat(n.replace(/\D/g, ``))
	},
	mounted() {
		if (this.client_selected.fio)
			this.newClient.phone = (this.client_selected.phone || this.mainContact(this.client_selected).phone).replace(/\D/g, ``)
	}
}
</script>


<style lang="less">
.formSelectClient {
	max-width: 600px;

	&__clientsList {
		max-height: 500px;
		overflow-y: auto;
	}

	&__clientListItem {
		cursor: pointer;
	}

	&__clientSelected {
		background: #ecf5ff;
	}

	&__clientForm {
		overflow: hidden;
	}
}
.clientOption {
	height: auto;
	line-height: inherit;
	display: grid;
	padding: 5px;
	grid-template: 	"n n"
					"p s";
	.name {
		grid-area: n;
	}
	.salon {
		justify-self: end;
	}
	> div {
		padding: 5px;
	}
}

@media screen and (max-width: 1200px) {
    .addPreorderMainFormWrapper {

    }
}
</style>
