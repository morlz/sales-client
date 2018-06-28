<template>
	<div class="FilterDate">
		<q-input v-model="filters" :float-label="floatLabel" @click="modal = true"/>

		<q-modal v-model="modal" class="FilterDateModal" :content-css="{width: '80vw', minHeight: '80vh', maxWidth: '900px'}">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn flat round dense v-close-overlay icon="keyboard_arrow_left"/>
					<q-toolbar-title>Фильтр по дате</q-toolbar-title>
					<q-btn flat round dense v-close-overlay icon="check"/>
				</q-toolbar>

				<div class="FilterDate__main layout-padding">
					<q-field>
						<q-input v-model="filters" float-label="Фильтр по дате"/>
					</q-field>

					<div class="FilterDate__form">
						<div class="FilterDate__header">
							<div class="FilterDate__tabs">
								<q-btn-toggle v-model="currentTab" :options="tabs" />
							</div>

							<div class="FilterDate__controls">
								<q-btn :color="or ? 'primary' : 'secondary'" @click="or = !or">Или</q-btn>
								<q-btn color="secondary" flat @click="filters = ''">Очистить</q-btn>
							</div>
						</div>

						<div class="FilterDate__content">
							<div class="FilterDateTab">
								<q-field class="FilterDateTab__cd">
									<q-datetime-picker
										v-model="add.datetime"
										float-label="Дата и время"
										:type="type"
										@input="dateChange"/>
								</q-field>
							</div>

							<div class="FilterDate__tree">
								<q-tree :nodes="fastAdd" node-key="label">
									<template
										v-for="slot, index in slots"
										:slot="'header-' + slot.name"
										slot-scope="props">
										<q-btn
											size="10px"
											outline
											@click="fnFactory(slot.name)($event)">
											{{ slot.label }}
										</q-btn>
									</template>
								</q-tree>
							</div>
						</div>
					</div>
				</div>
			</q-modal-layout>
		</q-modal>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import moment from 'moment'


const findRanges = (arr, format) => {
	let to = arr.filter(el => el.substr(0, 2) === '..')
			.map(el => moment(el.substr(2, el.length))),

		from = arr.filter(el => el.substr(-2, 2) === '..')
			.map(el =>  moment(el.substr(0, el.length - 2))),

		another = arr.filter(el =>
			el.substr(-2, 2) !== '..' &&
			el.substr(0, 2) !== '..'
		),

		newArr = [...another]


	from.map(fromDate => {
		let index = to.reduce((prev, toDate, index) => {
			if (!fromDate.isBefore(toDate))
				return prev

			if (prev === false)
				return index

			if (toDate.diff(fromDate) < to[prev].diff(fromDate))
				return index

			return prev
		}, false)

		if (index === false) {
			newArr.push('..' + fromDate.format(format))
		} else {
			let toDate = to.splice(index, 1)[0]
			newArr.push(fromDate.format(format) + '..' + toDate.format(format))
		}
	})

	to.map(el => newArr.push(el.format(format) + '..'))

	return newArr
}

const findDMY = val => val.match(/\d{1,2}(\.|-)?\d{1,2}(\.|-)?\d{2,4}/g)
const findDM = val => val.match(/\d{1,2}(\.|-)?\d{1,2}/g)
const findD = val => val.match(/\d{1,2}/g)

const formatDate = (format, value) => {
	if (findDMY(value))
		return moment(value).format(format)

	if (findDM(value), 'DD-MM')
		return moment(value).format(format)

	if (findD(value), 'DD')
		return moment(value).format(format)

}

