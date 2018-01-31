import api from '@/api'
import axios from 'axios'

const random = (a, b) => Math.random() - 0.5

const state = {
	console: [],
	count: {
		models: 0,
		types: 0,
		dekor: 0,
		cloth: 0,
		t: 0,
		f: 0
	},
	countTested: {
		models: 0,
		types: 0,
		dekor: 0,
		cloth: 0,
	}
}

const actions = {
	async test_price ({ commit, dispatch, rootState }) {
		const getTypes = async model => {
			console.log('модель: ', model);
			let { data } = await api.furnitures.getNewTypes(model.ITEMID)
			return data
		}

		const getDekors = async (model, type) => {
			let { data } = await api.furnitures.getNewDekor({
				model_id: model.ITEMID,
				type_id: type,
				palermo: false
			})
			return data
		}

		const getCloth = async (model, index, query, stock_id = null) => {
			let { data } = await api.furnitures.getNewCloth({
				query,
				id: model.ITEMID,
				index: index - 1, // 1 2 3 => 0 1 2
				stock_id
			})

			return data
		}

		const sl = (cloth, model, type, index, pTip = null) => {

			return {
				tkod: cloth.ITEMID,
				mName: model.ITEMID,
				mPost: type.CONFIGID,
				pTip,
				maxKat: index
			}
		}

		const nsl = async (cloth, model, type, index) => {
			return await api.furnitures.getNewPrice({
				model_id: model.ITEMID,
				type_id: type.CONFIGID,
				index,
				cloth: cloth.ITEMID,
				palermo: !!+model.CRFREETRIM
			})
		}

		const prepareTestQuery = async (cloth, model, type, index, pTip) => {
			let p1 = sl(cloth, model, type, index, pTip),
				p2 = nsl(cloth, model, type, index, pTip),
				q1 = `$.post("http://sales-test.ladyagroup.ru/sl/projectSRC/phpData/Order/getKatAndPrice_all.php", ${JSON.stringify(p1)}) `,
				q2 = ``

			return await axios.post("http://sales-test.ladyagroup.ru/sl/projectSRC/phpData/Order/getKatAndPrice_all.php", p1)

			console.log(p1)

			//console.log(p1, p2)

			/*
			for (var prop in p1)
				if (p1.hasOwnProperty(prop))
					q1 += `${prop}=${p1[prop]}&`
					*/
			for (var prop in p2)
				if (p2.hasOwnProperty(prop))
					q2 += `${prop}=${p2[prop]}&`

			commit('test_consolePush', q1)
			//commit('test_consolePush', q2)

		}

		let { data: models } = await api.furnitures.getNewModels()
		commit('test_inc', { type: 'models', amount: models.length })

		//models.sort(random)
		models = models.splice(0, 150)
		commit('test_incT', { type: 'models', amount: models.length })

		models.forEach(async model => {
			let { types, stock } = await getTypes(model)
			//console.log('types', types);

			if (stock)
				console.log(model)


			commit('test_inc', { type: 'types', amount: types.length })
			if (!types.length)
				types.push({ CONFIGID: null })

			types = types.splice(0, 5)
			commit('test_incT', { type: 'types', amount: types.length })

			types.forEach(async type => {
				let { dekor: dekors } = await getDekors(model, type)
				commit('test_inc', { type: 'dekor', amount: dekors.length })
				//console.log('dekors', dekors);
				if (!dekors.length)
					dekors.push('')

				dekors = dekors.splice(0, 5)
				commit('test_incT', { type: 'dekor', amount: dekors.length })
				dekors.forEach(async dekor => {
					for (var index = 1; index < 3 + 1; index++) {
						let cloths = await getCloth(model, index, "red")
						commit('test_inc', { type: 'cloth', amount: cloths.length })

						//console.log('cloths', cloths);
						cloths = cloths.splice(0, 5)
						commit('test_incT', { type: 'cloth', amount: cloths.length })
						cloths.forEach(async cloth => {
							let res = await nsl(cloth, model, type, index)
							commit('test_inc', { type: res ? 't' : 'f', amount: 1 })
						})
					}
				})
			})
		})



	},
}

const mutations = {
	test_consolePush: (state, payload) => {
		state.console.push(payload)
		console.log(payload)
	},
	test_inc: (state, payload) => state.count[payload.type] += payload.amount,
	test_incT: (state, payload) => state.countTested[payload.type] += payload.amount,
}

const getters = {
	test_console: state => state.console,
	test_count: state => state.count,
	test_countT: state => state.countTested
}

export default {
	state,
	actions,
	mutations,
	getters
}
