import core from '@/api/core'
import path from 'path'

export default {
	getUrl (id) {
		return path.resolve(core.apiPath, 'img', id)
	},
	async proxyGetUrl (url) {
		return await core.invoke({
			method: 'get',
			type: 'file/proxy-get-url',
			params: {
				url
			}
		})
	}
}
