import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters([
			'cart_exist',
			'cart_new',
		])
	},
	methods: {
		cart_alreadyIn (id, exist = false) {
			return exist ?
				this.cart_exist.findIndex(el => el.td.ID == id) + 1
			:	this.cart_new.findIndex(el => el.ID == id) + 1
		}
	}
}
