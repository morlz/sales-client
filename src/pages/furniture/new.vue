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

						<el-select
							v-model="type"
							v-loading="furniture_new_loading.types"
							v-if="!furniture_new_freeTrim"
							:disabled="furniture_new_active.type">

							<el-option v-for="item, index in furniture_new_cached.types"
								:value="item.NAME"
								:label="item.NAME.substr(0, 80)"
								:key="index" />

						</el-select>

						<palermo-construct-form
							v-model="type"
							v-loading="furniture_new_loading.types"
							v-if="furniture_new_freeTrim"
							:disabled="furniture_new_active.type"
							:data="furniture_new_cached.types" />

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
							<cloth-select-form v-model="cloth1" :index="1" :disabled="furniture_new_active.cloth[1]" />
							<cloth-select-form v-model="cloth2" :index="2" :disabled="furniture_new_active.cloth[2]" />
							<cloth-select-form v-model="cloth3" :index="3" :disabled="furniture_new_active.cloth[3]" />
						</div>
					</el-form-item>

					<el-form-item label="Примечание">
						<el-input v-model="sign" type="textarea" :disabled="furniture_new_active.sign" placeholder="Формат ввода отреза x.y м., где x - метры, y - сантиметры" />
					</el-form-item>

					<el-form-item label="Количество">
						<el-input-number v-model.number="count" :disabled="furniture_new_active.count" />
					</el-form-item>

					<div class="priceGroup">
						<el-form-item label="Цена">
							<el-input v-model.number="price" :disabled="furniture_new_active.price" />
						</el-form-item>

						<el-form-item label="Цена оптовая">
							<el-input :value="furniture_new_cached.opt" disabled />
						</el-form-item>
					</div>

					<el-form-item>
						<el-button type="primary" :disabled="furniture_new_active.button">Создать</el-button>
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

import clothSelectForm from '@/components/forms/clothSelect.vue'
import palermoConstructForm from '@/components/forms/palermoConstruct.vue'

export default {
	data() {
		return {}
	},
	components: {
		clothSelectForm,
		palermoConstructForm
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
		sign: {
			get () {
				return this.furniture_new_selected.sign
			},
			set (n) {
				this.furniture_new_signSet(n)
			}
		},
		count: {
			get () {
				return this.furniture_new_selected.count
			},
			set (n) {
				this.furniture_new_countSet(n)
			}
		},
		price: {
			get () {
				return this.furniture_new_selected.price
			},
			set (n) {
				this.furniture_new_priceSet(n)
			}
		}
	},
	methods: {
		...mapActions([
			'furniture_new_modelSelect',
			'furniture_new_typeSelect',
			'furniture_new_dekorSelect',
			'furniture_new_init',
			'furniture_new_clothSelect'
		]),
		...mapMutations([
			'furniture_new_signSet',
			'furniture_new_countSet',
			'furniture_new_priceSet'
		]),
		local_furniture_new_clothSelect2 (data) {
			this.furniture_new_clothSelect({ index: 2, data })
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
			grid-auto-flow: column;
			grid-gap: 20px;
			align-items: center;
			justify-content: start;
			margin-bottom: 40px;
		}
		.priceGroup {
			display: grid;
			grid-auto-flow: column;
			grid-gap: 20px;
		}
	}
}

</style>
