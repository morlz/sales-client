<template>
<q-page class="mainWrapper">
	<div class="createInvoiceForm">
		<q-stepper ref="stepper" vertical class="createInvoiceForm__stepper" v-model="step">
			<q-step title="Вид оплаты и рекламный источник" name="pay">
				<q-field class="createInvoiceForm__podium">
					<q-toggle v-model="form.podium" label="Заказ на подиум"/>
				</q-field>

				<q-slide-transition>
					<div v-if="form.podium">
						В разработке
					</div>
				</q-slide-transition>

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
					<q-btn color="primary" @click="nextFromPay" :disabled="!form.adSource || form.podium">Продолжить</q-btn>
				</q-stepper-navigation>
			</q-step>

			<q-slide-transition>
				<q-step title="Оформление клиента" name="client" v-if="!form.podium" class="createInvoiceForm__clientStep">
					<form-select-client/>

					<q-stepper-navigation>
						<q-btn color="primary" @click="$refs.stepper.next()" :disabled="!client_select_selected">Продолжить</q-btn>
						<q-btn color="secondary" flat @click="$refs.stepper.previous()">Назад</q-btn>
					</q-stepper-navigation>
				</q-step>
			</q-slide-transition>

			<q-step title="Оформление доставки" name="shipment">
				<q-field>
					<q-datetime
						v-model="form.shipment.date"
							:month-names="i18n_months"
							:day-names="i18n_days"
							float-label="Дата доставки"
							ok-label="Ок"
							cancel-label="Отменить"
							clear-label="Очистить"/>
				</q-field>

				<template v-if="!form.podium">
					<q-field helper="Адресс доставки">
						<q-input type="textarea" v-model="form.shipment.address" float-label="Адресс" @click="addrOpen = true"/>
					</q-field>

					<form-select-address v-model="addrOpen" @select="addressSelectHandler" :initial="address"/>
				</template>

				<q-stepper-navigation>
					<q-btn color="primary" @click="invoice_new_create" :disabled="!(form.shipment.date && (form.shipment.address || form.podium))">Создать заказ</q-btn>
					<q-btn color="secondary" flat @click="backFromShipment">Назад</q-btn>
				</q-stepper-navigation>
			</q-step>
		</q-stepper>
	</div>
</q-page>
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
					address: "",
					lat: 0,
					lng: 0
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
			'client_select_selected',
			'i18n_months',
			'i18n_days'
		]),
		formData () {
			return extend(true, {}, this.form)
		},
		address () {
			return {
				address: this.form.shipment.address,
				lat: this.form.shipment.lat,
				lng: this.form.shipment.lng,
			}
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
		addressSelectHandler ({ address, lat, lng }) {
			this.form.shipment.address = address
			this.form.shipment.lat = lat
			this.form.shipment.lng = lng
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
		background: #fff;
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

	&__clientStep {
		.q-stepper-tab {
			padding-bottom: 6px;
		}
		.q-stepper-step-inner {
			padding: 0 0 24px 20px;
		}
	}
}
</style>
