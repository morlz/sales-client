<template>
	<q-card>
		<q-card-title>
			Дополнительная информация
		</q-card-title>

		<q-card-main>
			<q-list highlight no-border>
				<q-item v-if="data.adSource">
					<q-item-side>Рекламный источник</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.adSource.NAME }}
					</q-item-side>
				</q-item>

				<q-item v-if="data.storage">
					<q-item-side>Склад</q-item-side>
					<q-item-main/>
					<q-item-side>
						<preview-salon :content="data.storage" />
					</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/mixins'
import {
	QItemSeparator,
	QCollapsible
} from 'quasar'

import PreviewSalon from '@/components/PreviewSalon.vue'

export default {
	mixins: [mixins],
	props: ["content"],
	components: {
		QItemSeparator,
		QCollapsible,
		PreviewSalon
	},
	data () {
		return {}
	},
	watch: {

	},
	methods: {

	},
	computed: {
		data () {
			return this.content || []
		},
		fio () {
			return this.data.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		}
	}
}
</script>


<style lang="less">


</style>
