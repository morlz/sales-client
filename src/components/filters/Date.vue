<template>
<q-card class="filterDate">
	<q-card-title>Фильтр по дате</q-card-title>
	<q-field label="Параметры поиска">
		<div class="">
			123
		</div>
	</q-field>

	<q-tabs inverted>
		<q-tab slot="title" label="Промежуток" name="range"/>
		<q-tab slot="title" label="1 Значение" name="one"/>

		<q-tab-pane name="range">
			<q-field helper="С какой даты">
				<q-datetime v-model="add.range.from" type="datetime" />
			</q-field>

			<q-field helper="По какую дату">
				<q-datetime v-model="add.range.to" type="datetime" />
			</q-field>
		</q-tab-pane>

		<q-tab-pane name="one">

		</q-tab-pane>
	</q-tabs>

	<q-card-actions>
		<q-btn flat color="primary">Добавить</q-btn>
	</q-card-actions>
</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QField, QTabs, QTab, QBtn, QCard, QCardTitle, QCardMain, QCardActions, QTabPane, QDatetime } from 'quasar'

export default {
	data() {
		return {
			add: {
				range: {
					from: "",
					to: ""
				}
			}
		}
	},
	components: {
		QField,
		QTabs,
		QTab,
		QBtn,
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QTabPane,
		QDatetime
	},
	watch: {

	},
	computed: {

	},
	methods: {

	},
}
</script>


<style lang="less">
.filterDate {
	width: 400px;
}
</style>
