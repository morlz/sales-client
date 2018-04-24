import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'


export default {
	computed: {
		...mapGetters([
			'auth_permissins'
		]),
	},
	methods: {
		auth_can(minlvl, action) {
			return typeof minlvl === 'object' ?
				this.auth_compareArray(minlvl)
			:	this.auth_comparePair(minlvl, action)
		},
		auth_compareArray (array) {
			return Object.keys(array)
				.map(key => this.auth_comparePair(array[key], key))
				.every(el => el === true)
		},
		auth_comparePair (minlvl, action) {
			return !!this.auth_permissins.find(perm => perm.name == action && perm.access_level >= minlvl)
		}
	}
}
