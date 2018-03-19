import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import main from '@/store/main'

import clients from '@/store/clients/index'
import invoice from '@/store/invoice'
import shipments from '@/store/shipments'
import furniture from '@/store/furniture'
import preorders from '@/store/preorders'
import tasks from '@/store/tasks'
import managers from '@/store/managers'
import salons from '@/store/salons'
import storage from '@/store/storage'
import discount from '@/store/discount'
import permissions from '@/store/permissions'
import personal from '@/store/personal'
import cart from '@/store/cart'
import print from '@/store/print'
import i18n from '@/store/i18n'

import tests from '@/store/tests'


export default new Vuex.Store({
	modules: {
		main,
		clients,
		invoice,
		preorders,
		tasks,
		managers,
		salons,
		shipments,
		furniture,
		permissions,
		storage,
		discount,
		personal,
		cart,
		print,
		i18n,

		tests,
	}
})
