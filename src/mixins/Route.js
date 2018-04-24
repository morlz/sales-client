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
		routerGoId(e, id) {
			id = id.id || id.ID || id.UN || id.ID_OTG || id
			let path = `${this.$route.fullPath}/${id}`
			this.$router.push({ path })
		},
	}
}
