<template>
<div class="AppContent">
	<div class="reportSales">
		<q-card class="reportSales__actions">
			<q-field helper="Салон">
				<q-select v-model="salon" :options="local_salon_list"/>
			</q-field>
			<q-field helper="С">
				<q-datetime v-model="date.from"/>
			</q-field>
			<q-field helper="По">
				<q-datetime v-model="date.to"/>
			</q-field>
			<q-btn>
				<q-icon name="open_in_new"/>
				{{ !app_view_mobile ? 'Открыть в новом окне' : ''}}
			</q-btn>
			<q-btn>
				Экспорт в Excel
			</q-btn>
		</q-card>

		<q-card class="reportSales__content">
		</q-card>
	</div>

</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QCard, QBtn, QDatetime, QSelect, QField, QIcon } from 'quasar'

export default {
	components: {
		QCard,
		QBtn,
		QDatetime,
		QSelect,
		QField,
		QIcon
	},
	data() {
		return {
			date: {
				from: "",
				to: ""
			},
			salon: undefined
		}
	},
	watch: {

	},
	computed: {
		...mapGetters([
			'salon_listWithAll',
			'app_view_mobile'
		]),
		local_salon_list () {
			return this.salon_listWithAll.map(el => ({ value: el.ID_SALONA, label: el.NAME }))
		}
	},
	methods: {
		...mapActions([
			'salon_getList'
		])
	},
	async mounted () {
		await this.salon_getList()
	}
}
</script>


<style lang="less">
.reportSales {
	&__actions {
		display: grid;
		grid-gap: 10px;
		padding: 0 10px;
		justify-content: start;
		align-items: center;
		grid-template-columns: repeat(auto-fill, minmax(200px, max-content));
		button {
			margin: 10px 0;
		}
	}

	&__content {
		padding: 10px;
	}
}


</style>
