import api from '@/api'
import moment from 'moment'
import ReportMain from '@/lib/reports/ReportMain'

const colors = [
	"rgba(54, 162, 235, 0.7)",
	"rgba(75, 192, 192, 0.7)",
	"rgba(201, 203, 207, 0.7)",
	"rgba(255, 159, 64, 0.7)",
	"rgba(153, 102, 255, 0.7)",
	"rgba(255, 99, 132, 0.7)",
	"rgba(255, 205, 86, 0.7)"
]

const state = {
	cached: {},
	loading: false
}

const actions = {
	async report_main_init ({ commit, dispatch, getters, state }) {
		if (getters.report_main_loading || state.cached == {}) return
		await dispatch('report_main_getData')
	},
	report_main_destroy ({ commit }) {
		commit('report_main_cachedSet', {})
		commit('report_main_loaingSet', false)
	},
	async report_main_getData ({ commit, dispatch }) {
		commit('report_main_loaingSet', true)
		let res = await ReportMain.get()
		console.log(res);
		commit('report_main_loaingSet', false)

		if (!res || res.error) return

		commit('report_main_cachedSet', res)
	},
}

const mutations = {
	report_main_cachedSet: (state, payload) => state.cached = payload,
	report_main_loaingSet: (state, payload) => state.loading = payload,
}

const getters = {
	report_main_preorders: state => {
		let datasets = [],
			labels = []

		let to = moment(),
			from = to.clone().subtract(1, 'month'),
			current = from.clone(),
			data = {
				created: [],
				ended: []
			}

		while (current.isBefore(to)) {
			if (state.cached.preorders) {
				if (state.cached.preorders.monthCreated) {
					let finded = state.cached.preorders.monthCreated.find(el => el.date == current.format('YYYY-MM-DD'))
					data.created.push(finded ? +finded.c : 0)
				}

				if (state.cached.preorders.monthEnded) {
					let finded = state.cached.preorders.monthEnded.find(el => el.date == current.format('YYYY-MM-DD'))
					data.ended.push(finded ? +finded.c : 0)
				}
			}

			labels.push(current.format('D MMMM'))
			current.add(1, 'day')
		}

		datasets.push({
			data: data.created,
			label: 'Создано'
		})

		datasets.push({
			data: data.ended,
			label: 'Оформлено'
		})

		datasets.forEach(
			(dataset, index) => datasets[index].backgroundColor = colors[(index+3) % colors.length]
		)

		return { datasets, labels }
	},
	report_main_orders: state => {
		let datasets = [],
			labels = []

		let to = moment(),
			from = to.clone().subtract(1, 'month'),
			current = from.clone(),
			data = {
				created: [],
				ended: [],
				paid: []
			}

		while (current.isBefore(to)) {
			if (state.cached.orders) {
				if (state.cached.orders.monthCreated) {
					let finded = state.cached.orders.monthCreated.find(el => el.date == current.format('YYYY-MM-DD'))
					data.created.push(finded ? +finded.c : 0)
				}

				if (state.cached.orders.monthEnded) {
					let finded = state.cached.orders.monthEnded.find(el => el.date == current.format('YYYY-MM-DD'))
					data.ended.push(finded ? +finded.c : 0)
				}

				if (state.cached.orders.monthPaid) {
					let finded = state.cached.orders.monthPaid.find(el => el.date == current.format('YYYY-MM-DD'))
					data.paid.push(finded ? +finded.c : 0)
				}
			}

			labels.push(current.format('D MMMM'))
			current.add(1, 'day')
		}

		datasets.push({
			data: data.created,
			label: 'Создано'
		})

		datasets.push({
			data: data.ended,
			label: 'Оформлено'
		})

		datasets.push({
			data: data.paid,
			label: 'Оплачено'
		})

		datasets.forEach(
			(dataset, index) => datasets[index].backgroundColor = colors[(index+3) % colors.length]
		)

		return { datasets, labels }
	},
	report_main_tasks: state => {
		let datasets = [],
			labels = []

		let to = moment(),
			from = to.clone().subtract(1, 'month'),
			current = from.clone(),
			data = {
				created: [],
				ended: [],
				orders: []
			}

		while (current.isBefore(to)) {
			if (state.cached.tasks) {
				if (state.cached.tasks.monthCreated) {
					let finded = state.cached.tasks.monthCreated.find(el => el.date == current.format('YYYY-MM-DD'))
					data.created.push(finded ? +finded.c : 0)
				}

				if (state.cached.tasks.monthEnded) {
					let finded = state.cached.tasks.monthEnded.find(el => el.date == current.format('YYYY-MM-DD'))
					data.ended.push(finded ? +finded.c : 0)
				}

				if (state.cached.tasks.monthOrder) {
					let finded = state.cached.tasks.monthOrder.find(el => el.date == current.format('YYYY-MM-DD'))
					data.orders.push(finded ? +finded.c : 0)
				}
			}

			labels.push(current.format('D MMMM'))
			current.add(1, 'day')
		}

		datasets.push({
			data: data.created,
			label: 'Создано'
		})

		datasets.push({
			data: data.ended,
			label: 'Завершено'
		})

		datasets.push({
			data: data.orders,
			label: 'Оформление'
		})

		datasets.forEach(
			(dataset, index) => datasets[index].backgroundColor = colors[(index+3) % colors.length]
		)

		return { datasets, labels }
	},
	report_main_now: state => {
		let datasets = [],
			labels = [
				'Создано',
				'Завершено'
			],
			now = moment().format('YYYY-MM-DD')

		if (state.cached.orders) {
			let fCreated = state.cached.orders.monthCreated.find(el => el.date == now)
			let fEnded = state.cached.orders.monthEnded.find(el => el.date == now)
			datasets.push({
				data: [
					fCreated ? +fCreated.c : 0,
					fEnded ? +fEnded.c : 0,
				],
				label: 'Заказы'
			})
		}

		if (state.cached.preorders) {
			let fCreated = state.cached.preorders.monthCreated.find(el => el.date == now)
			let fEnded = state.cached.preorders.monthEnded.find(el => el.date == now)
			datasets.push({
				data: [
					fCreated ? +fCreated.c : 0,
					fEnded ? +fEnded.c : 0,
				],
				label: 'Предзаказы'
			})
		}

		if (state.cached.tasks) {
			let fCreated = state.cached.tasks.monthCreated.find(el => el.date == now)
			let fEnded = state.cached.tasks.monthEnded.find(el => el.date == now)
			datasets.push({
				data: [
					fCreated ? +fCreated.c : 0,
					fEnded ? +fEnded.c : 0,
				],
				label: 'Задачи'
			})
		}

		datasets.forEach(
			(dataset, index) => datasets[index].backgroundColor = colors[(index+3) % colors.length]
		)

		return { datasets, labels }
	},
	report_main_best: (state, getters, rootState, rootGetters) => {
		let datasets = [],
			labels = [],
			dataset = {
				data: [],
				label: 'Продажи за месяц',
				backgroundColor: []
			}


		if (state.cached.salons && rootGetters.auth_currentSalon)
			state.cached.salons.map(salon => {
				dataset.data.push(salon.invoice.sum)
				dataset.backgroundColor.push(
					colors[3 + +(rootGetters.auth_currentSalon.id == salon.id)]
				)
				labels.push(salon.name + ` ${salon.index + 1}.`)
			})

		datasets.push(dataset)

		/*
		datasets.forEach(
			(dataset, index) => datasets[index].backgroundColor = colors[index % colors.length]
		)
		*/

		return { datasets, labels }
	},
	report_main_loading: state => state.loading,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
