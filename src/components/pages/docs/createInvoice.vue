<template>
<div class="mainWrapper">
	<ul class="breadcrumb">
		<li><router-link :to="{ path: '/' }">Главная</router-link></li>
		<li><router-link :to="{ path: '/docs/createInvoice' }">Оформление заказа</router-link></li>
	</ul>

	<div class="createInvoiceForm">
		<q-stepper ref="stepper" vertical class="createInvoiceForm__stepper" v-model="step">
			<q-step title="Вид оплаты и рекламный источник" name="pay">
				<q-field class="createInvoiceForm__podium">
					<q-toggle v-model="form.podium" label="Заказ на подиум"/>
				</q-field>

				<q-slide-transition>
					<div v-if="!form.podium" class="createInvoiceForm__slide">
						<q-field>
							<q-toggle v-model="form.internet" label="Интернет магазин"/>
						</q-field>

						<q-field>
							<q-toggle label="Безналичная оплата" v-model="form.nonCache"/>
						</q-field>

						<q-field class="createInvoiceForm__adSource" v-loading="invoice_new_loading.adSource">
							<q-select float-label="Рекламный источник" v-model="form.adSource" :options="invoice_new_adSources"/>
						</q-field>

						<q-slide-transition>
							<q-field label="Источник заказа" v-if="form.internet" class="createInvoiceForm__invoiceSources">
								<q-option-group v-model="form.invoiceSource" :options="invoice_new_invoiceSource"/>
							</q-field>
						</q-slide-transition>
					</div>
				</q-slide-transition>

				<q-stepper-navigation>
					<q-btn color="primary" @click="nextFromPay" :disabled="!(form.adSource || form.podium)">Продолжить</q-btn>
				</q-stepper-navigation>
			</q-step>

			<q-slide-transition>
				<q-step title="Оформление клиента" name="client" v-if="!form.podium">
					<form-select-client/>

					<q-stepper-navigation>
						<q-btn color="primary" @click="$refs.stepper.next()" :disabled="!client_select_selected">Продолжить</q-btn>
						<q-btn color="secondary" flat @click="$refs.stepper.previous()">Назад</q-btn>
					</q-stepper-navigation>
				</q-step>
			</q-slide-transition>

			<q-step title="Оформление доставки" name="shipment">
				<q-field>
					<q-datetime v-model="form.shipment.date" float-label="Дата доставки"/>
				</q-field>

				<q-field helper="Адресс доставки">
					<q-input v-model="form.shipment.address" float-label="Адресс" @click="addrOpen = true"/>
				</q-field>

				<form-select-address v-model="addrOpen" @select="addressSelectHandler" :initial="form.shipment.address"/>

				<q-stepper-navigation>
					<q-btn color="primary" @click="invoice_new_create">Создать заказ</q-btn>
					<q-btn color="secondary" flat @click="backFromShipment">Назад</q-btn>
				</q-stepper-navigation>
			</q-step>
		</q-stepper>
	</div>

</div>
</template>

<script>

import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import FormSelectClient from '@/components/forms/SelectClient'
import FormSelectAddress from '@/components/forms/SelectAddress'

import { QStepper, QStep, QField, QInput, QToggle, QSelect, QStepperNavigation, QBtn, QDatetime, QOptionGroup, QSlideTransition, extend } from 'quasar'

export default {
	data() {
		return {
			step: "pay",
			addrOpen: false,
			form: {
				podium: false,
				nonCache: false,
				internet: false,
				adSource: "",
				invoiceSource: "1",
				shipment: {
					date: "",
					address: ""
				}
			}
		}
	},
	components: {
		QStepper,
		QStep,
		QField,
		QInput,
		QToggle,
		QSelect,
		QStepperNavigation,
		QBtn,
		QDatetime,
		QOptionGroup,
		QSlideTransition,
		FormSelectClient,
		FormSelectAddress
	},
	watch: {
		formData (n) {
			this.invoice_new_selectedSet(n)
		}
	},
	computed: {
		...mapGetters([
			'invoice_new_selected',
			'invoice_new_cached',
			'invoice_new_loading',
			'invoice_new_invoiceSource',
			'invoice_new_adSources',
			'client_select_selected'
		]),
		formData () {
			return extend(true, {}, this.form)
		}
	},
	methods: {
		...mapMutations([
			'invoice_new_selectedSet'
		]),
		...mapActions([
			'invoice_new_init',
			'invoice_new_create'
		]),
		nextFromPay () {
			if (this.form.podium) //skip client
				return this.step = "shipment"
			this.$refs.stepper.next()
		},
		backFromShipment () {
			if (this.form.podium) //skip client
				return this.step = "pay"
			this.$refs.stepper.previous()
		},
		addressSelectHandler (e) {
			this.form.shipment.address = e
		}
	},
	mounted () {
		this.invoice_new_init()
	}
}
</script>


<style lang="less">
.createInvoiceForm {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	&__stepper {

	}

	&__radioWrapper {
		display: grid;
	}

	&__podium, &__adSource {
		margin-bottom: 0;
	}

	&__slide {
		padding: 0.1px;
	}

	&__invoiceSources {
		&:extend(.createInvoiceForm__slide);
		overflow: hidden;
	}
}
</style>
