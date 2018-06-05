<template>
	<q-card class="InfoCardInvoices">
		<q-card-title>
			Заказы
		</q-card-title>

		<q-card-main>
			<table-collapsible :columns="InfoCardInvoices" :rows="data" accordion border-open>
				<info-card-invoices-inner slot-scope="{ row }" :content="row"/>
			</table-collapsible>
		</q-card-main>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible.vue'
import TableTwoCollumns from '@/components/TableTwoCollumns.vue'
import TableTwoCollumnsRow from '@/components/TableTwoCollumnsRow.vue'
import { InfoCardInvoices } from '@/static/fieldDescription'
import { Invoice } from '@/lib'

import InfoCardInvoicesInner from '@/components/InfoCardInvoicesInner'

export default {
	components: {
		TableCollapsible,
		TableTwoCollumns,
		TableTwoCollumnsRow,
		InfoCardInvoicesInner
	},
	mixins: [AuthMixin],
	props: {
		content: {
			type: Array,
			default: a => []
		}
	},
	data () {
		return {
			InfoCardInvoices
		}
	},
	computed: {
		data () {
			console.log(this.content);
			return this.content.map(el => el instanceof Invoice ? el : new Invoice(el))
		}
	},
	methods: {

	},

}
</script>


<style lang="less">

</style>
