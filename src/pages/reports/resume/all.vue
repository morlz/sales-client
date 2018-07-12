<template>
<div class="ReportResumeAll" ref="scroller">
	<div class="ReportResumeAll__filters">
		<datetime class="ReportResumeAll__filter-date" v-model="month" default-view="month" float-label="Выберите год и месяц (день не имеет значения)"/>

		<div>
			Продажи за {{ currentWeekText }} (по товарным чекам), тыс. рублей
		</div>
	</div>

	<div
		class="ReportResumeAll__row"
		v-for="salon, index in reports_resume_cached"
		:key="salon.id || (1e4 + index)"
		:style="rowStyle"
		:class="{ 'ReportResumeAll__title' : salon.title }"
		ref="rows"
	>
		<div class="ReportResumeAll__salonName">
			<div class="ReportResumeAll__salonNameHeader"
				v-if="salon.title"
				@click="reports_resume_sortSet({ type: 'salon', index: 1 })">
				<q-input value="" @input="reports_resume_salonNameFilterSet" float-label="Поиск по салону или группе" />
				<q-icon :name="!sortDirection ? 'arrow_upward' : 'arrow_downward'" class="cursor-pointer">
					<q-tooltip>
						 {{ !sortDirection ? 'Сортировать по алфавиту' : 'Сортировать по обратному алфавиту' }}
					</q-tooltip>
				</q-icon>
			</div>

			<template v-else>
				<div
					class="ReportResumeAll__salonName-text"
					@click.stop="goToDay(salon.id, -1)"
					:style="{
						fontWeight: salon.best ? 'bold' : 'normal'
					}">
					{{ salon.name }}
				</div>
			</template>
		</div>

		<div
			class="ReportResumeAll__item"
			v-for="item, iIndex in salon.months"
			:key="iIndex"
			@click="reports_resume_sortSet({ type: 'month', index: iIndex + 1 })"
			:class="{ 'ReportResumeAll__item_sort': sortByMonth && sortIndex === iIndex }"
		>
			<report-resume-month
				v-if="salon.title"
				:value="item"
				sort
				show-arrow
				:sort-direction="sortDirection"
				:no-link="iIndex + 1 == salon.months.length"
				:date="reports_resume_currentDate"
			/>

			<div
				v-else
				@click.stop="goToDay(salon.id, iIndex, salon.footer)"
				:title="getTitle(reports_resume_currentDate, iIndex, salon.footer)"
				:style="{
					opacity: money(item) === '0.00' ? '0.3' : 1,
					fontWeight: salon.best && iIndex + 1 == salon.months.length ? 'bold' : 'normal'
				}">
				{{ item | money }}
			</div>
		</div>
	</div>

	<loading :value="loading"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'
import Datetime from '@/components/Datetime'
import ReportResumeMonth from '@/components/ReportResumeMonth'
import ReportResumeSalon from '@/components/ReportResumeSalon'
import Loading from '@/components/Loading'
import inViewport from 'in-viewport'
import { tween, easing } from 'popmotion'
import moment from 'moment'
import money from '@/filters/MoneyThousand'


export default {
	components: {
		ReportResumeMonth,
		ReportResumeSalon,
		Datetime,
		Loading
	},
	computed: {
		...mapState ('reports/resume', {
			loading: state => state.loading.all,
			sortIndex: state => Math.abs(state.sort.index) - 1,
			sortDirection: state => !(state.sort.index < 0),
			sortByMonth: state => state.sort.type === 'month'
		}),
		...mapGetters('reports/resume', [
			'reports_resume_cached',
			'reports_resume_currentDate',
			'reports_resume_currentMonthLength'
		]),
		rowStyle () {
			return {
				gridTemplateColumns: `250px	repeat(${this.reports_resume_currentMonthLength}, minmax(50px, 1fr)) 100px`
			}
		},
		month: {
			get () {
				return this.$store.state.reports.resume.date.format('YYYY-MM-DD')
			},
			set (n) {
				this.$store.dispatch('reports/resume/reports_resume_dateSet', n)
			}
		},
		currentWeekText () {
			return moment(this.reports_resume_currentDate).locale('ru').format('MMMM YYYY')
		}
	},
	methods: {
		money,
		...mapActions('reports/resume', [
			'reports_resume_all_init',
			'reports_resume_all_destroy'
		]),
		...mapMutations('reports/resume', [
			'reports_resume_sortSet',
			'reports_resume_salonNameFilterSet'
		]),
		...mapMutations('reports/salesTwo', [
			'reports_salesTwo_dateFromSet',
			'reports_salesTwo_dateToSet',
			'reports_salesTwo_salonSet'
		]),
		checkMonthClick (item, index) {
			if (index) return
			this.reports_resume_sortMonthSet(item + 1)
		},
		goToDay (salon, day, footer = false) {
			let date = moment(this.reports_resume_currentDate)
			date.set('date', day + 1)
			if (footer) {
				if (day == this.reports_resume_currentMonthLength) return
				return router.push(`/reports/resume/day/${date.format('YYYY-MM-DD')}`)
			}

			this.reports_salesTwo_salonSet(salon)

			let isDay = !(day === this.reports_resume_currentMonthLength || day === -1)

			date.set('date', isDay ? day + 1 : 1)

			if (!isDay)
				date.add(2, 'month')

			this.reports_salesTwo_dateToSet(date.add(1, 'day').format('YYYY-MM-DD'))
			if (!isDay)
				date.subtract(1, 'day')
			this.reports_salesTwo_dateFromSet(date.subtract(1, isDay ? 'day' : 'month').format('YYYY-MM-DD'))
			this.$router.push({ path: '/reports/salesTwo', props: { salon: true }})
		},
		getTitle (date, day, footer = false) {
			day++

			let formated = moment(date).set('date', day).format('YYYY-MM-DD')

			if (footer) {
				if (day - 1 == this.reports_resume_currentMonthLength) return
				return `Перейти к всему дню ${formated}`
			}

			if (day == this.reports_resume_currentMonthLength + 1 || day == 0)
				return `Перейти к салону`

			return 'Перейти к ' + formated
		}
	},
	filters: {
		money
	},
	created () {
		this.reports_resume_all_init()
	},
	destroyed () {
		this.reports_resume_all_destroy()
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
	position relative

	&__filters
		display grid
		justify-content start
		grid-template-columns 300px 1fr
		align-items center
		grid-gap 10px

	&__row
		display grid
		grid-gap 5px
		align-items center
		transition background .15s ease-in-out
		&:hover
			background $background-color-hover

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

		&-text
			cursor pointer

	&__item
		border-bottom 1px solid #eee
		padding 4px
		text-align right
		white-space nowrap
		cursor pointer

		&_hover
			background $background-color-hover

		&_sort
			background $background-color-sort

	&__filter-date
		width 300px

	&__salonNameHeader
		display grid
		align-items start
		grid-template-columns 1fr 30px

</style>
