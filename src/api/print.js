import core from '@/api/core'

export default {
	async getTemplate ({ template: name, invoice }) {
		return await core.invoke({
			method: "get",
			type: "template",
			params: {
				name,
				invoice
			}
		})
	},
}
