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
		//this.loop = setInterval(a => this.refresh(), 1e4)
		this.runNext (1e3)
	}

	destroy () {
		clearTimeout(this.loop)
		this.preparedToDestroy = true
	}

	async refresh () {
		let res = await api.core.get('new/refresh', { t: this.lastUpdate, id: this.new.id })

		if (!res || res.error)
			return this.runNext (1e4)

		if (this.typing !== res.typing)
			this.setTyping(res.typing)

		if (res.newMessages && res.newMessages.length && this.new)
			this.setMessages([
				...this.new.messages.filter(el => !res.newMessages.find(n => n.id == el.id)),
				...res.newMessages
			])

		if ((res.addedMembers && res.addedMembers.length) || (res.removedMembers && res.removedMembers.length))
			this.setMembers([
				...this.members.filter(member => !res.removedMembers.find(removed => member.id != removed.id)),
				...res.addedMembers
			])

		this.lastUpdate = res.t
		this.runNext (res.next || 1e4)
	}

	runNext (time = 1e4) {
		if (this.preparedToDestroy)
			return

		if (this.loop)
			clearTimeout(this.loop)

		this.loop = setTimeout(() => this.refresh(), time)
	}

	createMessage () {

	}

	setTyping (val) {
		this.typing = val
		this.emit('typing', val)
	}

	setMessages (val) {
		this.new.messages = val
		this.emit('messages', this.new.messages)
	}

	setMembers (val) {
		this.members = val
		this.emit('members', val)
	}

	appendMessage (msg) {
		this.new.messages.push(msg)
		this.emit('messages', this.new.messages)
	}
}
