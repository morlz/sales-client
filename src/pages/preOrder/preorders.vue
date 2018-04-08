<template>
<div class="AppContent" v-if="auth_can(1, 'Preorder')">
	<div class="oneRecordWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: `/preorder/preorders` }">Список предзаказов</router-link></li>
			<li><router-link :to="{ path: `/preorder/preorders/${oneId}` }">Предзаказ №{{oneId}}</router-link></li>
		</ul>

		<el-form class="cards" v-loading="preorder_loadingOne">
			<preorder-info :content="preorder_current" v-if="auth_can(1, 'Preorder')"/>
			<contact-faces :content="preorder_current.contactFaces" allowCreate v-if="auth_can(1, 'ContactFace')"/>
			<tasks :content="preorder_current.tasks" v-if="auth_can(1, 'Task')"/>

			<el-card class="files">
				<h2 slot="header">Прикреплённые файлы</h2>

				<el-upload action="">
					<el-button type="primary">Загрузить файл</el-button>
				</el-upload>
			</el-card>
		</el-form>
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
				inverted
				v-model="searchByPhone"
				:value="preorder_filtersPhone"
				placeholder="Поиск по номеру телефона"
				class="manyRecordsWrapper__phone"
				v-if="currentTab == 'all'" />
		</div>

		<q-card v-if="currentTab == 'all'" class="manyRecordsWrapper__card">
			<tabless
				key="preorders"
				:data="preorder_cached"
				:complete="preorder_complete"
				:field-description="recordsManyFieldDescription"
				:filters="preorder_filters"
				ref="table"
				@filter="local_record_filtersChange"
				@sort="local_record_sortChange"
				@click="routerGoId"
				@infinite="preorder_infinity"
			/>
		</q-card>

		<div v-if="currentTab == 'new'">
			<new-preorder-form @go-back="currentTab = 'all'"/>
		</div>
	</div>
</div>
</template>


<script>
// счета

//v-if="preorder_acceptedAdd && auth_can(2, 'Preorder')"

import fieldDescription from '@/static/fieldDescription'

let {
	recordsManyFieldDescription
} = fieldDescription

import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'
import mixins from '@/mixins'
import tabless from '@/components/tableSSNew.vue'
import addContactForm from '@/components/forms/addContact.vue'
import editContactForm from '@/components/forms/editContact.vue'
import editTaskForm from '@/components/forms/editTask.vue'
import newPreorderForm from '@/components/forms/newPreorder.vue'
import InfiniteLoading from 'vue-infinite-loading'

import preorderInfo from '@/components/preorder/preorderInfo.vue'
import contactFaces from '@/components/preorder/contactFaces.vue'
import tasks from '@/components/preorder/tasks.vue'

import { QTabs, QTab, QInput, QCard } from 'quasar'

export default {
	data() {
		return {
			recordsManyFieldDescription,
			searchByPhone: "",
			searchByPhoneQuery: "",
			seachTimeout: false,
			currentTab: "all",
			lastFilters: {}
		}
	},
	mixins: [mixins],
	components: {
		tabless,
		InfiniteLoading,
		addContactForm,
		editContactForm,
		editTaskForm,
		preorderInfo,
		contactFaces,
		tasks,
		newPreorderForm,
		QTabs,
		QTab,
		QInput,
		QCard
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

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
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

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		async local_record_sortChange (n) {
			await this.preorder_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		this.app_layout_headerShadowSet(false)
		this.preorder_init(this.oneId)
		this.searchByPhone = this.preorder_filtersPhone
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

.oneRecordWrapper {
	.cards {
		display: grid;
		grid-gap: 20px;
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
}

@media screen and (max-width: 1250px) {
	.oneRecordWrapper {
		.cards {
			grid-template-columns: 1fr;
			.tasks, .files {
				grid-column: ~"1 / 2";
			}
		}
	}
}

</style>
