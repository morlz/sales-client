<template>
<header>
	<div class="toggleMenu" @click="toggleMenu" />
	<profile/>
</header>
</template>

<script>
import { mapMutations } from 'vuex'
import profile from '@/components/profile.vue'

export default {
	methods: {
		...mapMutations(['toggleMenu'])
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
	grid-auto-flow: column;
    .toggleMenu {
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
}
</style>
