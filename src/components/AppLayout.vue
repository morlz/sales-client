<template>
<div class="appWrapper">
	<slot name="icons"/>
	<slot name="styles"/>

	<transition name="fadeZoom" appear key="mainTransition">
		<div class="app" :class="{ menuOpenMain: menuOpen }" v-if="logined">
			<div class="menu">
				<slot name="menu"/>
			</div>
			<div class="mainContentWrapper">
				<div class="header">
					<slot name="header"/>
				</div>

				<div class="main">
					<slot/>
				</div>
			</div>
		</div>
	</transition>

	<transition name="fadeZoom" appear key="authTransition">
		<div class="appMainAuth" v-if="!logined">
			<slot name="auth"/>
		</div>
	</transition>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

export default {
	data() {
		return {}
	},
	components: {

	},
	watch: {

	},
	computed: {
		...mapGetters([
			'logined',
			'menuOpen'
		])
	},
	methods: {

	},
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
