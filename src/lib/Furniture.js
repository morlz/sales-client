import BaseModel from '@/lib/BaseModel'
import { Cloth, Td } from '@/lib'

export default class Furniture extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			cloth1: Cloth,
			cloth2: Cloth,
			cloth3: Cloth,
			td: Td
		}, arg)
	}
}
