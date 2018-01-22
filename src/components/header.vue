<template>
	<header>
		<el-popover ref="mainMenuButtonPopover" trigger="hover" placement="bottom-start" >
			<div class="mainMenuButtonPopover">
				<el-checkbox v-model="autoMenuCollapce">Зафиксировать меню</el-checkbox>
				<el-switch v-model="autoBenuCollapceState" active-text="Открыто" inactive-text="Закрыто" :disabled="!autoMenuCollapce" class="menuCollapceSwitcher" />
			</div>
		</el-popover>
		<div class="toggleMenu" v-popover:mainMenuButtonPopover @click="toggleMenu" />
		<cart/>
		<profile/>
	</header>
</template>

<script>
import {
	mapMutations
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
	methods: {
		...mapMutations([
			'toggleMenu',
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
    background-color: #3c8dbc;
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
            background-color: #367fa9;
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

.mainMenuButtonPopover {
	display: grid;
	justify-content: center;
	grid-gap: 10px;
	grid-auto-flow: row;
	.menuCollapceSwitcher {
		transition: opacity 0.3s ease-in-out;
	}
}
</style>
