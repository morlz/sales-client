<template>
	<q-card>
		<q-card-title>
			Информация о клиенте
		</q-card-title>

		<q-card-main>
			<q-list highlight no-border	>

				<q-item>
					<q-item-side>Имя</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ fio }}
					</q-item-side>
				</q-item>


				<q-item v-if="data.signs">
					<q-item-side>Приметы</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.signs }}
					</q-item-side>
				</q-item>

				<q-item v-if="data.notactive">
					<q-item-side>Неактивен</q-item-side>
					<q-item-main/>
					<q-item-side>
						{{ data.notactive }}
					</q-item-side>
				</q-item>

				<q-item>
					<q-item-side>Контактные лица</q-item-side>
					<q-item-main/>
					<q-item-side>
						<template v-for="contact, index in data.contactfaces">
							<q-item-tile>{{ contact.fio }}</q-item-tile>
							<q-item-tile>{{ contact.regard }} {{ contact.phone }} {{ contact.email }} </q-item-tile>
						</template>
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
	QCard,
	QCardTitle,
	QCardMain,
	QList,
	QItem,
	QItemMain,
	QItemSide,
	QItemTile,
	QItemSeparator,
	QCollapsible
} from 'quasar'

export default {
	mixins: [mixins],
	props: ["content"],
	components: {
		QCard,
		QCardTitle,
		QCardMain,
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QItemTile,
		QItemSeparator,
		QCollapsible
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
			return this.content || {}
		},
		fio () {
			return this.data.FIO ? `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}` : `${this.data.lastname} ${this.data.name} ${this.data.patronymic}`
		}
	}
}
</script>


<style lang="less">


</style>
