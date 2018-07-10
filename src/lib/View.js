import BaseModel from '@/lib/BaseModel'
import { Manager } from '@/lib'
import moment from 'moment'
import api from '@/api'

export default class View extends BaseModel {
	constructor (arg) {
		super()
		this.define({

		}, arg)
	}
}
