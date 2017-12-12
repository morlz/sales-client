import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	methods: {
		...mapMutations([
			'setCurrentEditedContact',
			'updateEditClientContactFormVisible',
			'setCurrentEditedTask',
			'updateEditTaskFormVisible'
		]),
		routerGoId(id) {
			id = id.id || id
			let path = `${router.currentRoute.fullPath}/${id}`
			router.push({ path })
		},
		routerGoIdPath(path) {
			return (id) => {
				id = id.id || id
				let newPath = `${path}/${id}`
				router.push({ path: newPath })
			}
		},
		goToPreorder (id) {
			id = id.preorder_id || id

			router.push({ path: `/preorder/records/${id}` })
		}
	},
	computed: {
		afterTableContactButtons () {
			return [
				{
					class: {
						'el-icon-edit' : true
					},
					click: (e, { row }) => {
						e.stopPropagation()
						this.setCurrentEditedContact(row)
						this.updateEditClientContactFormVisible(true)
					}
				}
			]
		},
		afterTableTasksButtons () {
			return [
				{
					class: {
						'el-icon-edit' : true
					},
					click: (e, { row }) => {
						e.stopPropagation()
						this.setCurrentEditedTask(row)
						this.updateEditTaskFormVisible(true)
					}
				},
				{
					name: "Завершить",
					click: (e, { row }) => {
						e.stopPropagation()
						router.push({ path: `/preorder/tasks/${row.id}` })
					}
				}
			]
		}
	}
}
