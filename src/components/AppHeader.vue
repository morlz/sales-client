<template>
	<header>
		<div class="toggleMenu" @click="nav_openToggle" v-if="main_view_mobile"/>
		<cart/>
		<profile/>
	</header>
</template>

<script>
import {
	mapMutations,
	mapGetters,
	mapActions
} from 'vuex'
import profile from '@/components/profile.vue'
import cart from '@/components/cartPopup.vue'
/**
 invoice - заказы
 SP_OTGRUZOK - доставки
 */



export default {
	data () {
		return {
			autoMenuCollapce: false,
			autoBenuCollapceState: true
		}
	},
	watch: {
		autoMenuCollapce (n) {
			this.changeMenuFixed(n)
		},
		autoBenuCollapceState (n) {
			this.changeMenuFixedState(n)
		}
	},
	computed: {
		...mapGetters([
			'main_view_mobile'
		])
	},
	methods: {
		...mapMutations([
			'nav_openToggle',
			'changeMenuFixed',
			'changeMenuFixedState'
		])
	},
	components: {
		profile,
		cart
	}
}
</script>




<style lang="less">
header {
    height: 50px;
    background-color: #027be3;
    display: grid;
    justify-content: space-between;
    grid-template: 	"menuBtn cart profile"
				~"/" 1fr max-content max-content;
    .toggleMenu {
		grid-area: menuBtn;
        font-family: fontAwesome;
        transition: all 0.3s ease-in-out;
        line-height: 50px;
        width: 50px;
        text-align: center;
        color: #f6f6f6;
        &:hover {
            background-color: #1565c0;
            cursor: pointer;
        }
        &:before {
            content: "\f0c9";
            color: #f6f6f6;
        }
    }
	.cartWrapper {
		grid-area: cart;
	}
	.profileWrapper {
		grid-area: profile;
	}
}
</style>
