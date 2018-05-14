<template>
<q-page class="AppContent">
	<div class="AppContent__inner ReportInventory">
		<q-card class="ReportInventory__actions">
			<q-btn @click="local_reports_inventory_exportToExcel">
				<q-icon name="fa-download"/>
				{{ !app_view_mobile ? 'Экспорт в Excel' : ''}}
			</q-btn>

			<q-btn @click="local_reports_inventory_print">
				<q-icon name="print"/>
				{{ !app_view_mobile ? 'Печать' : ''}}
			</q-btn>
		</q-card>

		<q-card class="ReportInventory__main" ref="print">
			<table>
				<thead>
					<tr>
						<th>Номер п/п</th>
						<th>Модель</th>
						<th>Тип</th>
						<th>УН</th>
						<th>Цена руб.</th>
						<th>Ткань 1</th>
						<th>Ткань 2</th>
						<th>Ткань 3</th>
						<th>Декор</th>
						<th>Стежка</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="item, index in reports_inventory_cached" @click="clickHandler(item)">
						<td>{{ index + 1 }}</td>
						<td>{{ item.furniture.MODEL }}</td>
						<td>{{ item.TIP }}</td>
						<td>{{ item.UN }}</td>
						<td style="text-align: right;">
							<div style="width: 100px;">
								{{ item.price | money }}
							</div>
						</td>
						<td>{{ getContentByPath('furniture.cloth1.NAME', item) || item.furniture.TKAN }}</td>
						<td>{{ getContentByPath('furniture.cloth2.NAME', item) || item.furniture.KOMP }}</td>
						<td>{{ getContentByPath('furniture.cloth3.NAME', item) || item.furniture.KOMP1 }}</td>
						<td>{{ item.furniture.DEKOR }}</td>
						<td>{{ item.furniture.Vid_stegki }}</td>
					</tr>
				</tbody>
			</table>

			<div class="ReportInventory__itog">
				<div class="ReportInventory__count">
					Количество позиций: {{ reports_inventory_cached.length }}
				</div>

				<div class="ReportInventory__summ">
					Сумма цен: {{ reports_inventory_summ | money }} руб.
				</div>
			</div>

			<loading :value="reports_inventory_loading"/>
		</q-card>

		<modal-sofa v-model="modalSofa" :id="modalSofaId" type="salon"/>
	</div>
</q-page>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import { SingleItemPageMixin } from '@/mixins'
import ModalSofa from '@/components/ModalSofa'
import Loading from '@/components/Loading'
import money from '@/filters/Money'

export default {
	components: {
		ModalSofa,
		Loading
	},
	mixins: [SingleItemPageMixin],
	filters: {
		money
	},
	props: {

	},
	data() {
		return {
			modalSofa: false,
			modalSofaId: 0
		}
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		...mapGetters('reports/inventory', [
			'reports_inventory_cached',
			'reports_inventory_loading',
			'reports_inventory_summ'
		])
	},
	methods: {
		...mapActions('reports/inventory', [
			'reports_inventory_init',
			'reports_inventory_exportToExcel',
			'reports_inventory_print',
			'reports_inventory_destroy'
		]),
		clickHandler (row) {
			this.modalSofaId = +row.ID
			this.modalSofa = !this.modalSofa
		},
		local_reports_inventory_print () {
			this.$store.dispatch('notify', 'Создание файла, это может занять некоторое время...')
			if (!this.$refs.print) return

			this.reports_inventory_print(this.$refs.print.$el.innerHTML)
		},
		local_reports_inventory_exportToExcel () {
			if (!this.$refs.print) return

			this.reports_inventory_exportToExcel(this.$refs.print.$el.innerHTML)
		}
	},
	async created () {
		await this.reports_inventory_init()
	},
	beforeDestroy () {
		this.reports_inventory_destroy()
	}
}
</script>


<style lang="stylus">
.ReportInventory
	display grid
	grid-gap 10px

	&__actions
		display grid
		grid-gap 15px
		padding 5px 10px
		justify-content start
		align-items center
		grid-template-columns repeat(auto-fit, minmax(100px, max-content))
		button
			margin 10px 0

	&__main
		position relative
		table
			border-collapse collapse

			td,
			th
				padding 5px
				border-bottom 1px solid #eee
				transition all 0.2s ease-in-out

			th
				border-bottom 2px solid #eee

			td
				height 50px
				cursor pointer
				//white-space nowrap
				&:first-child
					padding-left 15px
				&:last-child
					padding-right 15px

			tr:hover > td
				background #ecf5ff


		&-print table
			border-collapse collapse

			td,
			th
				border 1px solid black
				box-sizing border-box
	&__itog
		padding 10px
		font-size 16px

.ReportInventoryPrintHeader
	&__title
		text-align center
		font-size 24pt

	&__list
		margin-bottom 30px
		li
			list-style none
</style>
