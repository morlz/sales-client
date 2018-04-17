export default class BaseModel {
	constructor (args) {
		for (var prop in args)
			if (args.hasOwnProperty(prop))
				this[prop] = args[prop]
	}
}
