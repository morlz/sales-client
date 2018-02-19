<template>
	<q-list
		class="clientList"
		no-border
		v-loading="client_select_loading.list">

		<q-item
			class="clientList__item"
			v-if="client_select_cached"
			v-for="client, index in client_select_cached.list"
			:key="index"
			:class="{ 'clientList__item-selected': client_select.id == client.id }"
			@click="selectClient(client)">

			<q-item-main>
				{{ mainContact(client).fio }}
				<q-item-tile>
					{{ mainContact(client).phone | phoneFormat }}
				</q-item-tile>

				<q-item-tile v-for="contact, index in notMainContacts(client)" :key="index">
					{{ contact }}
				</q-item-tile>
			</q-item-main>
			<q-item-side class="clientList__salon">
				{{ client.salon.NAME }}
			</q-item-side>
		</q-item>


		<template v-if="client_select_cached.list.length == 30">
			Показано {{ client_select_cached.list.length }} клиентов. Тут пока нет бесконечной прокрутки :(
		</template>
	</q-list>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import phoneFormat from '@/lib/phoneFormat'
import { QList, QItem, QItemMain, QItemSide, QItemTile } from 'quasar'

export default {
	components: {
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QItemTile
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'client_select_loading',
			'client_select_cached',
			'client_select'
		])
	},
	methods: {
		...mapMutations([
			'client_select_existSet',
			'client_select_typeSet'
		]),
		mainContact: client => client.contactfaces.find(el => el.regard == 'Основной'),
		notMainContacts: client => client.contactfaces.filter(el => el.regard != 'Основной'),
		selectClient(n) {
			this.client_select_existSet(n)
			this.client_select_typeSet('exist')
		}
	},
	filters: {
		phoneFormat
	},
}
</script>


<style lang="less">
.clientList {
	max-height: 500px;
	overflow-y: auto;
	overflow-x: hidden;
	&__item {
		cursor: pointer;
		&-selected {
			background: #ecf5ff;
		}
	}
	&__salon {
		text-align: right;
	}
}
</style>
