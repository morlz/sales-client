<template>
<div class="reportResumeSalon">
	<div class="reportResumeSalon__sort" :style="{ opacity: +showArrow }">
		<q-icon :name="!sortDirection ? 'arrow_back' : 'arrow_forward'"/>
		<q-tooltip ref="tooltip">
			Сортировать по {{ !sortDirection ? 'убыванию' : 'возростанию' }}
		</q-tooltip>
	</div>

	<div class="reportResumeSalon__value" @click="goToDay">
		<q-tooltip v-if="!noLink">
			Перейти к салону
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
		salon: Number,
		noLink: Boolean
	},
	components: {
		QTooltip
	},
	methods: {
		goToDay () {
			if (this.noLink) return
			router.push(`/reports/resume/salon/${this.salon}/${moment(this.date).format('Y-M')}`)
		}
	}
}
</script>


<style lang="stylus">

.reportResumeSalon
	display grid
	grid-template-columns max-content 1fr

	&__sort
		cursor pointer
		opacity 0
		transition opacity .15s ease-in-out

	&__value
		cursor pointer
		margin-left 5px

</style>
