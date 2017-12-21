<template>
<div class="appWrapper">
	<transition name="fadeZoom" appear key="mainTransition">
		<div class="app" :class="{ menuOpenMain: menuOpen }" v-if="logined">
			<div class="menu">
				<main-menu/>
			</div>
			<div class="mainContentWrapper">
				<div class="header">
					<main-header/>
				</div>
				<div class="main">
					<transition name="fade" key="routerTransition">
						<router-view/>
					</transition>
				</div>
			</div>
		</div>
	</transition>

	<transition name="fadeZoom" appear key="authTransition">
		<div class="appMainAuth" v-if="!logined">
			<main-auth />
		</div>
	</transition>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters
} from 'vuex'
import mainMenu from '@/components/mainMenu.vue'
import mainHeader from '@/components/header.vue'
import mainAuth from '@/pages/main/auth.vue'

export default {
	name: 'app',
	components: {
		mainMenu,
		mainHeader,
		mainAuth
	},
	computed: mapGetters([
		'menuOpen',
		'logined'
	]),
	methods: {
		...mapActions([
			'getAllTaskTypes',
			'getAllRecordStatuses',
			'authInit'
		])
	},
	mounted() {
		this.getAllTaskTypes()
		this.getAllRecordStatuses()
		this.authInit()
	}
}
</script>

<style lang="less">
@import url("./lib/FontAwesome/less/font-awesome.less");
@import url("https://fonts.googleapis.com/css?family=Roboto");

body {
    margin: 0;
    color: #5a5e66;
}

.fade-enter-active,
.fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.3s;
}

.fade-enter-active {
    transition-delay: 0.3s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}

.fadeZoom-enter-active,
.fadeZoom-leave-active {
    transition: all 1s ease-in-out;
}
.fadeZoom-enter,
.fadeZoom-leave-to {
    opacity: 0;
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

.el-tabs {
	&__item {
		transition: all 0.3s ease-in-out;
	}
}

.app {
	font-family: 'Roboto', serif;
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
        float: right;
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

.el-icon-* {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
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

.el-icon-roles {
    .icon;
    background-image: url("./assets/board-games-with-roles.svg");
}

.el-icon-admin {
    .icon;
    background-image: url("./assets/admin-with-cogwheels.svg");
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

.el-button,
.el-checkbox {
    transition: all 0.3s ease-in-out;
    span {
        transition: all 0.3s ease-in-out;
    }
}

.spinner {
    height: 50px;
}
</style>
