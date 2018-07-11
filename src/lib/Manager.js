import BaseModel from '@/lib/BaseModel'
import { Salon, SalonGroup, SalonGroupSetup, BaseImage } from '@/lib'
import api from '@/api'

export default class Manager extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			salon: Salon,
			groups: [SalonGroup],
			groupsSetup: [SalonGroupSetup],
			avatar: BaseImage,
			id: 'ID_M',
			name: 'IMY',
			lastname: 'FIO',
			patronymic: 'OTCH'
		}, arg)
	}

	get fio () {
		return `${this.FIO} ${this.IMY} ${this.OTCH}`.trim()
	}

	set fio (val) {
		let [lastname, name, patronymic] = val.split(' ')
		this.lastname = lastname || ''
		this.name = name || ''
		this.patronymic = patronymic || ''
		console.log(lastname, name, patronymic, this);
	}

	get name () {
		return this.IMY.trim()
	}

	async save () {
		let fd = new FormData()
		if (this.editImage)
			for (var prop in this.editImage)
				if (this.editImage.hasOwnProperty(prop) && this.editImage[prop]) {
					let args = [prop, this.editImage[prop]]
					if (prop == 'file')
						args.push(this.editImage[prop].name)

					fd.append.apply(fd, args)
				}


		for (var prop of ['name', 'lastname', 'patronymic', 'skype', 'phone', 'email'])
			if (this.hasOwnProperty(prop))
				fd.set(prop, this[prop])

		fd.id = this.id

		return this.constructor.wrap(await api.core.post('manager/update', fd), 'ID_M')
	}

	get avatarDefault () {
		return 'https://quasar-framework.org/quasar-play/android/statics/linux-avatar.png'
	}
}
