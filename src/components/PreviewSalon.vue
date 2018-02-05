<template>
<q-chip square color="positive">
	{{ data.NAME }}
	<q-popover ref="salonPreviewPopover">
		<q-card class="salonPreviewPopoverCard">
			<q-card-title>
				{{ data.NAME }}
			</q-card-title>
			<q-card-main>
				<q-card-main>
					<q-list>
						<q-item>
							<q-item-side>Город</q-item-side>
							<q-item-main/>
							<q-item-side>{{ data.GOROD }}</q-item-side>
						</q-item>
						<q-item>
							<q-item-side>Адрес</q-item-side>
							<q-item-main/>
							<q-item-side>{{ data.ADRES }}</q-item-side>
						</q-item>
						<q-item>
							<q-item-side>Название</q-item-side>
							<q-item-main/>
							<q-item-side>{{ data.SalonName }}</q-item-side>
						</q-item>
						<q-item>
							<q-item-side>Email</q-item-side>
							<q-item-main/>
							<q-item-side>{{ data.EM_ADRES }}</q-item-side>
						</q-item>
						<q-item v-if="data.TEL1 || data.TEL2">
							<q-item-side>Телефон(ы)</q-item-side>
							<q-item-main/>
							<q-item-side>
								<q-item-tile v-if="data.TEL1">{{ data.TEL1 }}</q-item-tile>
								<q-item-tile v-if="data.TEL2">{{ data.TEL2 }}</q-item-tile>
							</q-item-side>
						</q-item>
					</q-list>
				</q-card-main>
			</q-card-main>
			<q-card-separator />
			<q-card-actions>
				<router-link :to="{ path: `/` }">
					<q-btn flat>Перейти к салону</q-btn>
				</router-link>
			</q-card-actions>
		</q-card>
	</q-popover>
</q-chip>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QPopover,
	QChip,
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
	QItemSide,
	QItemTile
} from 'quasar'

export default {
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data() {
		return {
			popoverShow: false
		}
	},
	components: {
		QPopover,
		QChip,
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
		QItemTile
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
.salonPreviewButtonWrapper {
    cursor: pointer;
}
.salonPreviewChip {
    cursor: pointer;
}
.salonPreviewPopoverCard {
    margin: 0;
    width: 600px;
}
</style>
