export default {
	methods: {
		getContentByPath (path, from = this) {
			let splited = path.split('.')
			if (!splited.length)
				return from

			return splited.reduce((prev, el) => prev[el] !== undefined ? prev[el] : '', from)
		}
	}
}
