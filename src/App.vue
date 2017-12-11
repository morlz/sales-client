<template>
<div id="app">
	<div class="header">
		<main-header/>
	</div>
	<div class="menu">
		<main-menu/>
	</div>
	<div class="main">
		<router-view/>
	</div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import mainMenu from '@/components/mainMenu.vue'
import mainHeader from '@/components/header.vue'

export default {
	name: 'app',
	components: {
		mainMenu,
		mainHeader
	},
	methods: {
		...mapActions([
			'getAllTaskTypes',
			'getAllRecordStatuses'
		])
	},
	mounted () {
		this.getAllTaskTypes()
		this.getAllRecordStatuses()
	}
}
</script>

<style lang="less">

@import url("./lib/FontAwesome/less/font-awesome.less");

body {
	margin: 0;
	color: #5a5e66;
}

.el-card {
	color: #5a5e66;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	display: grid;
	grid-template: 	"menu head" 50px
					"menu main" auto;

	.header {
		grid-area: head;
	}

	.menu {
		grid-area: menu;
	}

	.main {
		grid-area: main;
		padding: 10px;
		color: #5a5e66;
	}
}

.mainWrapper {
	.bc {
		height: 40px;
		line-height: 40px;
		white-space: nowrap;
		display: grid;
		grid-auto-flow: column;
		justify-content: flex-start;
		.el-breadcrumb__item {
			float: none;
		}
	}
}

h2 {
	margin: 0;
	font-size: 18px;
	font-weight: bold;
}

.icon {
	width: 24px;
	height: 24px;
	background-position: center;
	background-size: contain;
}

.el-icon-list {
	.icon;
	background-image: url("./assets/list.svg");
}

.el-icon-clients {
	.icon;
	background-image: url("./assets/businesswoman.svg");
}

.el-icon-home {
	.icon;
	background-image: url("./assets/house-black-silhouette-without-door.svg");
}

.el-icon-preorder {
	.icon;
	background-image: url("./assets/people-trading.svg");
}

@media screen and (max-width: 768px) {
	#app {
		grid-template: 	"menu head" 50px
						"menu main" auto
					~"/" minmax(0, max-content) 1fr;
	}
}

</style>
