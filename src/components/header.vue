<template>
<header>
	<div class="toggleMenu" @click="toggleMenu" />
</header>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
	methods: {
		...mapMutations(['toggleMenu'])
	}
}
</script>


<style lang="less" scoped>
header {
    height: 50px;
    background-color: #3c8dbc;
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
