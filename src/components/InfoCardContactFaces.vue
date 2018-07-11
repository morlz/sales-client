<template>
	<q-card
		class="InfoCardContactFaces"
		v-if="auth_can(1, 'ContactFace')">
		<q-card-title>
			Контакты
		</q-card-title>

		<q-card-main>
			<table-collapsible
				:columns="clientContactsFieldDescription"
				:rows="data"/>
		</q-card-main>

		<q-card-actions>
			<q-btn
				color="primary"
				@click="add"
				v-if="allowCreate && auth_can(2, 'ContactFace')"
				icon="add">
				Добавить контакт
			</q-btn>
		</q-card-actions>

		<form-contact-face-add
			v-if="allowCreate && auth_can(2, 'ContactFace')"
			v-model="addContactFaceForm"/>

		<edit-contact-form
			v-if="auth_can(2, 'ContactFace')"/>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FormContactFaceAdd from '@/components/forms/ContactFaceAdd'
import editContactForm from '@/components/forms/editContact'
import fieldDescription from '@/static/fieldDescription'
import { AuthMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible'

let {
	clientContactsFieldDescription
} = fieldDescription

export default {
	props: {
		allowCreate: {
			type: Boolean,
			default: false
		},
		content: {
			required: true
		}
	},
	mixins: [AuthMixin],
	components: {
		editContactForm,
		FormContactFaceAdd,
		TableCollapsible
	},
	data () {
		return {
			clientContactsFieldDescription,
			addContactFaceForm: false
		}
	},
	methods: {
		add () {
			this.addContactFaceForm = true
		}
	},
	computed: {
		data () {
			return this.content || []
		}
	}
}
</script>


<style lang="stylus" scoped>
.InfoCardContactFaces
	display grid
	grid-template-rows max-content 1fr max-content
</style>
