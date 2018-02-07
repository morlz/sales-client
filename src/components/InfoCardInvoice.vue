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
						{{ data.DATE }}
					</q-item-side>
				</q-item>

				<q-item v-if="data.shipments && data.shipments[0]">
					<q-item-side>Дата отгрузки</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.shipments[0].PL_OTGR }}
					</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions class="infoCardInvoice_actions">
			<q-btn color="primary">Отправить в 1С</q-btn>
			<q-btn color="primary" @click="invoice_print(data)">Печать</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import {
	QCard,
	QCardTitle,
	QCardMain,
	QCardActions,
	QList,
	QItem,
	QItemMain,
	QItemSide,
	QItemTile,
	QItemSeparator,
	QCollapsible,
	QBtn
} from 'quasar'

import PreviewManager from '@/components/PreviewManager.vue'

export default {
	props: {
		content: {
			type: Object
		}
	},
	mixins: [mixins],
	components: {
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QItemTile,
		QItemSeparator,
		QCollapsible,
		QBtn,
		PreviewManager
	},
	data () {
		return {}
	},
	watch: {

	},
	methods: {
		...mapActions([
			'invoice_print'
		])
	},
	computed: {
		data () {
			return this.content || {}
		},
		fio () {
			return this.data.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		}
	}
}
</script>


<style lang="less">
.infoCardInvoice {
	display: grid;
	grid-auto-flow: row;
	grid-template-rows: min-content 1fr max-content;

	&_actions {
		margin: 10px;
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
	}
}

</style>
