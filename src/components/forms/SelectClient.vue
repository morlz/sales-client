<template>
<q-card class="formSelectClient" v-if="auth_can(1, 'Client')">
	<q-card-title>Выбор клиента</q-card-title>

	<q-card-main>
		<q-field helper="Поиск по номеру телефона" v-if="client_select_currentState.search">
			<q-input v-model="phone" float-label="Телефон" />
		</q-field>

		<q-slide-transition>
			<select-client-list v-if="client_select_currentState.list"/>
		</q-slide-transition>

		<q-slide-transition>
			<select-client-exist v-if="client_select_currentState.exist"/>
		</q-slide-transition>

		<q-slide-transition>
			<select-client-create v-if="client_select_currentState.new"/>
		</q-slide-transition>


		<div class="formSelectClient__buttons">
			<q-slide-transition>
				<q-field v-if="client_select_currentState.exist">
					<q-btn color="primary" flat :to="client_select_current.href">Перейти к профилю</q-btn>
				</q-field>
			</q-slide-transition>

			<q-slide-transition>
				<q-field v-if="client_select_currentState.buttons.create">
					<q-btn color="primary" @click="client_select_typeSet('new')">Создать клиента</q-btn>
				</q-field>
			</q-slide-transition>

			<q-slide-transition>
				<q-field v-if="client_select_currentState.buttons.backToSearch" class="formSelectClient__backButton">
					<q-btn color="secondary" @click="client_select_backToSearch" flat>Вернуться к поиску</q-btn>
				</q-field>
			</q-slide-transition>
		</div>
	</q-card-main>
</q-card>
</template>

<script>

import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import { AuthMixin } from '@/mixins'

import phoneFormat from '@/lib/phoneFormat'
import SelectClientCreate from '@/components/forms/SelectClientCreate'
import SelectClientExist from '@/components/forms/SelectClientExist'
import SelectClientList from '@/components/forms/SelectClientList'

import { QOptionGroup, QCheckbox, QToggle, QSlideTransition } from 'quasar'

export default {
	mixins: [AuthMixin],
	components: {
		QOptionGroup,
		QCheckbox,
		QToggle,
		QSlideTransition,

		SelectClientCreate,
		SelectClientExist,
		SelectClientList
	},
	watch: {

	},
	methods: {
		...mapActions([
			'client_select_searchByPhone',
			'client_select_backToSearch'
		]),
		...mapMutations([
			'client_select_typeSet',
		]),
	},
	computed: {
		...mapGetters([
			'client_select_currentState',
			'client_select_phone',
			'client_select_current'
		]),
		phone: {
			get () {
				return this.client_select_phone
			},
			set (n) {
				this.client_select_searchByPhone(n)
			}
		}
	},
	mounted() {

	}
}
</script>


<style lang="less">
.formSelectClient {
	max-width: 600px;

	&__buttons {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
	}

	&__backButton {
		justify-self: end;
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
