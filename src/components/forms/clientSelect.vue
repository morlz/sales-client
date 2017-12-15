<template>
<el-card class="addPreorderMainFormWrapper">
	<h2 slot="header">Выбор клиента</h2>

	<el-form label-width="100px">

		<el-form-item label="Телефон">
			<el-select v-model="newClient.phone" placeholder="8 (800) 555 35 35" :allow-create="!loadingClientsByPhone" remote filterable :remote-method="searchClientsByPhone" :loading="loadingClientsByPhone" :loading-text="'Загрузка...'" :no-data-text="'Клиентов не найдено'">
				<el-option v-for="client, index in clientsByPhone" :label="client.phone" :value="client.phone" :key="index" class="clientOption">
					<span>{{ client.fio }}</span>
					<span>{{ client.phone }}</span>
					<span>{{ client.salon }}</span>
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

		<div v-else="selectedClient">
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

export default {
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
		}
	},
	methods: {
		...mapActions([
			'searchClientsByPhone'
		]),
		...mapMutations([

		])
	},
	computed: {
		...mapGetters([
			'loadingClientsByPhone',
			'clientsByPhone'
		]),
		selectedClient() {
			return this.clientsByPhone.find(el => el.phone == this.newClient.phone)
		}
	}
}
</script>


<style lang="less">
.clientOption {
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
	justify-content: space-between;
	justify-items: start;
	grid-template-columns: 1fr 150px 250px;
}

@media screen and (max-width: 1200px) {
    .addPreorderMainFormWrapper {
        }
}
</style>
