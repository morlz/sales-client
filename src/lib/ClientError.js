import BaseModel from '@/lib/BaseModel'
import { Manager, Token } from '@/lib'
import moment from 'moment'
import api from '@/api'

export default class ClientError extends BaseModel {
	msg = ''
	url = ''
	line = ''

	constructor (arg) {
		super()
		this.define({
			manager: Manager,
			token: Token
		}, {
			created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
			...arg
		})
	}

	async save () {
		return this.id === undefined ?
			new ClientError(await api.core.post('client-error', this))
		:	new ClientError(await api.core.put('client-error', this))
	}

}
