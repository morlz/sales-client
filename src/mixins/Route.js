export default {
	computed: {
		isOne() {
			return this.$route.params.id !== undefined
		},
		oneId() {
			return this.$route.params.id
		},
	},
	methods: {
		routerGoId(e, id, a, to = this.$route.fullPath) {
			id = id.id || id.ID || id.UN || id.ID_OTG || id
			let path = `${to}/${id}`
			this.$router.push({ path })
		},
		routerGoIdPath (path) {
			return (e, id) => this.routerGoId(e, id, null, path)
		}
	}
}
