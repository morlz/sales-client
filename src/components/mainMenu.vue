<template>
<div class="mainMenuWrapper">
	<!-- не смотри на это... -->

	<div class="logo">

	</div>

	<div class="shadow" :class="{ shadowActive: menuOpen }" @click="closeMenu"></div>

	<div class="backgroundWrapper" :class="{ isCollapse: !menuOpen }">
		<el-menu :default-active="dafaultActive" class="mainMenu" @select="menuClickHandler">
			<div class="moileBackButton el-icon-back" @click="closeMenu" />

			<el-menu-item v-for="item in menuItemsWithoutChilds(menuItemsWithIndexes)" :index="item.path || item.index" :key="item.index">
				<i :class="item.icon || 'el-icon-location'" />
				<div class="name">{{item.name}}</div>
			</el-menu-item>

			<el-submenu v-for="item in menuItemsWithChilds(menuItemsWithIndexes)" :index="item.index" :key="item.index">
				<template slot="title">
					<i :class="item.icon || 'el-icon-location'" />
					<div class="name"> {{ item.name }} </div>
				</template>

				<el-menu-item v-for="cItem in menuItemsWithoutChilds(item.childs)" :index="cItem.path || cItem.index" :key="cItem.index">
					<i :class="cItem.icon || 'el-icon-location'" />
					<div class="name">{{cItem.name}}</div>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>

</div>
</template>

<script>


import { mapGetters, mapActions, mapMutations } from 'vuex'


export default {
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
		}
	}
}
</script>


<style lang="less">

.mainMenuWrapper {
	.logo {
		background-color: #367fa9;
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
