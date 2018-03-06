<template>
<q-card class="filterDate">
	<q-card-title>Фильтр по дате</q-card-title>
	<q-card-main>
		<q-field helper="Условия выбора даты">
			<ul>
				<li v-for="item, index in itogCondition" @click="removeCondition(index)">{{ item }}</li>
			</ul>
			<p v-if="!itogCondition.length">Нет условий по дате</p>
		</q-field>

		<q-tabs inverted v-model="add.tab">
			<q-tab slot="title" label="Промежуток" name="range"/>
			<q-tab slot="title" label="1 Значение" name="one"/>

			<q-tab-pane name="range">
				<q-field helper="С какой даты">
					<q-datetime v-model="add.range.from" type="datetime" />
				</q-field>

				<q-field helper="По какую дату">
					<q-datetime v-model="add.range.to" type="datetime" />
				</q-field>

				<q-option-group type="radio" :options="optionsRange" v-model="add.range.type"/>
			</q-tab-pane>

			<q-tab-pane name="one" default>
				<q-option-group type="radio" :options="optionsOne" v-model="add.one.type"/>
				<q-field helper="Дата">
					<q-datetime v-model="add.one.date" type="datetime" />
				</q-field>
			</q-tab-pane>
		</q-tabs>
	</q-card-main>

	<q-card-actions>
		<q-btn flat color="primary" @click="addCondition">Добавить</q-btn>
	</q-card-actions>
</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import moment from 'moment'

import { QField, QTabs, QTab, QBtn, QCard, QCardTitle, QCardMain, QCardActions, QTabPane, QDatetime, QOptionGroup } from 'quasar'

const dateTimeFormat = "DD-MM-YYYY HH:mm:ss"

export default {
	data() {
		return {
			add: {
				tab: "one",
				range: {
					conditionType: 'range',
					from: "",
					to: "",
					type: ""
				},
				one: {
					conditionType: 'one',
					date: "",
					type: "="
				}
			},
			condition: []
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
		QDatetime,
		QOptionGroup
	},
	watch: {

	},
	computed: {
		optionsOne () {
			return [
				{ label: "Равно", value: "=" },
				{ label: "Не равно", value: "!=" },
				{ label: "Больше чем", value: ">" },
				{ label: "Меньше чем", value: "<" },
			]
		},
		optionsRange () {
			return [
				{ label: "Входит", value: "" },
				{ label: "Не входит", value: "!" },
			]
		},
		itogCondition () {
			return this.condition.map(el => {
				if (el.conditionType == 'range')
					return (el.type == '!' ? 'Не в' : 'В') + ` промежутке от ${moment(el.from).format(dateTimeFormat)} до ${moment(el.to).format(dateTimeFormat)}`

				if (el.conditionType == 'one')
					return this.optionsOne.find(f => f.value == el.type).label + ` ${moment(el.date).format(dateTimeFormat)}`
			})
		}
	},
	methods: {
		addCondition () {
			this.condition.push({ ...this.add[this.add.tab] })
		},
		removeCondition (index) {
			this.condition.splice(index, 1)
		}
	},
}
</script>


<style lang="less">
.filterDate {
	width: 400px;
}
</style>
