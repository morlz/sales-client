<template>
	<q-card class="InfoCardClient">
		<q-card-title>
			Информация о клиенте
		</q-card-title>

		<q-card-main>
			<q-list highlight no-border	>
				<q-item>
					<q-item-side>Имя</q-item-side>
					<q-item-main/>
					<q-item-side>
						<preview-client :content="data"/>
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
			</q-list>

			<h6 class="InfoCardClient__contacts">Контакные лица</h6>

			<q-list no-border>
				<q-item v-for="contact, index in data.contactfaces" :key="index">
					<q-item-side>{{ contact.regard }}</q-item-side>

					<q-item-main>
						{{ contact.fio }}
					</q-item-main>

					<q-item-side>
						<q-item-tile v-if="contact.phone" class="hiddenNumber">
							{{ contact.phone }}
						</q-item-tile>

						<q-item-tile v-if="contact.email">
							{{ contact.email }}
						</q-item-tile>
					</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import PreviewClient from '@/components/PreviewClient'
import {
	QItemSeparator,
	QCollapsible
} from 'quasar'

export default {
	mixins: [AuthMixin],
	props: ["content"],
	components: {
		QItemSeparator,
		QCollapsible,
		PreviewClient
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


<style lang="stylus">
.InfoCardClient
	&__contacts
		font-size 18px
		font-weight normal

</style>
