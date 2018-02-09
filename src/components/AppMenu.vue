<template>
<div class="menu">
	<app-menu-item :content="onlyAllowedItems" initial/>
</div>
</template>

<script>
import AppMenuItem from '@/components/AppMenuItem.vue'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	components: {
		AppMenuItem
	},
	methods: {
		onlyCan (el) {
			el = { ...el }
			if (el.can && !this.auth_can(el.can.lvl, el.can.action))
				return false

			if (el.childs)
				el.childs = el.childs.map(this.onlyCan).filter(el => el)

			return el
		},
	},
	computed: {
		...mapGetters([
			'menuItems'
		]),
		onlyAllowedItems () {
			return this.onlyCan({ childs: this.menuItems, name: "Menu" })
		}
	}
}
</script>


<style lang="less">
.menu {
	width: 70px;
	position: relative;
	z-index: 3000;
}
</style>
