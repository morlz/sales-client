<template>
<div class="appWrapper">
	<slot name="icons"/>
	<slot name="styles"/>

	<transition name="fadeZoom" appear key="mainTransition">
		<q-layout view="lhh LpR lff" v-if="logined" :left-class="{ menuWrapper: true }">
			<slot name="menu" slot="left"/>
			<slot name="header" slot="header"/>

			<slot/>

			<slot name="footer" slot="footer"/>
		</q-layout>
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

import { QLayout } from 'quasar'

export default {
	data() {
		return {}
	},
	components: {
		QLayout
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
.menuWrapper {
	overflow: visible;
	width: 80px;
}
.layout-aside.fixed {
	z-index: 3000;
}

.mainWrapper {
	padding: 10px;
}


.appWrapper {
    height: 100%;
    .app {
        transition: all 0.3s ease-in-out;
        height: 100%;

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
