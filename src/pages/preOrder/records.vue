<template>
<div class="mainWrapper">
	<div class="oneRecordWrapper" v-if="isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/records' }">Список предзаказов</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: `/preorder/records/${oneId}` }">Предзаказ №{{oneId}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-form class="cards" v-loading="oneLoadingRecord">
			<preorder-info :content="currentRecord"/>
			<contact-faces :content="currentRecord.contactFaces" allowCreate/>
			<tasks :content="currentRecord.tasks"/>

			<el-card class="files">
				<h2 slot="header">Прикреплённые файлы</h2>

				<el-upload
					action="fileUploadUrl"
				>
					<el-button type="primary">Загрузить файл</el-button>
				</el-upload>
			</el-card>
		</el-form>
	</div>

	<div class="manyRecordsWrapper" v-if="!isOne">
		<el-breadcrumb separator="/" class="bc">
			<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/preorder/records' }">Список предзаказов</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs tab-position="top" v-model="currentTab">
			<el-tab-pane label="Все предзаказы">
				<el-input v-model="searchByPhone" placeholder="Поиск по номеру телефона" class="searchByPhone" />
				<tabless
					key="records"
					:data="data"
					:fieldDescription="recordsManyFieldDescription"
					:key="1"
					@onClick="routerGoId"
					ref="table"
					@filter="localRecordFilterChange"
					@sortChange="localRecordSortChange"
				/>
				<infinite-loading @infinite="recordsInfinity" ref="infiniteLoading">
					<div class="end" slot="no-results" />
					<div class="end" slot="no-more" />
					<div class="spinner" slot="spinner" v-loading="loadingBottomRecords" />
				</infinite-loading>

			</el-tab-pane>

			<el-tab-pane label="Новый предзаказ" v-if="newPreorderAccepted">
				<new-preorder-form @goBack="currentTab = '0'"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</div>
</template>


<script>
// счета


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
			seachTimeout: false,
			currentTab: "0"
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
		oneId () {
			if (this.oneId !== undefined) {
				this.getOneRecord(this.oneId)
			} else {
				//this.getAllRecords()
			}
		},
		searchByPhone (n) {
			if (this.seachTimeout) clearTimeout (this.seachTimeout)

			this.seachTimeout = setTimeout(() => {
				this.updateRecordsSearchByPhoneQuery(n)
				this.changeRecordsLastOffset()
				this.recordsCacheClear()

				this.$nextTick(() => {
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				})
			}, 500)
		}
	},
	computed: {
		...mapGetters([
			'cachedRecords',
			'currentRecord',
			'loadingBottomRecords',
			'fileUploadUrl',
			'newPreorderAccepted',
			'oneLoadingRecord'
		]),
		data() {
			return this.cachedRecords
		}
	},
	methods: {
		...mapActions([
			'getOneRecord',
			'recordsInfinity',
			'recordsFiltersChange',
			'recordsSortChanged',
			'recordsCacheClear',
		]),
		...mapMutations([
			'updateRecordsSearchByPhoneQuery',
			'changeRecordsLastOffset'
		]),
		localRecordFilterChange (n) {
			this.recordsFiltersChange (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		localRecordSortChange (n) {
			this.recordsSortChanged (n)

			this.$nextTick(() => {
			  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	mounted() {
		if (this.oneId !== undefined) {
			this.getOneRecord(this.oneId)
		} else {
			//this.getAllRecords()
		}
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
	.searchByPhone {
		width: 300px;
		margin: 5px;
	}
}
.oneRecordWrapper {
	.cards {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: 550px 1fr;
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
