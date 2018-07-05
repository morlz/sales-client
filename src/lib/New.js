import BaseModel from '@/lib/BaseModel'
import { NewMessage, Chat, Manager } from '@/lib'
import api from '@/api'

export default class New extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			messages: [NewMessage],
			manager: Manager
		}, {
			description: '',
			title: '',
			archive: 0,
			...arg
		})
	}

	static async getAll () {
		let res = await api.core.get('news')
		if (Array.isArray(res))
			return res.map(el => new New(el))

		return res
	}

	static async getOne (id) {
		let res = await api.core.get('new', { id })
		if (res.id)
			return new New(res)

		return res
	}

	async save () {
		return this.id === undefined ?
			new New(await api.core.post('new', this))
		:	new New(await api.core.put('new', this))
	}

	async archivate () {
		let res = await api.core.get('new/archive', { id: this.id })
		if (res.id)
			return new New(res)

		return res
	}
}
