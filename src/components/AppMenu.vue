<template>
<div class="menu" :style="menuStyles">
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
		...mapMutations([
			'nav_openLeftSet'
		]),
		onlyCan (el) {
			el = { ...el }
			if (el.can && !this.auth_can(el.can.lvl, el.can.action))
				return false

			if (el.childs)
				el.childs = el.childs.map(this.onlyCan).filter(el => el)

			return el
		}
	},
	computed: {
		...mapGetters([
			'nav_items',
			'nav_open',
			'main_view_mobile'
		]),
		onlyAllowedItems () {
			return this.onlyCan({
				childs: this.nav_items,
				name: "Menu",
				icon: this.main_view_mobile ? 'el-icon-back' : undefined,
				click: e => this.nav_openLeftSet(false)
			})
		},
		menuStyles () {
			return {
				'pointer-events': this.main_view_mobile && this.nav_open.left ? 'all': 'none'
			}
		}
	},
	mounted () {

	},
	beforeDestroy () {

	}
}
</script>


<style lang="less">
.menu {
	width: 310px;
	position: relative;
	z-index: 3000;
	height: 100%;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
}
</style>
