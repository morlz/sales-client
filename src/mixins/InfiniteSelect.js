export default {
	data () {
		return {
			infiniteSelect_selected: [],
			infiniteSelect_$items: []
		}
	},
	computed: {
		infiniteSelect_items: {
			get () {
				return this.infiniteSelect_$items
			},
			set (val) {
				this.infiniteSelect_$items = val
			}
		},
		infiniteSelect_all: {
			get () {
				if (!this.infiniteSelect_items.length)
					return false

				return this.infiniteSelect_items.every(el => this.infiniteSelect_selected.includes(el))
			},
			set (val) {
				this.infiniteSelect_selected = val ? this.infiniteSelect_items : []
				this.infiniteSelect_changed()
			}
		},
	},
	methods: {
		infiniteSelect_isSelected (index) {
			return this.infiniteSelect_selected.includes(+index)
		},
		infiniteSelect_onSelect (e, index) {
			if (e) {
				this.infiniteSelect_selected.push(+index)
			} else {
				this.infiniteSelect_selected = this.infiniteSelect_selected.filter(el => el != +index)
			}

			this.infiniteSelect_changed()
		},
		infiniteSelect_changed () {
			this.$nextTick(a => this.$emit('infiniteSelect_selected', this.infiniteSelect_selected))
		}
	}
}
