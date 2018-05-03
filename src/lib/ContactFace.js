import BaseModel from '@/lib/BaseModel'

export default class ContactFace extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get disableEMAIL () {
		return this._disableEMAIL
	}

	set disableEMAIL (val) {
		this._disableEMAIL = !!+val
	}

	get disableSMS () {
		return this._disableSMS
	}

	set disableSMS (val) {
		this._disableSMS = !!+val
	}
}
