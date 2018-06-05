<template>
	<div class="InfoCardInvoicesInner" v-if="content">
		<div class="separator-g" v-ga="`sg1`"/>

		<table-two-collumns v-ga="'c1'">
			<table-two-collumns-row>
				<template slot="label">Номер документа</template>
				{{ getContentByPath('content.N_DOC') }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Сумма заказа</template>
				{{ getContentByPath('content.cachedPrice') }} руб.
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.manager">
				<template slot="label">Менеджер</template>
				<preview-manager :content="content.manager" />
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.salon">
				<template slot="label">Салон</template>
				<preview-salon :content="content.salon" />
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.storage">
				<template slot="label">Склад</template>
				<preview-salon :content="content.storage" />
			</table-two-collumns-row>
		</table-two-collumns>

		<div class="separator-v" v-ga="`sm`"/>

		<table-two-collumns v-ga="'c2'">
			<table-two-collumns-row>
				<template slot="label">Рекламный источник</template>
				{{ getContentByPath('content.adSource.name') }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Состояние</template>
				{{ +content.IS_CLOSE ? 'Закрыт' : 'Открыт' }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Дата создания</template>
				{{ $moment(content.DATE).format('DD MMMM YYYY HH:mm:ss') }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Вид оплаты</template>
				{{ {'0': 'Наличными', '1': 'Картой', '3': 'Заказ на подиум'}[content.VID_OPLATI] }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<q-btn color="primary" :to="`/docs/invoices/${content.id}`">Перейти к заказу</q-btn>
			</table-two-collumns-row>
		</table-two-collumns>

		<div class="separator-g" v-ga="`sg2`"/>
	</div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin, SingleItemPageMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible'
import TableTwoCollumns from '@/components/TableTwoCollumns'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow'
import PreviewManager from '@/components/PreviewManager'
import PreviewSalon from '@/components/PreviewSalon'

import { Invoice } from '@/lib'

export default {
	components: {
		TableCollapsible,
		TableTwoCollumns,
		TableTwoCollumnsRow,
		PreviewManager,
		PreviewSalon
	},
	mixins: [AuthMixin, SingleItemPageMixin],
	props: {
		content: {
			type: Object,
			default: a => []
		}
	},
	data () {
		return {

		}
	},
	computed: {

	},
	methods: {

	},

}
</script>


<style lang="stylus">
.InfoCardInvoicesInner
	display grid
	grid-template "sg1 sg1 sg1" 1px "c1  sm  c2" 1fr "sg2 sg2 sg2" 1px / 1fr 1px 1fr

	align-items start
	padding 15px
	grid-gap 15px

	&-mobile
		grid-template "c1" 1fr "sg1" 1px "c2" 1fr / 1fr

	.tableTwoCollumns__rowValue
		font-weight bold

</style>
