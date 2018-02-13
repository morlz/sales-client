<template>
<q-chip square color="positive">
	{{ fio }}
	<q-popover ref="clientPreviewPopover" popper-class="el-popover-empty">
		<q-card class="clientPreviewPopoverCard">
			<q-card-title>
				{{ fio }}
			</q-card-title>
			<q-card-main>
				<q-list>
					<q-item v-if="data.salon">
						<q-item-side>Салон</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.salon.NAME }}</q-item-side>
					</q-item>
				</q-list>
			</q-card-main>
			<q-card-separator />
			<q-card-actions>
				<router-link :to="{ path: `/admin/personal/${this.data.ID_M}` }">
					<q-btn flat>Перейти к профилю</q-btn>
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
	QItemSide
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
		QItemSide
	},
	watch: {

	},
	computed: {
		data() {
			return this.content
		},
		fio() {
			return client.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		}
	},
	methods: {

	},
}
</script>


<style lang="less">
.clientPreviewButtonWrapper {
    cursor: pointer;
}
.clientPreviewChip {
    cursor: pointer;
}
.clientPreviewPopoverCard {
    margin: 0;
    width: 500px;
}
</style>
