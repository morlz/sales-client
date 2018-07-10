import BaseModel from '@/lib/BaseModel'
import { NewMessage, Chat, Manager, View } from '@/lib'
import api from '@/api'

export default class New extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			messages: [NewMessage],
			manager: Manager,
			view: View
		}, {
			description: '',
			title: '',
			archive: 0,
			setup: [],
			...arg
		})
	}

	static async getAll () {
		return this.wrapArray(await api.core.get('news'))
	}

	static async getOne (id) {
		return this.wrap(await api.core.get('new', { id }))
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

	async remove () {
		let res = await api.core.delete('new', { id: this.id })
		if (res.id)
			return new New(res)

		return res
	}

	set newsSetup (val) {
		this.setup = val.map(el => +el.group_id)
	}

	async readed () {
		return await api.core.put('view', { id: this.id, type: 'new' })
	}
}
