import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

export default {
	methods: {
		...mapMutations([
			'client_edit_contactSet',
			'client_visible_editContactFormSet',
			'task_edit_currentSet',
			'task_edit_visibleSet'
		]),
		routerGoId(e, id) {
			id = id.id || id.ID || id.UN || id.ID_OTG || id
			let path = `${router.currentRoute.fullPath}/${id}`
			router.push({
				path
			})
		},
		routerGoIdPath(path) {
			return (e, id) => {
				id = id.id || id
				router.push({
					path: `${path}/${id}`
				})
			}
		},
		goToPreorder(e, id) {
			id = id.preorder_id || id

			router.push({
				path: `/preorder/preorders/${id}`
			})
		},
		task_buttonCondition(row) {
			return !row.end_date
		}
	},
	computed: {
		afterTableContactButtons() {
			let rez = []

			if (this.auth_can(3, 'ContactFace'))
				rez.push({
					class: {
						'el-icon-edit': true
					},
					click: (e, row) => {
						this.client_edit_contactSet(row)
						this.client_visible_editContactFormSet(true)
					}
				})

			return rez
		},
		afterTableTasksButtons() {
			let rez = []

			if (this.auth_can(3, 'Task'))
				rez.push({
					class: {
						'el-icon-edit': true
					},
					click: (e, row) => {
						this.task_edit_currentSet(row)
						this.task_edit_visibleSet(true)
					}
				})

			return rez
		}
	}
}


import AuthMixin from './Auth'
import RouteMixin from './Route'
import CartMixin from './Cart'
import SingleItemPageMixin from './SingleItemPage'

export {
	AuthMixin,
	RouteMixin,
	CartMixin,
	SingleItemPageMixin
}
