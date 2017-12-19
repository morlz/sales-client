import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

import nav from '@/store/main/nav'
import files from '@/store/main/files'
import auth from '@/store/main/auth'
import clients from '@/store/preOrder/clients'
import records from '@/store/preOrder/records'
import tasks from '@/store/preOrder/tasks'
import managers from '@/store/preOrder/managers'
import salons from '@/store/preOrder/salons'

export default new Vuex.Store({
	modules: {
		nav,
		clients,
		records,
		tasks,
		managers,
		salons,
		files,
		auth
	}
})
