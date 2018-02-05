<template>
<div class="tableTwoCollumns_row">
	<div class="tableTwoCollumns__rowName">
		<slot name="label"/>
	</div>
	<div class="tableTwoCollumns__rowValue">
		<slot/>
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {} from 'quasar'

export default {
	data() {
		return {}
	},
	components: {

	},
	watch: {

	},
	computed: {

	},
	methods: {

	},
}
</script>


<style lang="less">
.tableTwoCollumns {
	&_row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
		padding: 10px;
		transition: all 0.3s ease-in-out;
		align-items: center;
		&:hover {
			background: #ecf5ff;
		}
	}
	&__rowName {
		text-align: left;
	}
	&__rowValue {
		text-align: right;
	}
}
</style>
