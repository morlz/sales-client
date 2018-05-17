import api from '@/api'
import Infinite from '@/lib/Infinite'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import merge from 'lodash.merge'
import transfer from './transfer'
import selectCloth from './selectCloth'
import { Furniture } from '@/lib'

let infinite = new TwoSideInfinite({ method: api.furnitures.getLimited, namespace: 'furniture', returns: Furniture })

const state = merge(infinite.getState(), {
	cached: {
		current: {},
		models: []
	},
	loading: {
		one: true,
		models: true,
		bottom: false
	},
	clothSelectForm: {
		cached: [],
		query: "",
		loading: {
			list: false,
			bottom: false
		},
		offset: -1
	},
	new: {
		selected: {
			edit: false,
			model: "",
			type: {},
			dekor: "",
			cloth: {
				0: {},
				1: {},
				2: {}
			},
			sign: "",
			count: 1,
			price: "0",
		},
		cached: {
			models: [],
			stock: {},
			types: [],
			dekor: [],
			cat: "0",
			clothCount: 0,
			opt: "0",
			price: "0",
			cloth: {
				0: {},
				1: {},
				2: {}
			},
			discount: {},
			images: []
		},
		loading: {
			models: false,
			types: false,
			dekor: false,
			cat: false,
			price: false,
			clothInfo: false
		}
	}
})


