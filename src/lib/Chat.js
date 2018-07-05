import api from '@/api'
import BaseModelEventEmitter from '@/lib/BaseModelEventEmitter'
import { NewMessage, Manager, New } from '@/lib'

export default class Chat extends BaseModelEventEmitter {
	lastUpdate = Date.now()

	constructor (newIns) {
		super()
		this.define({
			memebers: [Manager],
			new: New
		}, {
			new: newIns,
			loading: false,
			members: []
		})
		this.init()
	}

	init () {
		this.loop = setInterval(a => this.refresh(), 1e4)
	}

	destroy () {
		clearInterval(this.loop)
	}

	async refresh () {
		let res = await api.core.get('new/refresh', { t: this.lastUpdate, id: this.new.id })

		if (!res || res.error) return

		if (this.typing !== res.typing)
			this.setTyping(res.typing)

		if (res.newMessages && res.newMessages.length && this.new)
			this.setMessages([...this.new.messages, ...res.newMessages])

		if ((res.addedMembers && res.addedMembers.length) || (res.removedMembers && res.removedMembers.length))
			this.setMembers([
				...this.members.filter(member => !res.removedMembers.find(removed => member.id != removed.id)),
				...res.addedMembers
			])

		this.lastUpdate = res.t
	}

	createMessage () {

	}

	setTyping (val) {
		this.typing = val
		this.emit('typing', val)
	}

	setMessages (val) {
		this.new.messages = val
		this.emit('messages', val)
	}

	setMembers (val) {
		this.members = val
		this.emit('members', val)
	}
}
