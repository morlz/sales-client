<template>
	<header>
		<el-popover ref="mainMenuButtonPopover" trigger="hover" placement="bottom-start" class="mainMenuButtonPopover">
			<div>
				<el-checkbox v-model="autoMenuCollapce">Зафиксировать меню</el-checkbox>
			</div>
			<div>
				<el-switch v-model="autoBenuCollapceState" active-text="Открыто" inactive-text="Закрыто" :disabled="!autoMenuCollapce" />
			</div>
		</el-popover>
		<div class="toggleMenu" v-popover:mainMenuButtonPopover @click="toggleMenu" />
		<profile/>
	</header>
</template>

<script>
import {
	mapMutations
} from 'vuex'
import profile from '@/components/profile.vue'

export default {
	data () {
		return {
			autoMenuCollapce: false,
			autoBenuCollapceState: false
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
		profile
	}
}
</script>


<style lang="less" scoped>
header {
    height: 50px;
    background-color: #3c8dbc;
    display: grid;
    justify-content: space-between;
    grid-template: "menuBtn profile";
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
	.profileWrapper {
		grid-area: profile;
	}

	.mainMenuButtonPopover {
		display: grid;
		grid-gap: 20px;
		grid-auto-flow: row;
	}
}
</style>
