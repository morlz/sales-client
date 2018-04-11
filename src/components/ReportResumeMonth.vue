<template>
<div class="reportResumeMonth">
	<div class="reportResumeMonth__sort" :style="{ opacity: +showArrow }">
		<q-icon :name="!sortDirection ? 'arrow_upward' : 'arrow_downward'"/>
		<q-tooltip>
			Сортировать по {{ !sortDirection ? 'убыванию' : 'возростанию' }}
		</q-tooltip>
	</div>

	<div class="reportResumeMonth__value" @click="goToDay">
		<q-tooltip v-show="!noLink">
			Перейти к дню
		</q-tooltip>
		{{ value }}
	</div>
</div>
</template>

<script>
import moment from 'moment'
import { QTooltip } from 'quasar'

export default {
	props: {
		sortDirection: Boolean,
		sort: Boolean,
		showArrow: Boolean,
		value: [String, Number],
		date: [String, Number, Object],
		noLink: Boolean
	},
	components: {
		QTooltip
	},
	methods: {
		goToDay () {
			if (this.noLink) return
			let date = moment(this.date)
			date.set('day', this.value)
			router.push(`/reports/resume/day/${date.format('Y-M-D')}`)
		}
	},
}
</script>


<style lang="stylus">

.reportResumeMonth
	height 50px

	&__sort
		cursor pointer
		opacity 0
		transition opacity .15s ease-in-out

	&__value
		cursor pointer
		margin-top 5px

</style>
