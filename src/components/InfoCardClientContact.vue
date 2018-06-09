<template>
	<q-item class="InfoCardClientContact">
		<template v-if="edit">
			<q-item-side v-if="contact.regard != 'Основной'">
				<q-field helper="Отношение контакного лица к клиенту">
					<q-input v-model="editFields.regard" float-label="Отношение"/>
				</q-field>
			</q-item-side>

			<q-item-main>
				<q-field>
					<q-input v-model="editFields.fio" float-label="ФИО"/>
				</q-field>
			</q-item-main>

			<q-item-side>
				<q-item-tile>
					<q-field>
						<q-input v-model="editFields.phone" type="tel" float-label="Телефон"/>
					</q-field>

					<q-checkbox v-model="editFields.disableSMS" label="Рассылка запрещена"/>
				</q-item-tile>

				<q-item-tile>
					<q-field>
						<q-input v-model="editFields.email" type="email" float-label="email"/>
					</q-field>

					<q-checkbox v-model="editFields.disableEMAIL" label="Рассылка запрещена"/>
				</q-item-tile>
			</q-item-side>

			<q-item-side right>
				<q-item-tile>
					<q-btn flat wait-for-ripple icon="cancel" color="secondary" @click="edit = false"/>
				</q-item-tile>

				<q-item-tile>
					<q-btn flat wait-for-ripple icon="save" color="primary" @click="save"/>
				</q-item-tile>
			</q-item-side>
		</template>

		<template v-else>
			<q-item-side>{{ contact.regard }}</q-item-side>

			<q-item-main>
				{{ contact.fio }}
			</q-item-main>

			<q-item-side right>
				<q-item-tile v-if="contact.phone">
					<base-phone :value="contact.phone" :place="{ contact }"/>
				</q-item-tile>

				<q-item-tile v-if="contact.email">
					{{ contact.email }}
				</q-item-tile>
			</q-item-side>

			<q-item-side right v-if="canEdit">
				<q-btn flat wait-for-ripple icon="edit" color="primary" @click="edit = true"/>
				<q-btn flat wait-for-ripple icon="delete" color="negative" v-if="contact.regard != 'Основной'"/>
			</q-item-side>
		</template>
	</q-item>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import BasePhone from '@/components/BasePhone'
import { ContactFace } from '@/lib'

export default {
	components: {
		BasePhone
	},
	mixins: [AuthMixin],
	props: {
		content: {
			type: Object,
			default: a => ({})
		},
		canEdit: Boolean
	},
	data () {
		return {
			edit: false,
			editFields: {}
		}
	},
	computed: {
		contact () {
			let data = (this.content instanceof ContactFace ? this.content : new ContactFace(this.content)) || {}
			this.editFields = data.clone()
			return data
		}
	},
	methods: {
		...mapActions([
			'client_updateContact'
		]),
		save () {
			let { disableEMAIL, disableSMS } = this.editFields
			this.client_updateContact({
				...this.editFields,
				disableEMAIL,
				disableSMS,
				__ob__: undefined
			})
			this.edit = false
		}
	}
}
</script>


<style lang="stylus">

</style>
