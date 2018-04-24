<template>
<q-page class="AppContent">
	<div class="FurnitureStorage">
		<q-tabs v-model="currentTab" class="AppContent__headerTabs" v-if="tabs.length > 1">
			<q-tab v-for="tab, index in tabs" :name="tab.type" :label="tab.name" :key="index" slot="title"/>
		</q-tabs>

		<furniture-models-wrap
			class="AppContent__inner"
			:current="storage_filters.MODEL"
			:loading="storage_loadingModels"
			:models="storage_models"
			@select="local_storage_filtersModelSet" >

			<q-card class="FurnitureStorage__items">
				<!--
				<tabless
					key="storage"
					:data="storage_cached"
					:complete="storage_complete"
					:field-description="FurnitureStorageFiltred"
					:filters="storage_filters"
					:select-fields="local_storage_selectFields"
					ref="table"
					@filter="local_storage_filterChange"
					@sort="local_storage_sortChange"
					@click="rowClickHandler"
					@select="local_storage_handleFieldSelect"
					@infinite="storage_infinity"
				>
					<template slot="cloth1" slot-scope="props">
						<preview-cloth :content="props.row.cloth1" v-if="props.row.cloth1" inline width="120px"/>
						<template v-if="!props.row.cloth1">{{ props.row.TKAN }}</template>
					</template>

					<template slot="cloth2" slot-scope="props">
						<preview-cloth :content="props.row.cloth2" v-if="props.row.cloth2" inline width="120px"/>
						<template v-if="!props.row.cloth2">{{ props.row.KOMP }}</template>
					</template>

					<template slot="cloth3" slot-scope="props">
						<preview-cloth :content="props.row.cloth3" v-if="props.row.cloth3" inline width="120px"/>
						<template v-if="!props.row.cloth3">{{ props.row.KOMP1 }}</template>
					</template>

					<template slot="buttons" slot-scope="props">
						<q-btn color="primary" flat @click.stop="storage_addToCart({ UN: props.row.UN })">
							<q-icon name="shopping_cart"/>
						</q-btn>
					</template>
				</tabless>
			-->


				<infinite-table
					:columns="FurnitureStorageFiltred"
					:rows="storage_cached"
					:complete="storage_complete"
					@infinite="storage_infinity"
					@click="rowClickHandler"
					@sort="local_storage_sortChange"
					@filter="local_storage_filterChange"
					>

					<template slot="buttons" slot-scope="props">
						<i aria-hidden="true" class="q-icon material-icons" v-if="auth_can(2, 'Cart')" @click.stop="storage_addToCart({ UN: props.row.UN })">shopping_cart</i>
					</template>
				</infinite-table>
			</q-card>
		</furniture-models-wrap>
	</div>
</q-page>
</template>



<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'
import InfiniteTable from '@/components/InfiniteTable'
import furnitureModelsSwitch from '@/components/furnitureModelsSwitch'
import furnitureModelsWrap from '@/components/furnitureModelsWrap'
import PreviewCloth from '@/components/PreviewCloth'
import { FurnitureStorage } from '@/static/fieldDescription'

export default {
	components: {
		InfiniteTable,
		furnitureModelsSwitch,
		furnitureModelsWrap,
		PreviewCloth,
	},
	mixins: [AuthMixin],
	data() {
		return {
			FurnitureStorage,
			lastStorageFilters: {},
			currentTab: 'sgp'
		}
	},
	watch: {
		async additionalFilters (n) {
			await this.storage_filtersChange (Object.assign({}, this.lastStorageFilters, n))
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
			'storage_complete',
			'main_auth_settings'
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
		FurnitureStorageFiltred () {
			if (this.main_auth_settings.showModels)
				return this.FurnitureStorage.filter(el => el.field != 'MODEL')
			return this.FurnitureStorage
		},
		tabs () {
			let res = [{ name: "СГП", type: "sgp" }]

			if (this.auth_can(1, 'StorageInternet'))
				res.push({ name: "Интернет", type: "internet" })

			if (this.auth_can(1, 'StorageEComerce'))
				res.push({ name: "e-commerce", type: "e" })

			return res
		}
	},
	methods: {
		...mapActions([
			'storage_init',
			'storage_sortChange',
			'storage_filtersChange',
			'storage_infinity',
			'storage_getModels',
			'storage_getOne',
			'storage_addToCart',
		]),
		...mapMutations([
			'app_layout_headerShadowSet',
			'storage_destroy'
		]),
		async local_storage_filterChange (n) {
			this.lastStorageFilters = n
			await this.storage_filtersChange (Object.assign({}, this.additionalFIlters, n))
		},
		async local_storage_sortChange (n) {
			await this.storage_sortChange (n)
		},
		local_storage_filtersModelSet (MODEL) {
			if (MODEL == 'Все модели') MODEL = ""
			let filters = { ...this.storage_filters, MODEL, type: this.storage_type }
			this.local_storage_filterChange(filters)
		},
		local_storage_handleFieldSelect (data) {
			if (data.field != 'td.salon.NAME') return
			this.storage_getModels({ filters: { 'td.salon.ID_SALONA': data.value }, type: this.storage_type })
		},
		rowClickHandler (e, item) {
			this.$router.push(`/furniture/salon/${item.UN}`)
		}
	},
	async mounted () {
		this.app_layout_headerShadowSet(this.tabs.length < 2)
		await this.storage_init()
	},
	beforeDestroy() {
		this.app_layout_headerShadowSet(true)
		this.storage_destroy()
	}
}
</script>



<style lang="stylus">
.FurnitureStorage
	&__items
		width 100%
		height calc(100vh - 120px)
</style>
