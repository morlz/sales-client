<template>
<div class="mainWrapper furnitureNewWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Мебель</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/furniture/new` }">Заказать изготовление</el-breadcrumb-item>
	</el-breadcrumb>

	<div class="newFurnitureForm">
		<el-container>
			<el-aside width="200px" class="steps" align-center>
				<el-steps direction="vertical" :active="furniture_new_active.currentStep" finish-status="success">
					<el-step title="Модель" />
					<el-step title="Тип" />
					<el-step title="Декор" />
					<el-step title="Ткани" />
					<el-step title="Дополнительная информация" description="Примечание, количество и цена" />
					<el-step title="Новый заказ" />
				</el-steps>
			</el-aside>
			<el-main>
				<el-form label-position="top">
					<el-form-item label="Модель">
						<el-select v-model="model" :disabled="furniture_new_active.model" filterable v-loading="furniture_new_loading.models">
							<el-option v-for="item, index in furniture_new_cached.models" :value="item.ITEMID" :label="item.ITEMNAME" :key="index" />
						</el-select>
					</el-form-item>

					<el-form-item label="Тип">
						<el-select v-model="type" :disabled="furniture_new_active.type" v-loading="furniture_new_loading.types" :multiple="furniture_new_freeTrim">
							<el-option v-for="item, index in furniture_new_cached.types" :value="furniture_new_freeTrim ? item.CRSEACHNAME : item.NAME" :label="item.NAME.substr(0, 80)" :key="index" />
						</el-select>
					</el-form-item>

					<el-form-item label="Категория" v-loading="furniture_new_loading.cat">
						<el-input :value="123" disabled />
					</el-form-item>

					<el-form-item label="Декор">
						<el-select v-model="dekor" :disabled="furniture_new_active.dekor" v-loading="furniture_new_loading.dekor">
							<el-option v-for="item, index in furniture_new_cached.dekor" :value="item.CONFIGID" :label="item.CONFIGID" :key="index" />
						</el-select>
					</el-form-item>

					<el-form-item label="Ткани">
						<div class="cloth">
							<el-select
								v-model="cloth1"
								:disabled="furniture_new_active.cloth[1]"
								:loading="furniture_new_loading.cloth[1]"
								remote
								filterable
								:remote-method="searchCloth1">
								<el-option v-for="item, index in furniture_new_cached.cloth[1]" :value="item.name" :key="index">
									<span v-html="clothLabel(item)"/>
								</el-option>
							</el-select>

							<el-select
								v-model="cloth2"
								:disabled="furniture_new_active.cloth[2]"
								:loading="furniture_new_loading.cloth[2]"
								remote
								filterable
								:remote-method="searchCloth2">
								<el-option v-for="item, index in furniture_new_cached.cloth[2]" :value="item.name" :key="index">
									<span v-html="clothLabel(item)"/>
								</el-option>
							</el-select>

							<el-select
								v-model="cloth3"
								:disabled="furniture_new_active.cloth[3]"
								:loading="furniture_new_loading.cloth[3]"
								remote
								filterable
								:remote-method="searchCloth3">
								<el-option v-for="item, index in furniture_new_cached.cloth[3]" :value="item.name" :key="index">
									<span v-html="clothLabel(item)"/>
								</el-option>
							</el-select>
						</div>
					</el-form-item>

					<el-form-item label="Примечание">
						<el-input :value="123" />
					</el-form-item>

					<el-form-item label="Количество">
						<el-input :value="123" />
					</el-form-item>

					<div class="priceGroup">
						<el-form-item label="Цена">
							<el-input :value="123" />
						</el-form-item>

						<el-form-item label="Цена оптовая">
							<el-input :value="123" disabled />
						</el-form-item>
					</div>

					<el-form-item>
						<el-button type="primary">Создать</el-button>
					</el-form-item>
				</el-form>
			</el-main>
		</el-container>


	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

export default {
	data() {
		return {}
	},
	components: {

	},
	watch: {

	},
	computed: {
		...mapGetters([
			'furniture_new_loading',
			'furniture_new_cached',
			'furniture_new_selected',
			'furniture_new_active',
			'furniture_new_freeTrim',
		]),
		model: {
			get () {
				return this.furniture_new_selected.model
			},
			set (n) {
				this.furniture_new_modelSelect(n)
			}
		},
		type: {
			get () {
				return this.furniture_new_selected.type
			},
			set (n) {
				this.furniture_new_typeSelect(n)
			}
		},
		dekor: {
			get () {
				return this.furniture_new_selected.dekor
			},
			set (n) {
				this.furniture_new_dekorSelect(n)
			}
		},
		cloth1: {
			get () {
				return this.furniture_new_selected.cloth[1]
			},
			set (data) {
				this.furniture_new_clothSelect({ index: 1, data })
			}
		},
		cloth2: {
			get () {
				return this.furniture_new_selected.cloth[2]
			},
			set (data) {
				this.furniture_new_clothSelect({ index: 2, data })
			}
		},
		cloth3: {
			get () {
				return this.furniture_new_selected.cloth[3]
			},
			set (data) {
				this.furniture_new_clothSelect({ index: 3, data })
			}
		},
	},
	methods: {
		...mapActions([
			'furniture_new_modelSelect',
			'furniture_new_typeSelect',
			'furniture_new_dekorSelect',
			'furniture_new_init',
			'furniture_new_clothSearch'
		]),
		...mapMutations([
			'furniture_new_clothSelect'
		]),
		searchCloth1 (data) {
			this.furniture_new_clothSearch({ index: 1, data })
		},
		searchCloth2 (data) {
			this.furniture_new_clothSearch({ index: 2, data })
		},
		searchCloth3 (data) {
			this.furniture_new_clothSearch({ index: 3, data })
		},
		clothLabel (item) {
			let status

			if (item.StatusActive == 1)
				status = `<div class="statusRED">${item.cStatus ? 'Не используется' : 'Отсутствует'}</div>`

			status = status || item.KAT

			return `${item.name} [${status}]`;
		}
	},
	mounted () {
		this.furniture_new_init()
	}
}
</script>


<style lang="less">
.furnitureNewWrapper {
	.newFurnitureForm {
		//max-width: 700px;
		.steps {
			padding: 30px 10px 120px 10px;
		}
		.el-select {
			width: 100%;
		}
		.cloth {
			display: grid;
			grid-auto-flow: row;
			grid-gap: 20px;
		}
		.priceGroup {
			display: grid;
			grid-auto-flow: column;
			grid-gap: 20px;
		}
	}
}
.statusRED {
	display: inline;
	color: red;
}
</style>
