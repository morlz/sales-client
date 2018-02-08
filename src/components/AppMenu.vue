<template>
<div class="menu">
	<app-menu-item v-for="item, index in onlyAllowedItems"
		:content="item"
		:prefix="`${index}|${onlyAllowedItems.length}`"
		:key="index"
		@in="mouseInHandler($event, index)"
		@out="mouseOutHandler($event, index)"
		ref="childs"/>
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
		...mapMutations(['closeMenu']),
		prepareMenuEl(item, index, prevIndex = "") {
			let delimiter = prevIndex ? "-" : ""
			item.index = prevIndex + delimiter + index

			if (item.childs) item.childs = item.childs.map((child, childIndex) => this.prepareMenuEl(child, childIndex, "" + index))

			return item
		},
		menuItemsWithChilds(items) {
			return items.filter(el => el.childs)
		},
		menuItemsWithoutChilds(items) {
			return items.filter(el => !el.childs)
		},
		menuClickHandler (data) {
			// global router
			this.closeMenu()
			router.push({ path: data })
		},

		onlyCan (el) {
			el = { ...el }
			if (el.can && !this.auth_can(el.can.lvl, el.can.action))
				return false

			if (el.childs)
				el.childs = el.childs.map(this.onlyCan).filter(el => el)

			return el
		},
		mouseInHandler (e, index) {
			console.log(e, index);
			this.$refs.childs.map((vm, vmIndex) => {
				vm.$emit('name.show', vmIndex * 50)
			})
		},
		mouseOutHandler (e, index) {
			this.$refs.childs.map((vm, vmIndex) => {
				vm.$emit('name.hide', vmIndex * 50)
			})
		}
	},
	computed: {
		...mapGetters([
			'menuOpen',
			'menuItems'
		]),
		menuItemsWithIndexes() {
			return this.menuItems.map((el, index) => this.prepareMenuEl(el, index))
		},
		dafaultActive() {
			return this.$route.path
		},



		onlyAllowedItems () {
			return this.onlyCan({ childs: this.menuItems }).childs
		}

	}
}
</script>


<style lang="less">

.mainMenuWrapper {
	.logo {
		background-color: #1565c0;
		width: 100%;
		height: 50px;
	}

	.shadow {
		pointer-events: none;
		opacity: 0;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		transition: all 0.4s ease-in-out;
	}

	.backgroundWrapper {
		width: 300px;
		overflow:hidden;
		transition: all 0.4s ease-in-out;
		.mainMenu {
			i {
				color: #027be3;
			}
			.active {
				background: rgba(64,158,255, 0.1);
			}
			.moileBackButton {
				display: none;
			}
			.name {
				display: inline-block;
				transition: all 0.4s ease-in-out;
			}
		}
	}

	.isCollapse {
		width: 80px;
		.name {
			opacity: 0;
		}
	}
}

@media screen and (max-width:768px) {
	.mainMenuWrapper {
		.shadowActive {
			pointer-events: all;
			opacity: 1;
		}

		.backgroundWrapper {
			background-color: #fff;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 25;
			height: 100%;
			overflow-x: hidden;
			overflow-y: auto;
			.mainMenu {
				.moileBackButton {
					height: 50px;
					line-height: 50px;
					padding: 0 20px;
					display: block;
				}
			}
		}

		.isCollapse {
			width: 0;
		}
	}

}

</style>
