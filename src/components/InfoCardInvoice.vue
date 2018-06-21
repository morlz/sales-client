<template>
	<q-card class="infoCardInvoice">
		<q-card-title>
			Информация о заказе
		</q-card-title>

		<q-card-main>
			<q-list highlight no-border>
				<q-item>
					<q-item-side>Номер докумнта</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.N_DOC }}
					</q-item-side>

				</q-item>

				<q-item v-if="data.manager">
					<q-item-side>Менеджер</q-item-side>
					<q-item-main/>
					<q-item-side>
						<preview-manager :content="data.manager" />
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Дата оформления</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ date(data.DATE) }}
					</q-item-side>
				</q-item>

				<q-item v-if="data.shipments && data.shipments[0]">
					<q-item-side>Дата отгрузки</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ date(data.shipments[0].PL_OTGR) }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Оплачено</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.paid }} руб.
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Сумма заказа</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.price }} руб.
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Осталось оплатить</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.need }} руб.
					</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions class="infoCardInvoice__actions">
			<q-btn color="primary" @click="invoice_ship(data.ID)" v-if="+data.VID_OPLATI == 3 && !+data.IS_CLOSE">Отгрузить</q-btn>
			<q-btn color="primary" @click="invoice_exportToAx(data.ID)">в DAX</q-btn>
			<q-btn color="primary" @click="invoice_exportTo1c(data.ID)">в 1С</q-btn>
			<q-btn color="primary" @click="invoice_print({ data, type })">Печать</q-btn>
			<q-btn
				color="primary"
				@click="invoice_printOpt({ data, type })"
				v-if="auth_can(1, 'InvoicePrintOpt') && data.dax && data.salon && +data.salon.group.isInvoicePrintOpt">
				Печать ОПТ
			</q-btn>
			<q-btn color="negative"
				@click="invoice_remove(data.ID)"
				v-if="auth_can(4, 'Invoice')"
				:disable="!data.canRemove">
				Удалить
			</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import moment from 'moment'
import {
	QCollapsible,
} from 'quasar'

import PreviewManager from '@/components/PreviewManager.vue'
import Invoice from '@/lib/Invoice'

export default {
	props: {
		content: {
			type: Object
		},
		type: String
	},
	mixins: [AuthMixin],
	components: {
		QCollapsible,
		PreviewManager
	},
	methods: {
		...mapActions([
			'invoice_print',
			'invoice_printOpt',
			'invoice_exportToAx',
			'invoice_exportTo1c',
			'invoice_ship',
			'invoice_remove'
		]),
		date (d) {
			return moment(d).isValid() ? moment(d).format("DD MMMM YYYY") : d
		}
	},
	computed: {
		data () {
			if (!this.content)
				return {}

			return this.content instanceof Invoice ? this.content : new Invoice(this.content)
		},
		fio () {
			return this.data.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		},
	}
}
</script>


<style lang="stylus">
.infoCardInvoice
	display grid
	grid-template-rows min-content 1fr max-content
	grid-template-columns 100%

	&__actions
		display grid
		grid-auto-flow column
</style>
