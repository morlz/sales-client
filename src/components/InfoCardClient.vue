<template>
	<q-card class="InfoCardClient">
		<q-card-title>
			Информация о клиенте
		</q-card-title>

		<q-card-main>
			<div v-if="edit" class="InfoCardClientEdit">
				<q-field>
					<q-input v-model="editFields.fio" float-label="ФИО"/>
				</q-field>

				<q-field>
					<q-input v-model="editFields.signs" type="textarea" float-label="Приметы"/>
				</q-field>

				<q-field>
					<q-toggle v-model="editFields.notactive" label="Неактивен"/>
				</q-field>
			</div>

			<q-list highlight no-border v-else>
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
						{{ data.notactiveDate }}
					</q-item-side>
				</q-item>
			</q-list>
			
			<h6 class="InfoCardClient__contacts">Контакные лица</h6>

			<q-list highlight>
				<info-card-client-contact v-for="contact, index in data.contactfaces" :key="index" :content="contact" :can-edit="data.canEdit"/>
			</q-list>
		</q-card-main>

		<q-card-actions>
			<template v-if="edit">
				<q-btn color="primary" @click="save">Сохранить</q-btn>
				<q-btn color="secondary" @click="edit = false" wait-for-ripple flat>Отмена</q-btn>
			</template>

			<template v-else>
				<q-btn color="primary" v-if="data.canEdit && auth_can(3, 'Client')" @click="edit = true" wait-for-ripple>Редактировать</q-btn>
			</template>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import PreviewClient from '@/components/PreviewClient'
import InfoCardClientContact from '@/components/InfoCardClientContact'
import {
	QItemSeparator,
	QCollapsible
} from 'quasar'
import BasePhone from '@/components/BasePhone'
import { Client } from '@/lib'

export default {
	components: {
		QItemSeparator,
		QCollapsible,
		PreviewClient,
		InfoCardClientContact,
		BasePhone
	},
	mixins: [AuthMixin],
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data () {
		return {
			edit: false,
			editFields: {}
		}
	},
	computed: {
		data () {
			let data = (this.content instanceof Client ? this.content : new Client(this.content)) || {}
			this.editFields = data.clone()
			return data
		},
	},
	methods: {
		...mapActions([
			'client_update'
		]),
		save () {
			let { id, notactive, name, lastname, patronymic, signs } = this.editFields
			this.client_update({ id, notactive, name, lastname, patronymic, signs })
			this.edit = false
		}
	}
}
</script>


<style lang="stylus">
.InfoCardClient
	&__contacts
		font-size 18px
		font-weight normal

.InfoCardClientEdit
	display grid
	grid-gap 10px
	margin-bottom 10px
</style>
