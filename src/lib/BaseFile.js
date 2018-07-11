import BaseModel from '@/lib/BaseModel'
import { aggregation } from '@/lib'
import api from '@/api'

export default class BaseFile extends aggregation(File, BaseModel) {
	static types = [
		'Б',
		'Кб',
		'Мб',
		'Гб',
		'Тб',
		'Пб',
		'Эб',
		'Зб',
		'Иб'
	]

	constructor (arg) {
		super()
		this.define({

		}, arg)
	}

	static getFileSize (val) {
		let size = val
		do {
			size /= 2**10
		} while (size > 2**10)

		return size.toFixed(2)
	}

	static getSizeType (val) {
		let i = 0
		while (val > 2**10) (val /= 2**10, i++)
		return BaseFile.types[i]
	}
}
