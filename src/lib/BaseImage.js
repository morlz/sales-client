import api from '@/api'
import { aggregation } from '@/lib'
import BaseModel from '@/lib/BaseModel'

export default class BaseImage extends BaseModel {
	baseUrl = api.core.apiPath + '/file/local/{id}'

	constructor (arg) {
		super()
		this.define({

		}, arg)
	}

	static getDataUrl (url) {
		return new Promise (resolve => {
			let image = new Image()
			image.crossOrigin = "Anonymous"

			image.onload = function () {
		        var canvas = document.createElement('canvas')
		        canvas.width = this.naturalWidth // or 'width' if you want a special/scaled size
		        canvas.height = this.naturalHeight // or 'height' if you want a special/scaled size

		        canvas.getContext('2d').drawImage(this, 0, 0)

		        //// Get raw image data
		        //callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

		        // ... or get as Data URI
		        resolve(canvas.toDataURL('image/png'))
		    };

		    image.src = url
		})
	}

	get dataUrl () {
		return BaseImage.getDataUrl(this.src)
	}

	static async getFile (url) {
		return await api.images.proxyGetUrl(url)
	}
}