export default {
	props: {
		value: String,
		floatLabel: String,
		type: {
			type: String,
			default: a => 'date'
		}
	},
	data() {
		let fastAdd = [
			{
				label: 'Неделя',
				children: [
					{ header: 'week-next' },
					{ header: 'week-current' },
					{ header: 'week-prev' },
				]
			},
			{
				label: 'Месяц',
				children: [
					{ header: 'month-next' },
					{ header: 'month-current' },
					{ header: 'month-prev' },
				]
			},
			{
				label: 'Квартал',
				children: [
					{ header: 'quarter-next', label: 'Следующий' },
					{ header: 'quarter-current', label: 'Текущий' },
					{ header: 'quarter-prev', label: 'Прошедший' },
					{ header: 'quarter-1', label: 'Квартал 1' },
					{ header: 'quarter-2', label: 'Квартал 2' },
					{ header: 'quarter-3', label: 'Квартал 3' },
					{ header: 'quarter-4', label: 'Квартал 4' },
				]
			},
			{
				label: 'Год',
				children: [
					{ header: 'year-next', label: 'Следующий' },
					{ header: 'year-current', label: 'Текущий' },
					{ header: 'year-prev', label: 'Прошедший' },
				]
			},
		]

		if (this.type == 'datetime')
			fastAdd.unshift({
				label: 'День',
				children: [
					{ header: 'day-next' },
					{ header: 'day-current' },
					{ header: 'day-prev' },
				]
			})

		return {
			modal: false,
			currentTab: '=',
			add: {
				datetime: ''
			},
			or: false,
			tabs: [
				{ value: '=', label: 'Равно', icon: 'fas fa-equals', format: date => date },
				//{ value: '!=', label: 'Не равно', icon: 'fas fa-not-equal', format: date => `!${date}` },
				{ value: '>', label: 'Больше', icon: 'fas fa-greater-than', format: date => `${date}..` },
				{ value: '<', label: 'Меньше', icon: 'fas fa-less-than', format: date => `..${date}` },
			],
			fastAdd,
			slots: [
				{ name: 'day-next', label: 'Завтра' },
				{ name: 'day-current', label: 'Сегодня' },
				{ name: 'day-prev', label: 'Вчера' },

				{ name: 'week-next', label: 'Следующая' },
				{ name: 'week-current', label: 'Текущая' },
				{ name: 'week-prev', label: 'Прошедшая' },

				{ name: 'month-next', label: 'Следующий' },
				{ name: 'month-current', label: 'Текущий' },
				{ name: 'month-prev', label: 'Прошедший' },

				{ name: 'quarter-next', label: 'Следующий' },
				{ name: 'quarter-current', label: 'Текущий' },
				{ name: 'quarter-prev', label: 'Прошедший' },
				{ name: 'quarter-1', label: 'Квартал 1' },
				{ name: 'quarter-2', label: 'Квартал 2' },
				{ name: 'quarter-3', label: 'Квартал 3' },
				{ name: 'quarter-4', label: 'Квартал 4' },

				{ name: 'year-next', label: 'Следующий' },
				{ name: 'year-current', label: 'Текущий' },
				{ name: 'year-prev', label: 'Прошедший' },
			]
		}
	},
	components: {

	},
	watch: {

	},
	computed: {
		filters: {
			get () {
				return this.value
			},
			set (n) {
				this.$emit('input', n)
			}
		},
		format () {
			return this.type == 'date' ?
				'DD.MM.YYYY'
			:	'DD.MM.YYYY HH:mm:ss'
		}
	},
	methods: {
		dateChange (e) {
			this.setDate(
				this.tabs.find(el => el.value == this.currentTab)
					.format( this.$moment(e).format(this.format) )
			)
		},
		setDate (date) {
			this.or ?
				this.addNew(date)
			:	this.updateLast(date)
		},
		updateLast (date) {
			let filters = this.filters
				.split(', ')
				.map(el => el.trim())
				.filter(el => el)

			filters[filters.length > 0 ? filters.length - 1 : 0] = date

			this.filters = filters.join(', ')
		},
		addNew (date) {
			let filters = this.filters
				.split(', ')
				.map(el => el.trim())
				.filter(el => el)

			filters.push(date)

			this.filters = filters.join(', ')
		},
		fnFactory (name) {
			let [dateType, timeType] = name.split('-')
			return e => {
				let from = this.$moment()

				if (timeType == 'next')
					from.add(1, dateType)

				if (timeType == 'prev')
					from.subtract(1, dateType)

				if (+timeType)
					from.quarter(+timeType)

				from.startOf(dateType)
				let to = from.clone().endOf(dateType)

				this.setDate(from.format(this.format) + '..' + to.format(this.format))
			}
		}
	},
}
</script>


<style lang="stylus">
.FilterDate
	&__main
		display grid
		grid-gap 10px

	&__content
		display grid
		grid-gap 10px
		grid-auto-flow column

	.FilterDateTab
	&__tabs
		justify-self center

	&__controls
		display grid
		grid-gap 10px
		grid-auto-flow column
		justify-content center

	&__form
		display grid
		grid-gap 10px

	&__tree
		min-width 200px

	&__header
		display grid
		grid-auto-flow column
		grid-gap 10px


@media screen and (max-width: 600px)
	.FilterDate
		&__content
			grid-auto-flow row

		&__header
			grid-auto-flow row

.FilterDateTab
	display grid
	grid-gap 10px
	justify-items start

	&__cd
		justify-self center
</style>
