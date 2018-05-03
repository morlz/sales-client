<template>
	<q-card class="InfoCardShipments">
		<q-card-title>
			{{ data.length > 1 ? 'Доставки' : 'Доставка' }}
		</q-card-title>

		<q-card-main>
			<div v-if="!data.length">
				Доставки не назначены
			</div>

			<template v-else>
				<q-tabs inverted v-model="currentTab" v-if="data.length > 1">
					<q-tab v-for="shipment, index in data" :key="index" slot="title" :name="shipment.ID_OTG + ''" :label="shipment.date" :default="!index"/>
				</q-tabs>

				<template v-if="!edit">
					<q-list highlight no-border>
						<q-item>
							<q-item-side>Вид</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.VIDDOST }}
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Откуда</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.OTKUDA }}
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Куда</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.marker ? shipment.marker.address : shipment.KUDA }}
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Плановая дата</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.PL_OTGR }} ({{ shipment.timeFormNow }})
							</q-item-side>
						</q-item>

						<q-item v-if="shipment.DATEV">
							<q-item-side>Дата ввода</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.DATEV }}
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Цена доставки</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.SUM_DOST }} руб.
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Цена товара</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.SUM_TOVAR }} руб.
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Телефон</q-item-side>
							<q-item-main/>
							<q-item-side right>
								<q-item-tile v-if="shipment.TEL1">
									<base-phone :value="shipment.TEL1" :place="{ shipment }"/>
								</q-item-tile>

								<q-item-tile v-if="shipment.TEL2">
									<base-phone :value="shipment.TEL2" :place="{ shipment }"/>
								</q-item-tile>
							</q-item-side>
						</q-item>

						<q-item>
							<q-item-side>Комментарий</q-item-side>
							<q-item-main/>
							<q-item-side right>
								{{ shipment.NOTE }}
							</q-item-side>
						</q-item>
					</q-list>

					<div class="InfoCardShipments__buttons">
						<q-btn color="positive" icon="edit" v-if="canChangeCurrent" @click="edit = true" wait-for-ripple>Изменить</q-btn>
						<q-btn color="negative" icon="delete" v-if="canChangeCurrent" @click="shipment_remove(shipment.ID_OTG)">Удалить доставку</q-btn>
					</div>
				</template>

				<div class="InfoCardShipmentsEdit" v-else>
					<q-btn-toggle v-model="editFields.type" :options="options.type" class="InfoCardShipmentsEdit__type"/>

					<q-field helper="Выбирете адрес доставки">
						<q-input type="textarea" v-model="editFields.marker.address" float-label="Куда" @click.native="options.to = !editFields.type"/>
						<select-address-form v-model="options.to" @select="editFields.marker = $event" :initial="editFields.to"/>
					</q-field>

					<q-field helper="Плановая дата">
						<q-datetime v-model="editFields.PL_OTGR" float-label="Дата" :min="options.dateMin"/>
					</q-field>

					<q-field elper="Сумма доставки">
						<q-input v-model.number="editFields.SUM_DOST" type="number" float-label="Сумма доставки"/>
					</q-field>

					<q-field elper="Комментарий">
						<q-input v-model="editFields.NOTE" type="textarea" float-label="Комментарий"/>
					</q-field>

					<div class="InfoCardShipments__buttons">
						<q-btn color="primary" icon="save" @click="save">Сохранить</q-btn>
						<q-btn color="seconary" icon="cancel" flat @click="edit = false" wait-for-ripple>Отмена</q-btn>
					</div>
				</div>

				<h6>Содержание доставки</h6>

				<table-collapsible :columns="InfoCardSofaHead" :rows="shipment.rows" accordion border-open>
					<info-card-sofa-inner slot-scope="{ row }" :content="row"/>

					<template slot="end" slot-scope="{ row }" v-if="!invoiceClosed && !row.dax">
						<q-btn flat color="negative" icon="delete" @click.stop="shipment_removeRow({ type: row.rowType, id: row.id })"/>
					</template>
				</table-collapsible>

				<div class="InfoCardShipments__footer">
					<q-btn color="primary" icon="add" @click="addRowsToShipmentFormOpen = true" v-if="canAddRows">Добавить строки в доставку</q-btn>
				</div>
			</template>
		</q-card-main>

		<q-card-actions v-if="!+content.IS_CLOSE">
			<q-btn color="primary" icon="add" @click="addShipmentFormOpen = true">Добавить доставку</q-btn>
		</q-card-actions>

		<invoice-add-shipment-form v-model="addShipmentFormOpen" :content="content"/>
		<invoice-add-rows-to-shipment-form v-model="addRowsToShipmentFormOpen" :content="content" :shipment="shipment.ID_OTG"/>
	</q-card>
