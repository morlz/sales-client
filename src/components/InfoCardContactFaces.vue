<template>
	<q-card class="contacts" v-if="auth_can(1, 'ContactFace')">
		<q-card-title>
			Контакты
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="clientContactsFieldDescription" :rows="data"/>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="client_visible_addContactFormSet(true)" v-if="allowCreate && auth_can(2, 'ContactFace')" icon="add">Добавить контакт</q-btn>
		</q-card-actions>

		<add-contact-form v-if="allowCreate && auth_can(2, 'ContactFace')"/>
		<edit-contact-form v-if="auth_can(2, 'ContactFace')"/>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import addContactForm from '@/components/forms/addContact'
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
		addContactForm,
		TableCollapsible
	},
	data () {
		return {
			clientContactsFieldDescription
		}
	},
	methods: {
		...mapMutations([
			'client_visible_addContactFormSet'
		])
	},
	computed: {
		data () {
			return this.content || []
		}
	}
}
</script>


<style lang="less" scoped>
.contacts {
	.buttons {
		margin-top: 15px;
	}
}
</style>
