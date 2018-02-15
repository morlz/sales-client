<template>
<div class="mainWrapper" v-if="auth_can(1, 'Preorder')">
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
		<ul class="breadcrumb bc">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: `/preorder/preorders` }">Список предзаказов</router-link></li>
		</ul>


		<el-input v-model="searchByPhone" :value="preorder_filtersPhone" placeholder="Поиск по номеру телефона" class="searchByPhone" v-if="currentTab == '0'" />
		<el-tabs tab-position="top" v-model="currentTab" key="preordersTabs" class="manyRecordsTabs">
			<el-tab-pane label="Все предзаказы" key="1">
				<tabless
					key="preorders"
					ref="table"
					:data="data"
					:fieldDescription="recordsManyFieldDescription"
					:key="1"
					:filters="preorder_filters"
					:localSort="false"
					@onClick="routerGoId"
					@filter="localRecordFilterChange"
					@sortChange="localRecordSortChange"
				/>
				<infinite-loading @infinite="preorder_infinity" ref="infiniteLoading">
					<div class="end" slot="no-results" />
					<div class="end" slot="no-more" />
					<div class="spinner" slot="spinner" v-loading="preorder_loadingBottom" />
				</infinite-loading>

			</el-tab-pane>

			<el-tab-pane label="Новый предзаказ" key="2">
				<new-preorder-form @goBack="currentTab = '0'"/>
			</el-tab-pane>
		</el-tabs>
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
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS.vue'
import addContactForm from '@/components/forms/addContact.vue'
import editContactForm from '@/components/forms/editContact.vue'
import editTaskForm from '@/components/forms/editTask.vue'
import newPreorderForm from '@/components/forms/newPreorder.vue'
import InfiniteLoading from 'vue-infinite-loading'

import preorderInfo from '@/components/preorder/preorderInfo.vue'
import contactFaces from '@/components/preorder/contactFaces.vue'
import tasks from '@/components/preorder/tasks.vue'


export default {
	data() {
		return {
			recordsManyFieldDescription,
			searchByPhone: "",
			searchByPhoneQuery: "",
			seachTimeout: false,
			currentTab: "0",
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
		newPreorderForm
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
			'preorder_filtersPhone'
		]),
		data() {
			return this.preorder_cached
		},
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
		localRecordFilterChange (n) {
			this.lastFilters = n
			this.preorder_filtersChange (Object.assign({}, n, this.additionalFilters))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localRecordSortChange (n) {
			this.preorder_sortChange(n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		this.preorder_init(this.oneId)
		this.searchByPhone = this.preorder_filtersPhone
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
	display: grid;
	grid-template: "bc search";
	> * {
		grid-column: ~"1 / 3";
	}
	.bc {
		grid-area: bc;
	}
	.searchByPhone {
		grid-area: search;
		justify-self: end;
		width: 300px;
		margin: 5px;
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
