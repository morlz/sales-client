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
			id = id.id || id.ID || id.UN || id
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
		auth_can(minlvl, action) {
			return !!this.auth_permisiions.find(perm => perm.name == action && perm.access_level >= minlvl)
		},
		task_buttonCondition(row) {
			return !row.end_date
		}
	},
	computed: {
		...mapGetters([
			'auth_permisiions',
			'route'
		]),
		refInfinite() {
			return this.$refs.infiniteLoading
		},
		isOne() {
			return this.$route.params.id !== undefined
		},
		oneId() {
			return this.$route.params.id
		},
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