</template>

<script>
import { QBtnToggle, QDatetime } from 'quasar'
import SelectAddressForm from '@/components/forms/SelectAddress'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import reduceShipmentTd from '@/lib/reducers/invoice/shipmentTd'
import reduceShipmentZak from '@/lib/reducers/invoice/shipmentZak'
import TableCollapsible from '@/components/TableCollapsible'
import InfoCardSofaInner from '@/components/InfoCardSofaInner'
import { InfoCardSofaHead } from '@/static/fieldDescription'
import InvoiceAddShipmentForm from '@/components/forms/InvoiceAddShipment'
import InvoiceAddRowsToShipmentForm from '@/components/forms/InvoiceAddRowsToShipment'
import BasePhone from '@/components/BasePhone'

export default {
	components: {
		TableCollapsible,
		InfoCardSofaInner,
		InvoiceAddShipmentForm,
		InvoiceAddRowsToShipmentForm,
		SelectAddressForm,
		QBtnToggle,
		QDatetime,
		BasePhone
	},
	mixins: [AuthMixin],
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data () {
		return {
			currentTab: '',
			addShipmentFormOpen: false,
			addRowsToShipmentFormOpen: false,
			InfoCardSofaHead: InfoCardSofaHead.filter(el => el.field != 'instance'),
			edit: false,
			editFields: {},
			options: {
				to: false,
				dateMin: this.$moment().add(1, 'day').toDate(),
				type: [
					{ label: 'Доставка', value: false },
					{ label: 'Самовывоз', value: true },
				],
			}
		}
	},
	watch: {
		shipment (n) {
			this.editFields = { ...this.shipment, type: this.shipment.VIDDOST == 'Самовывоз' }
		}
	},
	methods: {
		...mapActions([
			'shipment_remove',
			'shipment_removeRow',
			'shipment_update'
		]),
		save () {
			this.shipment_update({
				id: this.editFields.ID_OTG,
				type: this.editFields.type,
				price: this.editFields.SUM_DOST,
				comment: this.editFields.NOTE,
				date: this.$moment(this.editFields.PL_OTGR).format('YYYY-MM-DD'),
				to: this.editFields.marker
			})
			this.edit = false
		}
	},
	computed: {
		data () {
			return ((this.content || {}).shipments || []).map(shipment => {
				shipment.rows = [
					...this.content.td.filter(el => el.NZVR == shipment.ID_OTG).map(el => reduceShipmentTd(el)),
					...this.content.zak.filter(el => el.NZV == shipment.ID_OTG).map(el => reduceShipmentZak(el))
				];
				return shipment
			})
		},
		shipment () {
			return this.data.find(shipment => shipment.ID_OTG == this.currentTab) || this.data[0] || {}
		},
		invoiceClosed () {
			return this.content ? +this.content.IS_CLOSED : true
		},
		canChangeCurrent () {
			return !this.invoiceClosed && (this.shipment.rows || []).every(row => !+row.dax) && this.shipment.ID_OTG
		},
		canAddRows () {
			return this.content.zak.some(el => el.NZV == null) || this.content.td.some(el => el.NZVR == null)
		}
	}
}
</script>


<style lang="stylus">
.InfoCardShipments
	&__footer
		margin 10px 0

	&__buttons
		margin 10px 0
		display grid
		grid-gap 10px
		justify-content start
		grid-auto-flow column

.InfoCardShipmentsEdit
	display grid
	grid-gap 10px
	justify-items start
	margin-top 10px
	.q-field
		width 100%
		max-width 400px
</style>
