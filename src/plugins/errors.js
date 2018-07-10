import { ClientError } from '@/lib'

export default ({ Vue }) => {
	/*
	Vue.config.errorHandler = (err, vm, info) => {
		let { message, fileName, lineNumber } = err
		let clientError = new ClientError({ msg: message, url: `vm._uid: ${vm._uid}`, line: info })
		clientError.save()
		console.error(err, vm, info)
	}
	*/
}
