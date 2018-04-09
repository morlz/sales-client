<template>
<div class="ReportResumeAll" :style="{ gridTemplateColumns: `300px repeat(30, 1fr)` }">
	<template v-for="salon, index in reports_resume_cached">
		<div class="ReportResumeAll__salonName">
			{{ salon.NAME }}
		</div>
		<div class="ReportResumeAll__item" v-for="item, index in salon.months">
			{{ item }}
		</div>
	</template>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'

export default {
	props: {

	},
	components: {

	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		...mapGetters('reports/resume', [
			'reports_resume_cached'
		]),
	},
	methods: {

	},
	mounted () {

	}
}
</script>


<style lang="stylus">
.ReportResumeAll
	overflow auto
	display grid
	width 100%
	height calc(100vh - 120px)
	grid-gap 5px
	padding 10px
	box-siing border-box
	&__item
		border-bottom 1px solid #eee
		padding 4px
		text-align center
		white-space nowrap


</style>
