import BaseModel from '@/lib/BaseModel'
import { Manager } from '@/lib'
import api from '@/api'

export default class NewMessage extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			manager: Manager
		}, arg)
	}

	async save () {
		return this.id === undefined ?
			new NewMessage(await api.core.post('new-message', this))
		:	new NewMessage(await api.core.put('new-message', this))
	}
}
