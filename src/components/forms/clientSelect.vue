<template>
<el-card class="addPreorderMainFormWrapper" v-if="auth_can(1, 'Client')">
	<h2 slot="header">Выбор клиента</h2>

	<el-form label-width="100px">

		<el-form-item label="Телефон">
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
		</el-form-item>

		<div v-if="selectedClient">
			<el-form-item>
				<el-checkbox v-model="selectedClient.disableSMS" disabled>sms-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="ФИО">
				<el-input v-model="selectedClient.fio" placeholder="ФИО" readonly />
			</el-form-item>

			<el-form-item label="Пол">
				<el-switch v-model="selectedClient.gender == 'Мужской'" active-text="Мужской" inactive-text="Женский" readonly/>
			</el-form-item>

			<el-form-item label="Приметы">
				<el-input type="textarea" v-model="selectedClient.signs" placeholder="Описание пользователя" readonly/>
			</el-form-item>

			<el-form-item label="Эл почта">
				<el-input v-model="selectedClient.email" placeholder="some@email.com" readonly />
				<el-checkbox v-model="selectedClient.disableEMAIL" disabled>Email-рассылка запрещена</el-checkbox>
			</el-form-item>
		</div>

		<div v-if="!selectedClient && auth_can(2, 'Client')">
			<el-form-item>
				<el-checkbox v-model="newClient.disableSMS">sms-рассылка запрещена</el-checkbox>
			</el-form-item>

			<el-form-item label="ФИО">
				<el-input v-model="newClient.fio" placeholder="ФИО" />
			</el-form-item>

			<el-form-item label="Пол">
				<el-switch v-model="newClient.gender" active-text="Мужской" inactive-text="Женский" />
			</el-form-item>

			<el-form-item label="Приметы">
				<el-input type="textarea" v-model="newClient.clientDescription" placeholder="Описание пользователя" />
			</el-form-item>

			<el-form-item label="Эл почта">
				<el-input v-model="newClient.email" placeholder="some@email.com" />
				<el-checkbox v-model="newClient.disableEMAIL">Email-рассылка запрещена</el-checkbox>
			</el-form-item>
		</div>
	</el-form>
</el-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	data() {
		return {
			newClient: {
				phone: "",
				fio: "",
				gender: false,
				disableSMS: false,
				disableEMAIL: false,
				clientDescription: ""
			}
		}
	},
	watch: {
		searchByPhone(n) {
			if (this.seachTimeout) clearTimeout(this.seachTimeout)

			this.seachTimeout = setTimeout(() => {
				this.updateRecordsSearchByPhoneQuery(n)
				this.changeRecordsLastOffset()
				this.recordsCacheClear()

				this.$nextTick(() => {
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				})
			}, 500)
		},
		local_client_select_newClient (n) {
			this.client_select_newSet(n)
		},
		local_client_select_existClient (n) {
			this.client_select_existSet(n)
		}
	},
	methods: {
		...mapActions([
			'client_searchByPhone'
		]),
		...mapMutations([
			'client_select_newSet',
			'client_select_existSet'
		])
	},
	computed: {
		...mapGetters([
			'client_loadingByPhone',
			'client_byPhone'
		]),
		selectedClient() {
			return this.client_byPhone.find(el => el.phone == this.newClient.phone)
		},
		local_client_select_newClient () {
			return Object.assign({}, this.newClient)
		},
		local_client_select_existClient () {
			return this.selectedClient
		}
	}
}
</script>


<style lang="less">
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
