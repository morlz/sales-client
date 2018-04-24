<template>
<q-page class="AppContent" v-if="auth_can(1, 'Preorder')">
	<div class="OnePreorderWrapper AppContent__inner" v-if="isOne" v-loading="preorder_loadingOne">
		<info-card-preorder :content="preorder_current" v-if="auth_can(1, 'Preorder')"/>
		<info-card-contact-faces :content="preorder_current.contactFaces" allow-create v-if="auth_can(1, 'ContactFace')"/>
		<info-card-tasks :content="preorder_current.tasks" v-if="auth_can(1, 'Task')"/>

		<q-card class="files">
			<q-card-title>
				Прикреплённые файлы
			</q-card-title>

			<q-card-main>
				<q-uploader :url="''" />
			</q-card-main>
		</q-card>
	</div>

	<div class="manyRecordsWrapper" v-if="!isOne">
		<div
			class="manyRecordsWrapper__horGroup AppContent__headerTabs"
			:class="{ 'manyRecordsWrapper__horGroup-mobile': app_view_mobile }">
			<q-tabs v-model="currentTab">
				<q-tab name="all" label="Все предзаказы" slot="title"/>
				<q-tab name="new" label="Новый предзаказ" slot="title"/>
			</q-tabs>

			<q-input
				v-if="currentTab == 'all'"
				inverted
				v-model="searchByPhone"
				:value="preorder_filtersPhone"
				placeholder="Поиск по номеру телефона"
				class="manyRecordsWrapper__phone" />
		</div>

		<q-card v-if="currentTab == 'all'" class="manyRecordsWrapper__card AppContent__inner">
			<!--<tabless
				key="preorders"
				:data="preorder_cached"
				:complete="preorder_complete"
				:field-description="CRMPreorders"
				:filters="preorder_filters"
				ref="table"
				@filter="local_record_filtersChange"
				@sort="local_record_sortChange"
				@click="routerGoId"
				@infinite="preorder_infinity"
			/>-->

			<infinite-table
				:columns="CRMPreorders"
				:rows="preorder_cached"
				:complete="preorder_complete"
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
import addContactForm from '@/components/forms/addContact'
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
			seachTimeout: false,
			currentTab: "all",
			lastFilters: {}
		}
	},
	mixins: [AuthMixin, RouteMixin],
	components: {
		InfiniteTable,
		addContactForm,
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
			if (this.seachTimeout) clearTimeout (this.seachTimeout)

			this.seachTimeout = setTimeout(() => { this.searchByPhoneQuery = n }, 500)
		},
		additionalFilters (n) {
			this.preorder_filtersChange (Object.assign({}, n, this.lastFilters))
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
			'app_view_mobile'
		]),
		additionalFilters () {
			return {
				'contactFaces.phone': this.searchByPhoneQuery
			}
		},
	},
	methods: {
		...mapActions([,
			'preorder_infinity',
			'preorder_filtersChange',
			'preorder_sortChange',
			'preorder_init',
			'preorder_getOne'
		]),
		...mapMutations([
			'preorder_destroy',
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



<style lang="less" scoped>
.addForm {
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(auto-fit, minmax(450px, auto));
    h2 {
        margin-left: 20px;
    }
	padding-bottom: 10px;
}

.manyRecordsWrapper {
	width: 100%;
	height: 100%;

	&__phone {
		margin: 0 10px;
		width: 300px;
	}

	&__card {
		height: ~"calc(100vh - 115px)";
	}

	&__horGroup {
		display: grid;
		grid-auto-flow: column;
		justify-content: space-between;
		align-items: center;
		background: #027be3;
	}
}

.OnePreorderWrapper {
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 1fr 1fr;
	.tasks, .files {
		grid-column: ~"1 / 3";
	}

	.info {
		.el-steps {
			margin-bottom: 10px;
		}
	}

	.contacts {
		.buttons {
			margin-top: 10px;
		}
	}
}

@media screen and (max-width: 1250px) {
	.OnePreorderWrapper {
		grid-template-columns: 1fr;
		.tasks, .files {
			grid-column: ~"1 / 2";
		}
	}
}

</style>
