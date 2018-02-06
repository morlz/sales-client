<template>
<div class="previewManager">
	<el-popover ref="previewManagerPopover" popper-class="el-popover-empty">
		<q-card class="managerPreviewPopoverCard">
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
					<q-item>
						<q-item-side>Должность</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.UPOST }}</q-item-side>
					</q-item>
					<q-item>
						<q-item-main>{{ !!data.RABOTAET ? 'Работает' : 'Не работает'}}</q-item-main>
					</q-item>
					<q-item v-if="data.UVOLEN">
						<q-item-side>Уволен</q-item-side>
						<q-item-main/>
						<q-item-side>{{ data.UVOLEN }}</q-item-side>
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
	</el-popover>

	<q-chip square color="positive" v-popover:previewManagerPopover class="previewManager__chip">
		{{ fio }}
	</q-chip>
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
			return `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}`
		}
	},
	methods: {

	},
}
</script>


<style lang="less">
.previewManager {
	&__chip {
		cursor: pointer;
	}
}

.managerPreviewPopoverCard {
    margin: 0;
    width: 500px;
}
</style>
