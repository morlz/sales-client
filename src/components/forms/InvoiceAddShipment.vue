<template>
<q-modal class="InvoiceAddShipment" :content-css="{ minHeight: '80vh', minWidth: '80vw' }" :value="value" @input="$emit('input', $event)">
	<q-modal-layout>
		<q-toolbar slot="header">
			<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />

			<q-toolbar-title>
				Добавить доставку в заказ {{ content.N_DOC }}
			</q-toolbar-title>
		</q-toolbar>

		<div class="layout-padding InvoiceAddShipment__form">
			<q-btn-toggle v-model="form.type" :options="options.type" class="InvoiceAddShipment__type"/>

			<q-field helper="Откуда будет доставлятся товар">
				<q-input :value="!content.salon || form.type ? 'Фабрика' : content.salon.NAME" float-label="Откуда" disable/>
			</q-field>


			<q-field helper="Выбирете адрес доставки">
				<q-input type="textarea" v-model="form.to.address" float-label="Куда" @click.native="options.to = !form.type"/>
				<select-address-form v-model="options.to" @select="form.to = $event" :initial="form.to"/>
			</q-field>

		<!--
			<q-field>
				<select-or-create-address-form v-model="form.to" />
			</q-field>

		-->

			<q-field helper="Выберите дату доставки">
				<q-datetime v-model="form.date" float-label="Дата доставки" :min="options.dateMin"/>
			</q-field>

			<q-field helper="Телефон привязаый к доставке">
				<q-input type="tel" v-model="form.phone" float-label="Телефон"/>
			</q-field>

			<div class="InvoiceAddShipment__prices">
				<q-field>
					<q-input v-model.number="form.price.build" type="number" float-label="Подьём, сборка" suffix="руб."/>
				</q-field>

				<q-field>
					<q-input v-model.number="form.price.firm" type="number" float-label="Фирменая услуга" suffix="руб."/>
				</q-field>

				<q-field>
					<q-input v-model.number="form.price.more" type="number" float-label="Дополнительная сумма" suffix="руб."/>
				</q-field>

				<q-field>
					<q-input :value="Object.values(form.price).reduce((prev, el) => prev + +el, 0)" float-label="Сумма доставки руб." disable suffix="руб."/>
				</q-field>
			</div>

			<q-field helper="Комментарий к записи">
				<q-input type="textarea" v-model="form.comment" float-label="Комментарий"/>
			</q-field>

			<div class="InvoiceAddShipment__buttons">
				<q-btn color="primary" @click="create">Добавить</q-btn>
				<q-btn color="secondary" flat v-close-overlay wait-for-ripple>Отмена</q-btn>
			</div>
		</div>
	</q-modal-layout>
</q-modal>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import { QBtnToggle, QDatetime } from 'quasar'
import SelectAddressForm from '@/components/forms/SelectAddress'
import SelectOrCreateAddressForm from '@/components/forms/SelectOrCreateAddress'

export default {
	components: {
		QBtnToggle,
		QDatetime,
		SelectAddressForm,
		SelectOrCreateAddressForm
	},
	props: {
		value: Boolean,
		content: {
			type: Object,
			default: a => ({})
		},
		edit: Boolean,
		editIndex: {
			type: Number,
			default: a => 0
		}
	},
	data() {
		return {
			form: {
				type: false,
				date: this.$moment().add(1, 'day').toDate(),
				phone: '',
				to: {
					address: '',
					lat: 0,
					lng: 0
				},
				comment: '',
				price: {
					build: 0,
					firm: 0,
					more: 0
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
		'form.type' (n) {
			if (n) {
				this.options.tmpTo = this.form.to
				this.form.to = {
					...this.form.to,
					address: `Самовывоз из салона ${this.content.salon.NAME} (${this.content.salon.ID_SALONA})`
				}
			} else {
				this.form.to = this.options.tmpTo
			}
		},
		content (n) {
			this.form.to = {
				...this.form.to,
				...this.content.marker
			}
		},
		editIndex (n) {
			if (!this.edit) return
			this.updatedit()
		}
	},
	methods: {
		...mapActions([
			'shipment_create'
		]),
		create () {
			this.shipment_create({
				...this.form,
				date: this.$moment(this.form.date).format('Y-M-D'),
				price: Object.values(this.form.price).reduce((prev, el) => prev + +el, 0),
				invoice_id: this.content.ID
			})
			this.$emit('input', false)
		},
		updatedit () {
			let shipment = this.content.shipments.find(el = el.ID_OTG == n)
			if (!shipment) return
			this.form = {
				type: shipment.VIDDOST == 'Самовывоз',
				date: this.$moment(shipment.PL_OTGR).toDate(),
				phone: shipment.TEL1,
				to: shipment.marker,
				comment: shipment.COMMENT
			}
		}
	},
	created () {
		this.form.to = {
			...this.form.to,
			...this.content.marker
		}
	}
}
</script>


<style lang="stylus">
.InvoiceAddShipment
	&__type
		justify-self start

	&__form
		display grid
		grid-gap 20px
		justify-content stretch

	&__prices
		display grid
		grid-auto-flow column
		grid-gap 10px
</style>
