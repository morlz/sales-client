<template>
<q-page class="AppContent" v-if="auth_can(1, 'Preorder')">
	<div class="OnePreorderWrapper AppContent__inner" v-if="isOne" v-loading="preorder_loadingOne">
		<info-card-preorder :content="preorder_current" v-if="auth_can(1, 'Preorder')"/>
		<info-card-contact-faces :content="preorder_current.contactFaces" allow-create v-if="auth_can(1, 'ContactFace')"/>
		<info-card-tasks :content="preorder_current.tasks" v-if="auth_can(1, 'Task')"/>

		<q-card class="files" v-if="false">
			<q-card-title>
				Прикреплённые файлы
			</q-card-title>

			<q-card-main>
				<q-uploader :url="''" />
			</q-card-main>
		</q-card>
	</div>

	<div class="CRMPreorders" v-if="!isOne && auth_can(1, 'Preorder')">
		<div
			class="CRMPreorders__horGroup AppContent__headerTabs AppContent__tabs"
			:class="{ 'CRMPreorders__horGroup-mobile': app_view_mobile }">
			<q-tabs v-model="currentTab">
				<q-tab name="all" label="Все предзаказы" slot="title"/>
				<q-tab name="new" label="Новый предзаказ" slot="title" v-if="preorder_acceptedAdd && auth_can(2, 'Preorder')"/>
			</q-tabs>

			<q-input
				v-if="currentTab == 'all'"
				inverted-light
				color="grey-2"
				v-model.number="searchByPhone"
				:value="preorder_filtersPhone"
				placeholder="Поиск по номеру телефона"
				class="CRMPreorders__phone" />
		</div>

		<q-card v-if="currentTab == 'all'" class="CRMPreorders__card AppContent__inner">
			<infinite-table
				:columns="CRMPreordersFiltred"
				:rows="preorder_cached"
				:complete="preorder_complete"
				:select-fields="local_preorders_selectFields"
				:filter-values="preorder_filters"
				@infinite="preorder_infinity"
				@click="routerGoId"
				@sort="local_record_sortChange"
				@filter="local_record_filtersChange"
			/>
		</q-card>

		<div v-if="currentTab == 'new'">
			<new-preorder-form @go-back="currentTab = 'all'"/>
		</div>
	</div>
</q-page>
</template>


<script>
// счета

//v-if="preorder_acceptedAdd && auth_can(2, 'Preorder')"

import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import { CRMPreorders } from '@/static/fieldDescription'
import { AuthMixin, RouteMixin } from '@/mixins'
import InfiniteTable from '@/components/InfiniteTable'
import FormContactFaceAdd from '@/components/forms/ContactFaceAdd'
import editContactForm from '@/components/forms/editContact'
import editTaskForm from '@/components/forms/editTask'
import newPreorderForm from '@/components/forms/newPreorder'
import InfoCardPreorder from '@/components/InfoCardPreorder'
import InfoCardContactFaces from '@/components/InfoCardContactFaces'
import InfoCardTasks from '@/components/InfoCardTasks'
import { QUploader } from 'quasar'

export default {
	data() {
		return {
			CRMPreorders,
			searchByPhone: "",
			searchByPhoneQuery: "",
			searchTimeout: false,
			currentTab: "all",
			lastFilters: {}
		}
	},
	mixins: [AuthMixin, RouteMixin],
	components: {
		InfiniteTable,
		FormContactFaceAdd,
		editContactForm,
		editTaskForm,
		InfoCardPreorder,
		InfoCardContactFaces,
		InfoCardTasks,
		newPreorderForm,
		QUploader
	},
	watch: {
		oneId (n) {
			if (this.oneId !== undefined)
				this.preorder_getOne(this.oneId)
		},
		searchByPhone (n) {
			if (this.searchTimeout)
				clearTimeout (this.searchTimeout)

			if (n && (n + '').length < 10) return
			if (n.length == 10 && n.substr(0, 1) !== '8')
				n = '8' + n

			this.searchTimeout = setTimeout(() => this.searchByPhoneQuery = n || '', 500)
		},
		async additionalFilters (n) {
			await this.preorder_filtersChange (Object.assign({}, this.lastFilters, n))
			if (this.preorder_acceptedAdd && this.auth_can(2, 'Preorder') && !this.preorder_cached.length)
				this.currentTab = 'new'
		},
		preorder_filters (n) {
			this.lastFilters = { ...n }//89165749385
		},
		currentTab (n) {
			if (n === 'new')
				this.client_select_searchByPhone(this.searchByPhone + '')
		}
	},
	computed: {
		...mapGetters([
			'preorder_cached',
			'preorder_current',
			'preorder_loadingBottom',
			'preorder_acceptedAdd',
			'preorder_loadingOne',
			'preorder_filters',
			'preorder_filtersPhone',
			'preorder_complete',
			'app_view_mobile',
			'salon_listWithAll',
			'preorder_acceptedAdd'
		]),
		additionalFilters () {
			return {
				'contactFaces.phone': this.searchByPhoneQuery + ''
			}
		},
		local_preorders_selectFields () {
			let rez = {}

			if (this.salon_listWithAll)
				rez['salon.NAME'] = {
					data: this.salon_listWithAll,
					field: "salon.NAME",
					fields: { label: "NAME", value: "ID_SALONA", output: 'salon.ID_SALONA' }
				}

			return rez
		},
		CRMPreordersFiltred () {
			let rez = this.CRMPreorders

			if (!this.auth_can(4, 'PreorderSelectSalon'))
				rez = rez.filter(el => el.field != 'salon.NAME')

			return rez
		}
	},
	methods: {
		...mapActions([,
			'preorder_infinity',
			'preorder_filtersChange',
			'preorder_sortChange',
			'preorder_init',
			'preorder_getOne',
			'client_select_searchByPhone',
			'preorder_destroy'
		]),
		...mapMutations([
			'app_layout_headerShadowSet'
		]),
		async local_record_filtersChange (n) {
			this.lastFilters = n
			await this.preorder_filtersChange (Object.assign({}, n, this.additionalFilters))
		},
		async local_record_sortChange (n) {
			await this.preorder_sortChange(n)
		}
	},
	created () {
		this.preorder_init(this.oneId)
		this.searchByPhone = this.preorder_filtersPhone
	},
	mounted () {
		this.app_layout_headerShadowSet(false)
	},
	beforeDestroy () {
		this.app_layout_headerShadowSet(true)
		this.preorder_destroy()
	}
}
</script>



<style lang="stylus">
.CRMPreorders
	width 100%
	height 100%

	&__phone
		margin 0 10px
		width 300px

	&__card
		height calc(100vh - 115px)

	&__horGroup
		display grid
		grid-auto-flow column
		justify-content space-between
		align-items center
		background #027be3

.OnePreorderWrapper
	display grid
	grid-gap 10px
	grid-template-columns 550px 1fr

	.tasks
		grid-column 1 / 3

	.info
		.el-steps
			margin-bottom 10px

	.contacts
		.buttons
			margin-top 10px

@media screen and (max-width: 1100px)
	.OnePreorderWrapper
		grid-template-columns 1fr

		.tasks
			grid-column 1 / 2

</style>
