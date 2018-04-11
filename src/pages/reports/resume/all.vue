<template>
<div class="ReportResumeAll" ref="scroller">
	<div
		class="ReportResumeAll__row"
		v-for="salon, index in reports_resume_cached"
		:key="salon.id || (1e4 + index)"
		:style="rowStyle"
		@mouseenter="report_resume_hoverSet({ type: 'row', data: index })"
		:class="{
			'ReportResumeAll__title' : salon.title,
			'ReportResumeAll__row_hover': reports_resume_hover.row == index,
			'ReportResumeAll__row_sort': reports_resume_currentSortSalon.index + 1 == index && reports_resume_currentSortMonth.index == -1
		}"
		ref="rows"
	>
		<div class="ReportResumeAll__salonName" @click="report_resume_sortSalonSet(salon.id)">

			<q-input value="" @input="report_resume_salonNameFilterSet" float-label="Поиск по салону или группе" v-if="salon.title"/>

			<template v-else>
				<report-resume-salon
					:value="salon.name"
					:sort="reports_resume_currentSortSalon.index + 1 == index && reports_resume_currentSortMonth.index == -1"
					:show-arrow="reports_resume_hover.row == index || reports_resume_currentSortSalon.index + 1 == index && reports_resume_currentSortMonth.index == -1"
					:sort-direction="reports_resume_currentSortSalon.direction"
					:no-link="salon.itog"
					:salon="+salon.id"
				/>
			</template>
		</div>

		<div
			class="ReportResumeAll__item"
			v-for="item, iIndex in salon.months"
			:key="iIndex"
			@click="checkMonthClick(iIndex, index)"
			@mouseenter="report_resume_hoverSet({ type: 'column', data: iIndex })"
			:class="{
				'ReportResumeAll__item_hover': reports_resume_hover.column == iIndex,
				'ReportResumeAll__item_sort': reports_resume_currentSortMonth.index == iIndex
			}"
		>
			<report-resume-month
				v-if="salon.title"
				:value="item"
				:sort="reports_resume_currentSortMonth.index == iIndex"
				:show-arrow="reports_resume_hover.column == iIndex || reports_resume_currentSortMonth.index == iIndex"
				:sort-direction="reports_resume_currentSortMonth.direction"
				:no-link="reports_resume_currentSortSalon.direction ? iIndex + 1 == salon.months.length : !iIndex"
				:date="reports_resume_currentDate"
			/>

			<div v-else @click="goToDay(salon.id, iIndex, salon.footer)" :title="getTitle(reports_resume_currentDate, iIndex, salon.footer)">
				{{ item }}
			</div>
		</div>
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import ReportResumeMonth from '@/components/ReportResumeMonth'
import ReportResumeSalon from '@/components/ReportResumeSalon'
import inViewport from 'in-viewport'
import { tween, easing } from 'popmotion'
import moment from 'moment'

export default {
	components: {
		ReportResumeMonth,
		ReportResumeSalon,
	},
	watch: {
		reports_resume_currentSortSalon () {
			let element = this.$refs.rows[this.reports_resume_currentSortSalon.index]
			if (inViewport(element)) return

			this.$nextTick(() => {
				let from = this.$refs.scroller.scrollTop,
					to = element.offsetTop - this.$refs.scroller.offsetHeight / 2

				tween({ from, to, ease: easing.easeInOut, duration: 500 })
					.start(v => this.$refs.scroller.scrollTop = v)
			})
		}
	},
	computed: {
		...mapGetters('reports/resume', [
			'reports_resume_cached',
			'reports_resume_hover',
			'reports_resume_currentSortSalon',
			'reports_resume_currentSortMonth',
			'reports_resume_currentDate',
			'reports_resume_currentMonthLength'
		]),
		rowStyle () {
			return {
				gridTemplateColumns: `300px repeat(${this.reports_resume_currentMonthLength + 1}, 50px)`
			}
		}
	},
	methods: {
		...mapActions('reports/resume', [
			'report_resume_all_init',
			'report_resume_all_destroy'
		]),
		...mapMutations('reports/resume', [
			'report_resume_sortMonthSet',
			'report_resume_sortSalonSet',
			'report_resume_salonNameFilterSet',
			'report_resume_hoverSet'
		]),
		checkMonthClick (item, index) {
			if (index) return
			this.report_resume_sortMonthSet(item + 1)
		},
		goToDay (salon, day, footer = false) {
			let date = moment(this.reports_resume_currentDate)
			date.set('day', day)
			if (footer)
				return router.push(`/reports/resume/day/${date.format('Y-M-D')}`)

			if (!day && !this.reports_resume_currentSortSalon.direction || day == this.reports_resume_currentMonthLength && this.reports_resume_currentSortSalon.direction)
				return router.push(`/reports/resume/salon/${salon}`)

			router.push(`/reports/resume/salon/${salon}/${date.format('Y-M-D')}`)
		},
		getTitle (date, day, footer = false) {
			//if (this.reports_resume_currentSortSalon.direction ^ (!day || day == ))
			let formated = (day && day < 10 ? '0' + day : day) + moment(date).format('-MM-YYYY')

			if (footer) {
				if (day == this.reports_resume_currentMonthLength) return
				return `Перейти к всему дню ${formated}`
			}

			if (!day && !this.reports_resume_currentSortSalon.direction || day == this.reports_resume_currentMonthLength && this.reports_resume_currentSortSalon.direction)
				return `Перейти к салону`

			return 'Перейти к ' + formated
		}
	},
	created () {
		this.report_resume_all_init()
	},
	destroyed () {
		this.report_resume_all_destroy()
	}
}
</script>


<style lang="stylus">
$background-color-hover = #ecf5ff
$background-color-sort = #eee

.ReportResumeAll
	overflow auto
	display grid
	width 100%
	height calc(100vh - 120px)
	padding 10px
	box-siing border-box
	align-content start
	transform translateZ(0)
	font-size 12px

	&__row
		display grid
		grid-gap 5px
		align-items center
		transition background .15s ease-in-out

		&_hover
			background $background-color-hover
		&_sort
			background $background-color-sort

	&__title > div
		height 50px
		user-select none

	&__salonName
		padding 5px
		user-select none

	&__item
		border-bottom 1px solid #eee
		padding 4px
		text-align center
		white-space nowrap
		cursor pointer
		&_hover
			background $background-color-hover
		&_sort
			background $background-color-sort

</style>
