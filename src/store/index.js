import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

import nav from '@/store/main/nav'
import files from '@/store/main/files'
import auth from '@/store/main/auth'
import notify from '@/store/main/notify'

import clients from '@/store/clients'
import invoices from '@/store/invoices'
import shipments from '@/store/shipments'
import records from '@/store/records'
import tasks from '@/store/tasks'
import managers from '@/store/managers'
import salons from '@/store/salons'


export default new Vuex.Store({
	modules: {
		nav,
		clients,
		invoices,
		records,
		tasks,
		managers,
		salons,
		files,
		auth,
		notify,
		shipments
	}
})
