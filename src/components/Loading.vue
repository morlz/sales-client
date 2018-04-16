<template>
<q-inner-loading :visible="value">
	<q-spinner-ball size="50px" color="primary"/>
</q-inner-loading>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'


export default {
	props: {
		value: Boolean
	},
}
</script>


<style lang="stylus">

</style>
