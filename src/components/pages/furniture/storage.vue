<template>
<div class="mainWrapper">
	<div class="oneStorageWrapper" v-if="isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/salon' }">На складе</router-link></li>
			<li><router-link :to="{ path: `/furniture/storage/${storage_current.ID}` }">{{ storage_current.ID }}</router-link></li>
		</ul>

		<div class="cards" v-loading="storage_loadingOne">
			<el-card class="card">
				<div class="title" slot="header">Основная информация</div>

				<div class="infoGrid">
					<div>Уч №</div>
					<div>{{ storage_current.UCH_N }}</div>
					<div>Фаб.н.</div>
					<div>{{ storage_current.UN }}</div>
					<div>Тип</div>
					<div>{{ storage_current.TIP }}</div>
					<div>Ткань 1</div>
					<div>{{ storage_current.TKAN }}</div>
					<div>Ткань 2</div>
					<div>{{ storage_current.cKOMP }}</div>
					<div>Ткань 3</div>
					<div>{{ storage_current.KOMP1 }}</div>
					<div>Кат</div>
					<div>{{ storage_current.KAT }}</div>
					<div>Примечание</div>
					<div>{{ storage_current.COMMENT }}</div>
					<div>Декор</div>
					<div>{{ storage_current.DEKOR }}</div>
					<div>Стежка</div>
					<div>{{ storage_current.stegka }}</div>
					<div>Акция</div>
					<div>{{ storage_current.NAKC }}</div>
					<div>Сост.</div>
					<div>{{ storage_current.Sostoynie }}</div>
					<div>Цех</div>
					<div>{{ storage_current.DATE_CEX }}</div>
					<div class="lc">Номер заказа</div>
					<div class="lc">{{ storage_current.cNDOC }}</div>
				</div>

				<div class="buttons">
					<q-btn color="primary">Добавить в корзину</q-btn>
				</div>
			</el-card>
		</div>
	</div>


	<div class="manyStorageWrapper" v-if="!isOne">
		<ul class="breadcrumb">
			<li><router-link :to="{ path: '/' }">Главная</router-link></li>
			<li><router-link :to="{ path: '/' }">Мебель</router-link></li>
			<li><router-link :to="{ path: '/furniture/salon' }">На складе</router-link></li>
		</ul>

		<furniture-models-switch/>

		<q-tabs v-model="currentTab" inverted>
			<q-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title"/>
		</q-tabs>

		<furniture-models-wrap :current="storage_filters.MODEL" @select="local_storage_filtersModelSet" :models="storage_models" :loading="storage_loadingModels">
			<tabless
				v-loading="storage_loading"
				key="storage"
				:data="storage_cached"
				:fieldDescription="storageFieldDescriptionFiltred"
				:filters="storage_filters"
				:select-fields="local_storage_selectFields"
				ref="table"
				@filter="local_storage_filterChange"
				@sortChange="local_storage_sortChange"
				@onClick="routerGoId"
			/>

			<infinite-loading @infinite="storage_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="storage_loadingBottom" />
			</infinite-loading>
		</furniture-models-wrap>
	</div>
</div>
</template>



<script>



import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import tabless from '@/components/tableSS'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import InfiniteLoading from 'vue-infinite-loading'
import fieldDesription from '@/static/fieldDescription'
import { QTab, QTabs, QBtn } from 'quasar'


let {
	storageFieldDescription
} = fieldDesription



export default {
	components: {
		tabless,
		InfiniteLoading,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		QTab,
		QTabs,
		QBtn
	},
	mixins: [mixins],
	data() {
		return {
			storageFieldDescription,
			lastStorageFilters: {},
			currentTab: 'sgp',
			tabs: [
				{ name: "СГП", type: "sgp" },
				{ name: "Интернет", type: "internet" },
				{ name: "e-commerce", type: "e" },
			]
		}
	},
	watch: {
		additionalFilters (n) {
			this.storage_filtersChange (Object.assign({}, this.lastStorageFilters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		oneId (n) {
			if (n != undefined)
				this.storage_getOne(n)
		},
		storage_type (n) {
			this.storage_getModels({ salon: this.lastStorageFilters.ID_SALONA, type: n })
		}
	},
	computed: {
		...mapGetters([
			'storage_loadingModels',
			'storage_loadingBottom',
			'storage_loadingOne',
			'storage_loading',
			'storage_cached',
			'storage_current',
			'storage_filters',
			'storage_models',
			'storage_type',
			'auth_settings'
		]),
		additionalFilters () {
			return { type: this.currentTab }
		},
		local_storage_selectFields () {
			let rez = []
			if (this.storage_models)
				rez.push({ data: this.storage_models, field: "MODEL", fields: { label: "MODEL" }, filterable: true })

			return rez
		},
		storageFieldDescriptionFiltred () {
			if (this.auth_settings.showModels)
				return this.storageFieldDescription.filter(el => el.field != 'MODEL')
			return this.storageFieldDescription
		},
	},
	methods: {
		...mapActions([
			'storage_init',
			'storage_sortChange',
			'storage_filtersChange',
			'storage_infinity',
			'storage_getModels',
			'storage_getOne',
		]),
		local_storage_filterChange (n) {
			this.lastStorageFilters = n
			this.storage_filtersChange (Object.assign({}, this.additionalFIlters, n))

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_storage_sortChange (n) {
			this.storage_sortChange (n)

			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		local_storage_filtersModelSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = ""
			let filters = { ...this.storage_filters, MODEL, type: this.storage_type }
			this.local_storage_filterChange(filters)
		}
	},
	mounted () {
		this.storage_init(this.oneId)
	}
}
</script>



<style lang="less">
	.oneStorageWrapper {
		.el-main {
			padding: 0;
		}
		.buttons {
			margin: 0 0 10px 0;
		}
		.cards {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}
	.manyStorageWrapper {
		width: 100%;
	}
	@media screen and (max-width: 1250px) {
		.oneStorageWrapper {
			.cards {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
