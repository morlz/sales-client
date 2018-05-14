import BaseModel from '@/lib/BaseModel'

export default class Cloth extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			id: 'ITEMID'
		}, arg)

		this.rnm = Math.random()
	}

	get image () {
		return `http://${document.location.hostname}/tiss/${this.file_name}.${this.file_type}`
	}

	/*
	get image () {
		return this.rnm > 0.5 ? 'https://www.head.com/shop/en/skin/frontend/rwd/headsports/images/no-img-available.png' : 'https://ae01.alicdn.com/kf/HTB1MqNCKVXXXXa5XpXXq6xXFXXXY/Ice-silk-cloth-pearl-curtain-decoration-cloth-ice-thick-fabric-cloth-stage-background-wedding-gauze-curtain.jpg_640x640.jpg'
	}
	*/

	get status () {
		return {
			normal: !(this.StatusActive == 1),
			text: this.cStatus ? 'Не используется' : 'Отсутствует'
		}
	}

}
