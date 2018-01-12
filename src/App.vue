<template>
<div class="appWrapper">
	<icons/>
	<global-styles/>

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
import icons from '@/components/icons.vue'
import globalStyles from '@/components/globalStyles.vue'
import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	name: 'app',
	components: {
		mainMenu,
		mainHeader,
		mainAuth,
		icons,
		globalStyles
	},
	watch: {
		logined (n) {
			if (!n) return
			if (this.auth_can(1, "TaskType")) this.task_getTypes()
			if (this.auth_can(1, "PreorderStatus")) this.preorder_getStatuses()
		}
	},
	computed: mapGetters([
		'menuOpen',
		'logined'
	]),
	methods: {
		...mapActions([
			'task_getTypes',
			'preorder_getStatuses',
			'authInit',
			'event_createHandlers'
		])
	},
	mounted() {
		this.event_createHandlers()
		this.authInit()
	}
}
</script>

<style lang="less">
.appWrapper {
    height: 100%;
    .app {
        transition: all 0.3s ease-in-out;
        height: 100%;
        .menu {
            width: 80px;
            float: left;
            transition: all 0.3s ease-in-out;
        }

        .mainContentWrapper {
            width: ~"calc(100% - 80px)";
            height: 100%;
            transition: all 0.3s ease-in-out;
            float: right;
        }

        .main {
            height: ~"calc(100% - 60px)";
            overflow-y: scroll;
            box-sizing: border-box;
            padding: 10px;
			margin: 5px;
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
}

@media screen and (max-width: 768px) {
	.appWrapper {
		.app {
			.logo {
				display: none;
			}
			.mainContentWrapper {
				width: 100%;
			}
		}
	}
}
</style>
