<template>
<div class="previewCloth">
	<el-popover ref="previewClothPopover" popper-class="el-popover-empty">
		<q-card class="clothPreviewPopoverCard">
			<q-card-title>
				{{ data.NAME }}
			</q-card-title>
			<q-card-main>
				<q-list>
					<q-item>
						<q-item-side>Категория</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.KAT }}</q-item-side>
					</q-item>
					<q-item v-if="data.CENA">
						<q-item-side>Цена</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.CENA }}</q-item-side>
					</q-item>
					<q-item v-if="data.ISP">
						<q-item-side>Испонение</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.ISP }}</q-item-side>
					</q-item>
					<q-item v-if="data.TKAN">
						<q-item-side>Код(ИД)</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.TKAN }}</q-item-side>
					</q-item>
				</q-list>
			</q-card-main>
			<q-card-separator />
			<q-card-actions>
				<router-link :to="{ path: `/` }">
					<q-btn flat>Перейти к ткани</q-btn>
				</router-link>
			</q-card-actions>
		</q-card>
	</el-popover>

	<clickable
		v-popover:previewClothPopover
		:width="width"
		:inline="inline"
		@click.native.stop>
		{{ data.NAME }}
	</clickable>
</div>


</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QPopover,
	QCard,
	QCardTitle,
	QCardMain,
	QCardSeparator,
	QCardActions,
	QBtn,
	QIcon,
	QList,
	QItem,
	QItemMain,
	QItemSide
} from 'quasar'

import Clickable from '@/components/Clickable'

export default {
	props: {
		content: {
			type: Object,
			default: a => ({})
		},
		inline: {
			type: Boolean,
			default: a => false
		},
		width: {
			type: [Number, String],
			default: a => 'auto'
		}
	},
	data() {
		return {
			popoverShow: false
		}
	},
	components: {
		QPopover,
		QCard,
		QCardTitle,
		QCardMain,
		QCardSeparator,
		QCardActions,
		QIcon,
		QBtn,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		Clickable
	},
	watch: {

	},
	computed: {
		data() {
			return this.content
		},
	},
	methods: {

	},
}
</script>


<style lang="less">
.clothPreviewPopoverCard {
    margin: 0;
    width: 500px;
	max-width: ~"calc(100vw - 15px)";
}
</style>
