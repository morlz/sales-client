import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	watch: {
		refInfinite: (n) => {
			console.log("w");
			n.$emit('$InfiniteLoading:reset')
		}
	},
	methods: {
		...mapMutations([
			'setCurrentEditedContact',
			'updateEditClientContactFormVisible',
			'setCurrentEditedTask',
			'updateEditTaskFormVisible'
		]),
		routerGoId(e, id) {
			id = id.id || id
			let path = `${router.currentRoute.fullPath}/${id}`
			router.push({ path })
		},
		routerGoIdPath(path) {
			return (e, id) => {
				id = id.id || id
				let newPath = `${path}/${id}`
				router.push({ path: newPath })
			}
		},
		goToPreorder (e, id) {
			id = id.preorder_id || id

			router.push({ path: `/preorder/records/${id}` })
		}
	},
	computed: {
		refInfinite () {
			return this.$refs.infiniteLoading
		},
		isOne() {
			return this.$route.params.id !== undefined
		},
		oneId() {
			return this.$route.params.id
		},
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
