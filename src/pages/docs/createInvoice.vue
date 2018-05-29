<template>
<q-page class="mainWrapper">
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
					<q-btn color="primary" @click="nextFromPay" :disabled="!form.adSource && !form.podium">Продолжить</q-btn>
				</q-stepper-navigation>
			</q-step>

			<q-slide-transition>
				<q-step title="Оформление клиента" name="client" class="createInvoiceForm__clientStep" v-if="!form.podium">
					<form-select-client/>

					<q-stepper-navigation>
						<q-btn color="primary" @click="$refs.stepper.next()" :disabled="!client_select_selected">Продолжить</q-btn>
						<q-btn color="secondary" flat @click="$refs.stepper.previous()">Назад</q-btn>
					</q-stepper-navigation>
				</q-step>
			</q-slide-transition>

			<q-slide-transition>
				<q-step title="Выбор салона" name="client" class="createInvoiceForm__salonStep" v-if="form.podium">
					<field-select-salon v-model="form.salon"/>

					<q-stepper-navigation>
						<q-btn color="primary" @click="$refs.stepper.next()" :disabled="!form.salon">Продолжить</q-btn>
						<q-btn color="secondary" flat @click="$refs.stepper.previous()">Назад</q-btn>
					</q-stepper-navigation>
				</q-step>
			</q-slide-transition>

			<q-step title="Оформление доставки" name="shipment">
				<div class="createInvoiceForm__shipmentStep">
					<q-field helper="Выберите дату доставки">
						<q-datetime v-model="form.shipment.date" float-label="Дата доставки" :min="options.dateMin"/>
					</q-field>

					<template v-if="!form.podium">
						<q-btn-toggle v-model="form.shipment.type" :options="options.type" class="createInvoiceForm__shipmentType"/>

						<q-field helper="Выбирете адрес доставки">
							<q-input type="textarea" v-model="form.shipment.to.address" float-label="Куда" @click.native="options.to = !form.shipment.type"/>
							<form-select-address v-model="options.to" @select="form.shipment.to = $event" :initial="form.shipment.to"/>
						</q-field>

						<q-field>
							<q-input v-model.number="form.shipment.price" type="number" float-label="Цена доставки"/>
						</q-field>

						<q-field>
							<q-input v-model="form.shipment.comment" float-label="Комментарий к доставке"/>
						</q-field>
					</template>
				</div>

				<q-stepper-navigation>
					<q-btn color="primary" @click="invoice_new_create" :disabled="!(form.shipment.date && (form.shipment.to.address || form.podium))">Создать заказ</q-btn>
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
import FieldSelectSalon from '@/components/FieldSelectSalon'
import FormSelectAddress from '@/components/forms/SelectAddress'

import { QStepper, QStep, QToggle, QSelect, QStepperNavigation, QDatetime, QOptionGroup, QSlideTransition, extend, QBtnToggle } from 'quasar'

export default {
	components: {
		QStepper,
		QStep,
		QToggle,
		QSelect,
		QStepperNavigation,
		QDatetime,
		QOptionGroup,
		QSlideTransition,
		QBtnToggle,
		FormSelectClient,
		FormSelectAddress,
		FieldSelectSalon
	},
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
				salon: this.auth_currentSalon ? this.auth_currentSalon.id : 0,
				shipment: {
					type: false,
					date: this.$moment().add(1, 'day').toDate(),
					price: 0,
					to: {
						address: '',
						lat: 0,
						lng: 0
					},
					comment: ''
				}
			},
			options: {
				type: [
					{ label: 'Доставка', value: false },
					{ label: 'Самовывоз', value: true },
				],
				dateMin: this.$moment().add(1, 'day').toDate(),
				to: false,
				tmpTo: {},
			}
		}
	},
	watch: {
		auth_currentSalon (n) {
			this.form.salon = n
		},
		formData (n) {
			this.invoice_new_selectedSet(n)
		},
		'form.shipment.type' (n) {
			if (n) {
				this.options.tmpTo = this.form.shipment.to
				this.form.shipment.to = {
					...this.form.shipment.to,
					address: `Самовывоз из салона ${this.auth_salon.NAME} (${this.auth_salon.ID_SALONA})`
				}
			} else {
				this.form.shipment.to = this.options.tmpTo
			}
		},
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
			'i18n_days',
			'auth_salon',
			'auth_currentSalon'
		]),
		formData () {
			return extend(true, {}, this.form)
		},
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
			//if (this.form.podium) //skip client
				//return this.step = "shipment"

			this.$refs.stepper.next()
		},
		backFromShipment () {
			if (this.form.podium) //skip client
				return this.step = "pay"
			this.$refs.stepper.previous()
		},
	},
	mounted () {
		this.invoice_new_init()
		this.form.salon = this.auth_currentSalon.id
	}
}
</script>


<style lang="less">
.createInvoiceForm {
	padding: 10px;
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
		display: grid;
		grid-gap: 10px;
		margin: 10px 0;
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

	//&__salonStep {}

	&__shipmentStep {
		display: grid;
		grid-gap: 10px;
	}

	&__shipmentType {
		justify-self: start;
	}
}
</style>
