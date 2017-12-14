<template>
	<el-card class="contacts">
		<div slot="header">
			<h2>Контакты</h2>
		</div>

		<tabless :data="data" :fieldDescription="clientContactsFieldDescription" :buttons="afterTableContactButtons" :minify="true" />

		<div class="buttons">
			<el-button type="primary" @click="updateAddClientContactFormVisible(true)">Добавить контакт</el-button>
			<add-contact-form/>
			<edit-contact-form/>
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
	props: ['content'],
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
	watch: {

	},
	methods: {
		...mapMutations([
			'updateAddClientContactFormVisible'
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
