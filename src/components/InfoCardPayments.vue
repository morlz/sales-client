<template>
	<q-card class="InfoCardPayments">
		<q-card-title>
			Оплаты
		</q-card-title>

		<q-card-main>
			<q-list no-border inset-separator v-if="content.payments && content.payments.length">
				<q-item v-for="payment, index in content.payments" :key="index">
					<q-item-side>
						<q-item-tile>{{ $moment(payment.DATE_OPL).format('DD MMMM YYYY') }} г</q-item-tile>
						<q-item-tile>{{ $moment(payment.DATE_OPL).format('hh:mm:ss') }}</q-item-tile>
					</q-item-side>
					<q-item-main>
						<q-item-tile class="InfoCardPayments__description">
							<div>
								Менеджер
							</div>
							<preview-manager :content="payment.manager"/>
							<div>
								Салон
							</div>
							<preview-salon :content="payment.salon"/>
						</q-item-tile>

						<q-item-tile v-if="payment.TEXT">
							Комментарий: {{ payment.TEXT }}
						</q-item-tile>
					</q-item-main>
					<q-item-side right class="InfoCardPayments__amount">
						<template v-if="payment.canDelete && !+content.IS_CLOSE">
							<q-item-tile>{{ payment.SUM_OPL }}</q-item-tile>
							<q-item-tile>
								<q-btn color="negative" flat icon="delete" @click="invoice_removePayment(payment.ID_PL)"></q-btn>
							</q-item-tile>
						</template>

						<template v-else>
							{{ payment.SUM_OPL }}
						</template>
					</q-item-side>
				</q-item>
			</q-list>

			<div v-else>
				Список пуст
			</div>
		</q-card-main>

		<q-card-actions v-if="!+content.IS_CLOSE">
			<q-btn color="primary" icon="add" @click="addPaymentForm = true" wait-for-ripple>Добавить оплату</q-btn>
			<invoice-add-payment-form :content="content" v-model="addPaymentForm"/>
		</q-card-actions>
	</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import PreviewManager from '@/components/PreviewManager'
import PreviewSalon from '@/components/PreviewSalon'
import InvoiceAddPaymentForm from '@/components/forms/InvoiceAddPayment'

export default {
	components: {
		PreviewManager,
		PreviewSalon,
		InvoiceAddPaymentForm
	},
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data() {
		return {
			addPaymentForm: false
		}
	},
	methods: {
		...mapActions([
			'invoice_removePayment'
		])
	},
}
</script>


<style lang="stylus">
.InfoCardPayments
	&__description
		height 40px
		display grid
		grid-auto-flow column
		justify-content start
		align-items center
		grid-gap 10px

	&__amount
		color red
		font-size 26px
</style>
