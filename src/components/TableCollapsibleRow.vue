<template>
	<div class="tableCollapsible__row" >
		<div class="tableCollapsible__rowColumns" :style="s">
			<slot/>
		</div>

		<div class="tableCollapsible__rowCollapcible">
			<slot name="content" :row="row"/>
		</div>
	</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QCollapsible
} from 'quasar'

export default {
	props: {
		row: {
			type: Object
		}
	},
	data() {
		return {}
	},
	components: {

	},
	watch: {

	},
	computed: {
		s () {
			return { 'grid-template-columns' : 'repeat(auto-fit, minmax(40px, 1fr))' }
		}
	},
	methods: {

	},
}
</script>


<style lang="less">
.tableCollapsible__row {
	&Columns {
		display: grid;
	}

}
</style>
