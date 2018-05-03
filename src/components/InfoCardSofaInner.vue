<template>
	<div class="InfoCardSofaInner" :class="{ 'InfoCardSofaInner-mobile': app_view_mobile }">
		<div class="separator-g" v-ga="`sg1`"/>

		<table-two-collumns v-ga="'c1'">
			<table-two-collumns-row>
				<template slot="label">Цена дивана</template>
				{{ content.instance.originalPrice }} руб.
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Скидка</template>
				{{ content.instance.discountString }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Итоговая цена</template>
				{{ content.instance.price }} руб.
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Категория</template>
				{{ content.kat }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Модель</template>
				{{ content.model }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Тип</template>
				{{ content.type }}
			</table-two-collumns-row>
		</table-two-collumns>

		<div class="separator-v" v-ga="`sm`"/>

		<table-two-collumns v-ga="'c2'">
			<table-two-collumns-row v-if="content.dekor">
				<template slot="label">Декор</template>
				{{ content.dekor }}
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.stegka">
				<template slot="label">Вид стёжки</template>
				{{ content.stegka }}
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.cloth1">
				<template slot="label">Ткань 1</template>
				<preview-cloth :content="content.cloth1" v-if="content.cloth1"/>
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.cloth2">
				<template slot="label">Ткань 2</template>
				<preview-cloth :content="content.cloth2" v-if="content.cloth2"/>
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.cloth3">
				<template slot="label">Ткань 3</template>
				<preview-cloth :content="content.cloth3" v-if="content.cloth3"/>
			</table-two-collumns-row>

			<table-two-collumns-row v-if="content.comment">
				<template slot="label">Примечание</template>
				{{ content.comment }}
			</table-two-collumns-row>

			<table-two-collumns-row>
				<template slot="label">Доставка</template>
				<div :style="{ color: content.shipment_id ? 'green' : 'red' }">
					<q-icon :name="content.shipment_id ? 'done' : 'warning'"/> {{ content.shipment_id ? 'Назначена ' + shipmentDate : 'Не назначена' }}
				</div>
			</table-two-collumns-row>
		</table-two-collumns>

		<div class="separator-g" v-ga="`sg2`"/>
	</div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import TableTwoCollumns from '@/components/TableTwoCollumns'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow'
import PreviewCloth from '@/components/PreviewCloth'
export default {
	props: {
		content: {
			type: Object,
			default: a => ({})
		},
		shipments: Array
	},
	components: {
		TableTwoCollumns,
		TableTwoCollumnsRow,
		PreviewCloth
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		shipmentDate () {
			if (!this.shipments) return ''

			return 'на ' + this.$moment(this.shipments.find(el => el.ID_OTG == this.content.shipment_id).PL_OTGR).format('DD MMMM YYYY')
		}
	}
}
</script>


<style lang="less">
.InfoCardSofaInner {
	display: grid;
	grid-template: 	"sg1 sg1 sg1" 	1px
					"c1  sm  c2"	1fr
					"sg2 sg2 sg2"	1px
				~"/" 1fr 1px 1fr;
	align-items: flex-start;
	padding: 15px;
	grid-gap: 15px;

	&-mobile {
		grid-template: 	"c1"	1fr
						"sg1"	1px
						"c2"	1fr
					~"/" 1fr;
	}

	.tableTwoCollumns__rowValue {
		font-weight: bold;
	}
}
</style>
