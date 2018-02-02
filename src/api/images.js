import core from '@/api/core'
import path from 'path'

export default {
	getUrl (id) {
		return path.resolve(core.apiPath, 'img', id)
	}
}
