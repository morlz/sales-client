<template>
<div class="app" :class="{ menuOpenMain: menuOpen }">
	<div class="menu">
		<main-menu/>
	</div>
	<div class="mainContentWrapper">
		<div class="header">
			<main-header/>
		</div>
		<div class="main">
			<transition name="fade">
				<router-view/>
			</transition>

		</div>
	</div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import mainMenu from '@/components/mainMenu.vue'
import mainHeader from '@/components/header.vue'

export default {
	name: 'app',
	components: {
		mainMenu,
		mainHeader
	},
	computed: mapGetters(['menuOpen']),
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

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

.el-card {
	color: #5a5e66;
	display: grid;
	grid-template-rows: min-content auto;

	.el-card__body {
		display: grid;
		grid-auto-flow: row;
	}
	.buttons {
		align-self: end;
	}
}

.app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	transition: all 0.3s ease-in-out;

	.menu {
		width: 80px;
		float: left;
		transition: all 0.3s ease-in-out;
	}

	.mainContentWrapper {
		width: ~"calc(100% - 80px)";
		transition: all 0.3s ease-in-out;
		float: left;
	}

	.main {
		box-sizing: border-box;
		padding: 10px;
		color: #5a5e66;
	}
}

.menuOpenMain {
	.menu {
		width: 300px;
	}
	.mainContentWrapper {
		width: ~"calc(100% - 300px)";
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

.el-icon-furniture {
	.icon;
	background-image: url("./assets/armchair.svg");
}

.el-icon-salon {
	.icon;
	background-image: url("./assets/shop.svg");
}

.el-icon-storage {
	.icon;
	background-image: url("./assets/warehouse.svg");
}

.el-icon-discount {
	.icon;
	background-image: url("./assets/percent.svg");
}

.el-icon-docs {
	.icon;
	background-image: url("./assets/docs.svg");
}

.el-icon-order {
	.icon;
	background-image: url("./assets/notebook.svg");
}

.el-icon-movement {
	.icon;
	background-image: url("./assets/delivery-packages-on-a-trolley.svg");
}

.el-icon-shipments {
	.icon;
	background-image: url("./assets/delivery-truck.svg");
}

.el-icon-code {
	.icon;
	background-image: url("./assets/code.svg");
}

.el-icon-report {
	.icon;
	background-image: url("./assets/teacher-asking-a-student-about-bad-test-result.svg");
}

.el-icon-sell-result {
	.icon;
	background-image: url("./assets/education-chart.svg");
}












.el-dialog {
	min-width: 400px;
}

@media screen and (max-width: 768px) {
	.app {
		.logo {
			display: none;
		}
		.mainContentWrapper {
			width: 100%;
		}
	}
}

.el-button, .el-checkbox {
	transition: all 0.3s ease-in-out;
	span {
		transition: all 0.3s ease-in-out;
	}
}

.spinner {
	height: 50px;
}
</style>
