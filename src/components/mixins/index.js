export default {
	methods: {
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
		}
	}
}
