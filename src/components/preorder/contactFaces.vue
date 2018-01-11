<template>
	<el-card class="contacts" v-if="auth_can(1, 'ContactFace')">
		<div slot="header">
			<h2>Контакты</h2>
		</div>

		<tabless :data="data" :fieldDescription="clientContactsFieldDescription" :buttons="afterTableContactButtons" :minify="true" />

		<div class="buttons">
			<el-button type="primary" @click="client_visible_addContactFormSet(true)" v-if="allowCreate && auth_can(2, 'ContactFace')">Добавить контакт</el-button>
			<add-contact-form v-if="allowCreate && auth_can(2, 'ContactFace')"/>
			<edit-contact-form v-if="auth_can(2, 'ContactFace')"/>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import addContactForm from '@/components/forms/addContact.vue'
import editContactForm from '@/components/forms/editContact.vue'
import fieldDescription from '@/static/fieldDescription'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'

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
	mixins: [mixins],
	components: {
		editContactForm,
		addContactForm,
		tabless
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
