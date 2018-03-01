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
						<q-item-side>
							<preview-salon :content="data.salon" v-if="data.salon"/>
						</q-item-side>
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

	<clickable
		v-popover:previewManagerPopover
		@click.native.stop
	>
		{{ fio }}
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

import PreviewSalon from '@/components/PreviewSalon'
import Clickable from '@/components/Clickable'

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
		Clickable,
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
		PreviewSalon
	},
	computed: {
		data() {
			return this.content
		},
		fio() {
			return `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}`
		}
	},
}
</script>


<style lang="less">
.managerPreviewPopoverCard {
    margin: 0;
    width: 500px;
	max-width: ~"calc(100vw - 15px)";
}
</style>