const actions = merge(infinite.getActions(true), {
	async furniture_init ({ commit, dispatch, getters, state }, payload) {
		if (payload)
			return dispatch('furniture_getOne', payload)

		dispatch('furniture_defaultSalonSet')
		dispatch('furniture_initInfinite')
		dispatch('furniture_getModels', { type: getters.furniture_type, filters: { 'td.salon.ID_SALONA' : state.filters['td.salon.ID_SALONA'] || state.filters['td.cart.salon.ID_SALONA'] } })
		dispatch('salon_getList')
		await state.infinite.start(api.scrollPosition.current.offset) //api.scrollPosition.current.offset
	},
	furniture_defaultSalonSet ({ commit, state, getters }) {
		if (state.infinite) return

		commit('furniture_filtersSet', {
			...state.filters,
			type: undefined,
			'td.salon.ID_SALONA' : getters.auth_currentSalon.ID_SALONA + ""
		})
	},
	async furniture_sortChange({ commit, dispatch, state }, payload){
		commit('furniture_sortSet', payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async furniture_filtersChange({ commit, dispatch, state }, payload){
		if (payload.type == 'selled') {
			payload['td.cart.salon.ID_SALONA'] = payload['td.salon.ID_SALONA']
			delete payload['td.salon.ID_SALONA']
		}

		commit('furniture_filtersSet', payload)
		state.infinite.filters = { ...payload, type: undefined }
		state.infinite.additional = { type: payload.type }
		await state.infinite.start()
	},
	async furniture_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async furniture_getOne({ commit, dispatch }, payload){
		commit('furniture_loadingOneSet', true)
		let res = await api.furnitures.getOne(payload)
		commit('furniture_loadingOneSet', false)
		if (!res.data || res.data.error) return
		commit('furniture_currentSet', res.data)
	},
	async furniture_getModels({ commit, dispatch }, payload){
		if (payload.type == 'selled') {
			payload.filters['td.cart.salon.ID_SALONA'] = payload.filters['td.salon.ID_SALONA']
			delete payload.filters['td.salon.ID_SALONA']
		}

		commit('furniture_loadingModelsSet', true)
		let res = await api.furnitures.getModels(payload)
		if (res.data.error) return
		commit('furniture_cachedModelsSet', res.data)
		commit('furniture_loadingModelsSet', false)
	},
	async furniture_addToCart({ commit, dispatch }, payload) {
		if ( !await dispatch('cart_addItem', { type: 'exist', un: payload.UN }) ) return
		commit('furniture_removeOneFromCache', payload)
	},

	/*
	 *
	 *	 	секция новгого заказа
	 *		satate.new
	 *		индекс ткани 0-2
	 *		freeTrim == палермо
	 *
	 */

	//инициализация
	async furniture_new_init ({ commit, dispatch, state }, payload) {
		if (!state.new.cached.models.length)
			dispatch('furniture_new_getModels')

		commit('furniture_new_editSet', payload ? payload : false)
	},
	//получение всех моделей
	async furniture_new_getModels ({ commit, dispatch }) {
		commit('furniture_new_loadingModelsSet', true)
		let res = await api.furnitures.getNewModels()
		commit('furniture_new_loadingModelsSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedModelsSet', res.data)
	},
	//получение всех типов и акции выбраной модели
	async furniture_new_getTypes ({ commit, dispatch, state, getters }) {
		commit('furniture_new_loadingTypesSet', true)
		let res = await api.furnitures.getNewTypes(state.new.selected.model, getters.furniture_new_freeTrim)
		commit('furniture_new_loadingTypesSet', false)
		if (res && res.data && res.data.error) return
		let { stock, types, images } = res.data
		commit('furniture_new_cachedStockSet', stock)
		commit('furniture_new_cachedTypesSet', types)
		commit('furniture_new_cachedSet', { type: "images", data: images })


		//пропуск шага при отсутствии типов
		if (!types.length)
			dispatch('furniture_new_typeSelect', '')

		//если 1 тип выбираем его автоматически
		if (types.length == 1 && !getters.furniture_new_freeTrim)
			dispatch('furniture_new_typeSelect', types[0].CONFIGID)

	},
	//получение декора и количества тканей выбраной модели
	async furniture_new_getDekor ({ commit, dispatch, state, getters }) {
		commit('furniture_new_loadingDekorSet', true)

		//разделение на палермо
		let type_id = state.new.selected.type

		let res = await api.furnitures.getNewDekor({ model_id: state.new.selected.model, type_id, palermo: getters.furniture_new_freeTrim })
		commit('furniture_new_loadingDekorSet', false)
		if (res && res.data && res.data.error) return
		let { dekor, clothCount } = res.data
		commit('furniture_new_cachedDekorSet', dekor)
		commit('furniture_new_cachedClothCountSet', clothCount)

		if (!dekor || !dekor.length)
			dispatch('furniture_new_dekorSelect', '')

		if (dekor && dekor.length == 1)
		 	dispatch('furniture_new_dekorSelect', dekor[0].CONFIGID)
	},
	//получение категории тканей
	async furniture_new_getCat ({ commit, dispatch, state }) {
		commit('furniture_new_loadingCatSet', true)
		let res = await api.furnitures.getNewCat(state.new.selected.model)
		commit('furniture_new_loadingCatSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedCatSet', res.data)
	},
	//получение ткани по индексу
	//index == номер ткани
	async furniture_new_getCloth ({ commit, dispatch, state }, index){
		//поиск токо от 4 символов
		if (state.new.clothSearch[index].length < 4) return
		commit('furniture_new_loadingClothSet', { index, data: true })
		let res = await api.furnitures.getNewCloth({
			query: state.new.clothSearch[index],
			id: state.new.selected.model,
			index,
			stock_id: state.new.cached.stock ? state.new.cached.stock : null
		})
		commit('furniture_new_loadingClothSet', { index, data: false })
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedClothSet', { index, data: res.data })
	},
	//получение информации о ткане
	//index == номер ткани
	async furniture_new_getClothInfo ({ commit, dispatch, state, rootState, getters }, index) {
		commit('furniture_new_loadingSet', { type: 'clothInfo', data: true })
		let cloth = state.new.selected.cloth[index]
		let res = await api.furnitures.getNewClothInfo(cloth)
		commit('furniture_new_loadingSet', { type: 'clothInfo', data: false })
		if (res.data && res.data.error) return
		let { data } = res
		commit('furniture_new_cachedClothUpdate', { index, data })
	},
	//получение получение текущей цены для ткани
	//index == номер ткани
	async furniture_new_getPrice ({ commit, dispatch, state, getters }, index) {
		commit('furniture_new_loadingPriceSet', true)
		let data = await api.furnitures.getNewPrice({
			model_id: state.new.selected.model,
			type_id: state.new.selected.type,
			index,
			cloth: state.new.selected.cloth[index].ITEMID,
			palermo: getters.furniture_new_freeTrim
		})
		commit('furniture_new_loadingPriceSet', false)
		if (data && data.error) return

		commit('furniture_new_cachedClothSet', { index, data })
		await dispatch('furniture_new_getClothInfo', index)
		await dispatch('furniture_new_getDiscountPrice', index)
	},
	//получение дисконд цены для ткани
	//index == номер ткани
	async furniture_new_getDiscountPrice({ commit, dispatch, state, getters }, index){
		let model_id = state.new.selected.model,
			cat = getters.furniture_new_modelCunning ?
				getters.furniture_new_cunningCatSofa
			:	state.new.cached.cloth[getters.furniture_new_normalMaxIndex].code,

			price = getters.furniture_new_modelCunning ?
				getters.furniture_new_cunningPrice
			:	state.new.cached.cloth[getters.furniture_new_normalMaxIndex].price,

			priceOpt = getters.furniture_new_modelCunning ?
				getters.furniture_new_cunningPriceOpt
			:	state.new.cached.cloth[getters.furniture_new_normalMaxIndex].priceOpt

		//устанавливаем цену
		commit('furniture_new_priceSet', { r: price, opt: priceOpt })

		//не используется
		return

		//если подушка и диван хитрый то скипаем
		if (getters.furniture_new_modelCunning && !index) return
		commit('furniture_new_loadingSet', { type: "price", data: true })
		let res = await api.furnitures.getDiscountPrice({ model_id, cat, price })
		commit('furniture_new_loadingSet', { type: "price", data: false })
		if (res.data && res.data.error) return

		console.log(res, cat, price, priceOpt)
		//commit('furniture_new_priceSet', { r: state.new.cached.cloth[index].price, opt: state.new.cached.cloth[index].priceOpt })
	},

	//user action handlers

	//on model select
	async furniture_new_modelSelect ({ commit, dispatch, getters }, payload) {
		commit('furniture_new_modelSelect', payload)
		// empty form
		commit('furniture_new_dekorSelect', '')
		commit('furniture_new_typeSelect', '')
		commit('furniture_new_priceSet', { r: '', opt: '' })
		// actions
		await dispatch('furniture_new_getTypes')
	},
	//on type select
	async furniture_new_typeSelect ({ commit, dispatch, getters }, payload) {
		commit('furniture_new_typeSelect', payload)
		await dispatch('furniture_new_getDekor')
		if (getters.furniture_new_freeTrim) return
		// empty form
		commit('furniture_new_dekorSelect', '')
	},
	//on dekor select
	async furniture_new_dekorSelect ({ commit, dispatch }, payload) {
		commit('furniture_new_dekorSelect', payload)
		commit('furniture_new_clothSelect', { index: 0, data: '' })
		commit('furniture_new_clothSelect', { index: 1, data: '' })
		commit('furniture_new_clothSelect', { index: 2, data: '' })
	},
	//on cloth select
	async furniture_new_clothSelect ({ commit, dispatch }, payload) {
		commit('furniture_new_clothSelect', payload)
		await dispatch('furniture_new_getPrice', payload.index)
	},

	async furniture_new_addToCart({ commit, dispatch }) {
		await dispatch('cart_addItem', await dispatch('furniture_new_collectData'))
	},
	async furniture_new_collectData ({ commit, dispatch, state, getters }) {
		//prepared data
		//'Vid_stegki' => @$this->params['stejka'],
		let model = state.new.cached.models.find(model => state.new.selected.model == model.ITEMID),
			type = state.new.cached.types.find(type => state.new.selected.type == type.CONFIGID) || state.new.selected.type
				//normal type or palermo

		return {
			type: 'new',
			model: {
				id: model.ITEMID,
				name: model.ITEMNAME
			},
			TIP: {
				id: type.CONFIGID || type,
				name: type.NAME || type
			},
			cloth: [
				state.new.selected.cloth[0].id || null,
				state.new.selected.cloth[1].id || null,
				state.new.selected.cloth[2].id || null
			],
			cat: getters.furniture_new_modelCunning ?
					getters.furniture_new_cunningCatSofa
				:	getters.furniture_new_cached.cloth[getters.furniture_new_normalMaxIndex].code,
			dekor: state.new.selected.dekor,
			comment: state.new.selected.sign,
			discount: state.new.cached.discount,
			count: +state.new.selected.count,
			price: {
				r: state.new.cached.price,
				opt: state.new.cached.opt
			}
		}
	},

	/*
	 *
	 *		форма выбора ткани
	 *
	 */

	async furniture_clothSearch ({ commit, dispatch, state }, { query, index, offset }) {
		commit('furniture_clothSelectForm_querySet', query)
		commit('furniture_clothSelectForm_loadingListSet', true)
		let res = await api.furnitures.getNewCloth({
			query,
			id: state.new.selected.model,
			index,
			stock_id: state.new.cached.stock ? state.new.cached.stock : null,
			offset: 0
		})
		commit('furniture_clothSelectForm_loadingListSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_clothSelectForm_cachedSet', res.data)
		commit('furniture_clothSelectForm_offsetSet', 0)
	},
	async furniture_clothSelectForm_infinity ({ commit, dispatch, state }, { payload, index }) {
		if (state.clothSelectForm.offset == -1) return
		commit('furniture_clothSelectForm_loadingBottomSet', true)
		commit('furniture_clothSelectForm_offsetSet', state.clothSelectForm.offset + 30)
		let res = await api.furnitures.getNewCloth({
			query: state.clothSelectForm.query,
			id: state.new.selected.model,
			index,
			stock_id: state.new.cached.stock ? state.new.cached.stock : null,
			offset: state.clothSelectForm.offset
		})
		commit('furniture_clothSelectForm_loadingBottomSet', false)
		payload.loaded()
		if (res && res.data && res.data.error) return
		commit('furniture_clothSelectForm_cachedAppend', res.data)

		if (!res.data || res.data.length < 30)
			payload.complete()
	},
	async furniture_new_setEdit({ commit, dispatch, state }, payload){
		const getCloth = (payload, index) => {
			switch (index) {
				case 0:
					return payload.cloth1 ? payload.cloth1.TKAN : ""
					break;
				case 1:
					return payload.cloth2 ? payload.cloth2.TKAN : ""
					break;
				case 2:
					return payload.cloth3 ? payload.cloth3.TKAN : ""
					break;
			}
		}

		let models = await dispatch('furniture_new_waitModels')

		commit('furniture_new_editSet', payload)

		if (models.length) {
			let model = models.find(el => el.ITEMNAME == payload.model)
			if (!model)
				return dispatch('alert', 'Модель не надена')

			await dispatch('furniture_new_modelSelect', model.ITEMID)
		}

		if (state.new.cached.types.length) {
			let type = state.new.cached.types.find(el => el.NAME == payload.type)
			if (!type)
				return dispatch('alert', 'Тип не найден')
			await dispatch('furniture_new_typeSelect', type.CONFIGID)
		}

		if (state.new.cached.dekor.length) {
			let dekor = state.new.cached.dekor.find(el => el.CONFIGID == payload.dekor)
			if (!dekor)
				return dispatch('alert', 'Декор не найден')
			await dispatch('furniture_new_dekorSelect', dekor.CONFIGID)
		}

		if (+state.new.cached.clothCount) {
			for (var index = 0; index < +state.new.cached.clothCount; index++) {
				let cloth = getCloth(payload, index)
				let data = await dispatch('furniture_new_getClothById', { index, cloth })
				if (!data)
					return dispatch('alert', `Ткань ${index + 1} не найдена`)

				await dispatch('furniture_new_clothSelect', { index, data })
			}
		}

		commit('furniture_new_priceSet', { r: +payload.price, opt: +payload.priceOpt })
		commit('furniture_new_signSet', payload.comment)
	},

	furniture_new_waitModels ({ state }) {
		return new Promise((resolve, reject) => {
			let checkModels = a => {
					if (state.new.cached.models.length) {
						clearInterval(waitModels)
						resolve(state.new.cached.models)
					}
				},
				waitModels = setInterval(checkModels, 100)
		})
	},
	async furniture_new_getClothById ({ commit, dispatch }, { index, cloth }) {
		let res = await api.furnitures.getNewClothById({
			cloth,
			id: state.new.selected.model,
			index,
			stock_id: state.new.cached.stock ? state.new.cached.stock : null
		})

		if (!res.data || res.data.error) return
		return res.data
	},
	async furniture_new_save ({ commit, dispatch }) {
		let data = await dispatch('furniture_new_collectData')
		let res = await api.furnitures.updateZak( merge(data, { id: state.new.selected.edit.id }) )
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		router.push(`/docs/invoices/${state.new.selected.edit.invoice_id}`)
		dispatch('notify', 'Успешно изменено')
	},
	async furniture_updateTdDiscount ({ commit, dispatch }, payload) {
		let res = await api.furnitures.updateTdDiscount(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentTdUpdate', [res.data])
		dispatch('notify', 'Скидка успешно изменена')
	}
})

const mutations = merge(infinite.getMutations(true), {
	furniture_destroy: state => state.cached.models = state.cached.list = [],
	furniture_initInfinite: (state, payload) => state.infinite = payload,
	//furniture_cacheSet: (state, payload) => state.cached.list = payload,
	furniture_completeSet: (state, payload) => state.complete = payload,
	furniture_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	furniture_filtersSet: (state, payload) => state.filters = payload,
	furniture_sortSet: (state, payload) => state.sort = payload,
	furniture_lastOffsetSet: (state, payload) => state.offset.last = payload,
	furniture_removeOneFromCache: (state, payload) => state.infinite.cached = state.infinite.cached.filter(el => el.UN != (payload.UN || payload)),
	furniture_removeManyFromCache: (state, payload) =>
		state.infinite.cached = state.infinite.cached.filter(
			el => !payload.find(
				p => (p.ID || p) == el.td.ID
			)
		),
	furniture_currentSet: (state, payload) => state.cached.current = payload,
	furniture_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	furniture_cachedModelsSet: (state, payload) => state.cached.models = payload,

	furniture_loadingSet: (state, payload) => state.loading.list = payload,
	furniture_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	furniture_loadingOneSet: (state, payload) => state.loading.one = payload,
	furniture_loadingModelsSet: (state, payload) => state.loading.models = payload,

	furniture_new_clothSearch: (state, payload) => state.new.clothSearch[payload.index] = payload.data,
	furniture_clothSelectForm_querySet: (state, payload) => state.clothSelectForm.query = payload,
	furniture_clothSelectForm_cachedSet: (state, payload) => state.clothSelectForm.cached = payload,
	furniture_clothSelectForm_cachedAppend: (state, payload) => state.clothSelectForm.cached = [...state.clothSelectForm.cached, ...payload],
	furniture_clothSelectForm_offsetSet: (state, payload) => state.clothSelectForm.offset = payload,
	furniture_clothSelectForm_loadingListSet: (state, payload) => state.clothSelectForm.loading.list = payload,
	furniture_clothSelectForm_loadingBottomSet: (state, payload) => state.clothSelectForm.loading.bottom = payload,

	furniture_new_cachedSet: (state, payload) => state.new.cached[payload.type] = payload.data,
	furniture_new_cachedModelsSet: (state, payload) => state.new.cached.models = payload,
	furniture_new_cachedStockSet: (state, payload) => state.new.cached.stock = payload.ACTIONNUM || payload,
	furniture_new_cachedTypesSet: (state, payload) => state.new.cached.types = payload,
	furniture_new_cachedDekorSet: (state, payload) => state.new.cached.dekor = payload,
	furniture_new_cachedClothCountSet: (state, payload) => state.new.cached.clothCount = payload,
	furniture_new_cachedClothSet: (state, payload) => state.new.cached.cloth[payload.index] = payload.data,
	furniture_new_cachedClothUpdate: (state, payload) => state.new.cached.cloth[payload.index] = { ...state.new.cached.cloth[payload.index], ...payload.data },

	furniture_new_loadingSet: (state, payload) => state.new.loading[payload.type] = payload.data,
	furniture_new_loadingModelsSet: (state, payload) => state.new.loading.models = payload,
	furniture_new_loadingTypesSet: (state, payload) => state.new.loading.types = payload,
	furniture_new_loadingDekorSet: (state, payload) => state.new.loading.dekor = payload,
	furniture_new_loadingCatSet: (state, payload) => state.new.loading.cat = payload,
	furniture_new_loadingClothSet: (state, payload) => state.new.loading.cloth[payload.index] = payload.data,
	furniture_new_loadingPriceSet: (state, payload) => state.new.loading.price = payload,

	furniture_new_modelSelect: (state, payload) => state.new.selected.model = payload,
	furniture_new_typeSelect: (state, payload) => state.new.selected.type = payload,
	furniture_new_dekorSelect: (state, payload) => state.new.selected.dekor = payload,
	furniture_new_clothSelect: (state, payload) => state.new.selected.cloth[payload.index] = payload.data,
	furniture_new_signSet: (state, payload) => state.new.selected.sign = payload,
	furniture_new_countSet: (state, payload) => state.new.selected.count = payload,
	furniture_new_editSet: (state, payload) => state.new.selected.edit = payload,
	furniture_new_priceSet: (state, { r, opt }) => {
		if (r) {
			state.new.selected.price = r
			state.new.cached.price = r
		}
		if (opt) {
			state.new.selected.opt = opt
			state.new.cached.opt = opt
		}
	},
})

const getters = merge(infinite.getGetters(true), {
	furniture_infinite: state => state.infinite,
	furniture_complete: state => state.complete,
	furniture_filters: (state, getters) => {
		let filters = { ...state.filters }
		if (filters.type == 'selled') {
			filters['td.salon.ID_SALONA'] = filters['td.cart.salon.ID_SALONA']
			delete filters['td.cart.salon.ID_SALONA']
		}

		filters.type = undefined
		return filters
	},
	furniture_type: state => state.filters.type || '',
	furniture_current: ({ cached }) => cached.current,
	furniture_cached: state => state.cached.list,
	furniture_models: ({ cached }) => [
			{ MODEL: "Все модели", value: '', count: cached.models.reduce((prev, el) => prev += (+el.count), 0) },
			...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))
		]
		.sort(api.core.sortFnFactory(model => model.value == '' ? "_": model.MODEL, true)),
	furniture_loading: ({ loading }) => loading.list,
	furniture_loadingBottom: ({ loading }) => loading.bottom,
	furniture_loadingOne: ({ loading }) => loading.one,
	furniture_loadingModels: ({ loading }) => loading.models,
	furniture_new_loading: state => state.new.loading,
	furniture_new_cached: state => state.new.cached,
	furniture_new_selected: state => state.new.selected,
	furniture_new_active: state => {
		let currentStep = 0

		// шаг выбора модели
		if (state.new.selected.model.length)
			currentStep++

		// шаг выбора типа
		if ((state.new.selected.type.length || (!state.new.cached.types.length && !state.new.loading.types)) && currentStep > 0)
			currentStep++

		// шаг выбора декора
		if ((state.new.selected.dekor.length || (!state.new.cached.dekor.length && !state.new.loading.dekor)) && currentStep > 1)
			currentStep++

		// шаг заполнения тканей
		let clothFilledCount = 0
		for (var prop in state.new.selected.cloth)
			if (state.new.selected.cloth.hasOwnProperty(prop) && state.new.selected.cloth[prop])
				clothFilledCount++

		if (clothFilledCount == state.new.cached.clothCount && currentStep > 2)
			currentStep++

		// шаг заполнения доп информации
		if (+state.new.selected.count && +state.new.selected.price && currentStep > 3)
			currentStep++

		// true == скрывать
		// скрывать следующие шаги и отсутствующие данные
		return {
			currentStep,
			model: currentStep < 0,
			gallery: currentStep < 1 || (!state.new.cached.images.length),
			type: currentStep < 1 || (!state.new.cached.types.length && !state.new.loading.types && currentStep > 0),
			dekor: currentStep < 2 || (!state.new.cached.dekor.length && !state.new.loading.dekor && currentStep > 1),
			cloth: [
				currentStep < 3 || +state.new.cached.clothCount < 1,
				currentStep < 3 || +state.new.cached.clothCount < 2,
				currentStep < 3 || +state.new.cached.clothCount < 3,
			],
			sign: currentStep < 4,
			count: currentStep < 4,
			price: currentStep < 4,
			button: currentStep < 5
		}
	},
	furniture_new_freeTrim: state => state.new.selected.model ? !!+state.new.cached.models.find(el => el.ITEMID == state.new.selected.model).CRFREETRIM : false,
	furniture_new_modelCunning: state => {
		for (var index in state.new.cached.cloth)
			if (state.new.cached.cloth.hasOwnProperty(index) && state.new.cached.cloth[index].r && state.new.cached.cloth[0].code > state.new.cached.cloth[index].code)
				return true

		return false
	},
	furniture_new_cunningCatSofa: state => Math.max(state.new.cached.cloth[1].code || 0, state.new.cached.cloth[2].code || 0),
	furniture_new_cunningPrice: state => {
		let maxIndex = (state.new.cached.cloth[1].code || 0) > (state.new.cached.cloth[2].code || 0) ? 1 : 2
		return state.new.cached.cloth[maxIndex].price - state.new.cached.cloth[maxIndex].price2 + state.new.cached.cloth[0].price2
	},
	furniture_new_cunningPriceOpt: state => {
		let maxIndex = (state.new.cached.cloth[1].code || 0) > (state.new.cached.cloth[2].code || 0) ? 1 : 2
		return state.new.cached.cloth[maxIndex].priceOpt - state.new.cached.cloth[maxIndex].priceOpt2 + state.new.cached.cloth[0].priceOpt2
	},

	furniture_new_normalMaxIndex: state => {
		let max = { index: 0, price: 0 }
		for (var index in state.new.cached.cloth)
			if (state.new.cached.cloth.hasOwnProperty(index) && state.new.cached.cloth[index].price > max.price) {
				max.price = state.new.cached.cloth[index].price
				max.index = index
			}
		return max.index
	},
	furniture_new_cachedImages: state => state.new.cached.images.map(imageId => api.images.getUrl(imageId.VALUERECID)),
	furniture_clothSelectForm: state => state.clothSelectForm,
	furniture_clothSelectForm_loading: state => state.clothSelectForm.loading.list,
})

const modules = {
	transfer,
	selectCloth
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
