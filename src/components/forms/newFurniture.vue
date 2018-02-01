<template>
	<div class="newFurnitureFormWrapper cards">
		<el-card class="card newFurnitureForm">
			<div class="title" slot="header">Конфигурация</div>

			<div class="mainForm">
				<el-form label-position="top">
					<el-steps direction="vertical" :active="furniture_new_active.currentStep" finish-status="success">
						<el-step title="Модель">
							<el-form-item slot="description">
								<el-select v-model="model" :disabled="furniture_new_active.model" filterable v-loading="furniture_new_loading.models">
									<el-option v-for="item, index in furniture_new_cached.models" :value="item.ITEMID" :label="item.ITEMNAME" :key="index" />
								</el-select>
							</el-form-item>
						</el-step>

						<el-step title="Тип">
							<el-form-item slot="description">
								<el-select
									v-model="type"
									v-loading="furniture_new_loading.types"
									v-if="!furniture_new_freeTrim"
									:disabled="furniture_new_active.type">

									<el-option v-for="item, index in furniture_new_cached.types"
										:value="item.CONFIGID"
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
						</el-step>
						<el-step title="Декор">
							<el-form-item slot="description">
								<el-select v-model="dekor" :disabled="furniture_new_active.dekor" v-loading="furniture_new_loading.dekor">
									<el-option v-for="item, index in furniture_new_cached.dekor" :value="item.CONFIGID" :label="item.CONFIGID" :key="index" />
								</el-select>
							</el-form-item>
						</el-step>
						<el-step title="Ткани">
							<el-form-item slot="description">
								<div class="cloth">
									<cloth-select-form v-model="cloth0" :index="0" :disabled="furniture_new_active.cloth[0]" />
									<cloth-select-form v-model="cloth1" :index="1" :disabled="furniture_new_active.cloth[1]" />
									<cloth-select-form v-model="cloth2" :index="2" :disabled="furniture_new_active.cloth[2]" />
								</div>
							</el-form-item>
						</el-step>
						<el-step title="Дополнительная информация" description="Примечание, количество и цена">
							<div slot="description">
								<el-form-item label="Примечание">
									<el-input v-model="sign" type="textarea" :disabled="furniture_new_active.sign" placeholder="Формат ввода отреза x.y м., где x - метры, y - сантиметры" />
								</el-form-item>

								<el-form-item label="Количество">
									<el-input-number v-model.number="count" :disabled="furniture_new_active.count" />
								</el-form-item>
							</div>
						</el-step>
					</el-steps>
				</el-form>
			</div>
		</el-card>

		<el-card class="card additioal">
			<div class="title" slot="header">Информация</div>

			<div class="images" v-if="!furniture_new_active.gallery">
				<gallery :content="furniture_new_cachedImages"/>
			</div>

			<div class="blank">
				<el-form>
					<div class="priceGroup" :class="{disabled: furniture_new_active.price}">
						<div>Категория</div>
						<div class="price" v-loading="furniture_new_loading.cat">
							{{
								furniture_new_modelCunning ?
									furniture_new_cunningCatSofa
								:	furniture_new_cached.cloth[furniture_new_normalMaxIndex].code
							}}
						</div>
						<div>Цена</div>
						<div class="price" v-loading="furniture_new_loading.price">{{ price }}</div>
						<div>Цена оптовая</div>
						<div class="price" v-loading="furniture_new_loading.price">{{ furniture_new_cached.opt }}</div>
					</div>

					<el-form-item>
						<el-button type="primary" :disabled="furniture_new_active.button" @click="furniture_new_addToCart">Создать</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
//<el-step title="Новый заказ" />
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import clothSelectForm from '@/components/forms/clothSelect.vue'
import palermoConstructForm from '@/components/forms/palermoConstruct.vue'
import gallery from '@/components/gallery.vue'

export default {
	data() {
		return {}
	},
	components: {
		clothSelectForm,
		palermoConstructForm,
		gallery
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
			'furniture_new_cachedImages',
			'furniture_new_modelCunning',
			'furniture_new_cunningCatSofa',
			'furniture_new_normalMaxIndex'
		]),

		/*
		 *		models for store
		 */

		model: {
			get () { return this.furniture_new_selected.model },
			set (n) { this.furniture_new_modelSelect(n) }
		},
		type: {
			get () { return this.furniture_new_selected.type },
			set (n) { this.furniture_new_typeSelect(n) }
		},
		dekor: {
			get () { return this.furniture_new_selected.dekor },
			set (n) { this.furniture_new_dekorSelect(n) }
		},
		cloth0: {
			get () { return this.furniture_new_selected.cloth[0] },
			set (data) { this.furniture_new_clothSelect({ index: 0, data }) }
		},
		cloth1: {
			get () { return this.furniture_new_selected.cloth[1] },
			set (data) { this.furniture_new_clothSelect({ index: 1, data }) }
		},
		cloth2: {
			get () { return this.furniture_new_selected.cloth[2] },
			set (data) { this.furniture_new_clothSelect({ index: 2, data }) }
		},
		sign: {
			get () { return this.furniture_new_selected.sign },
			set (n) { this.furniture_new_signSet(n) }
		},
		count: {
			get () { return this.furniture_new_selected.count },
			set (n) { this.furniture_new_countSet(n) }
		},
		price: {
			get () { return this.furniture_new_selected.price },
			set (n) { this.furniture_new_priceSet(n) }
		}
	},
	methods: {
		...mapActions([
			'furniture_new_modelSelect',
			'furniture_new_typeSelect',
			'furniture_new_dekorSelect',
			'furniture_new_init',
			'furniture_new_clothSelect',
			'furniture_new_addToCart'
		]),
		...mapMutations([
			'furniture_new_signSet',
			'furniture_new_countSet',
			'furniture_new_priceSet'
		])
	},
	mounted () {
		this.furniture_new_init()
	}
}
</script>


<style lang="less">
.newFurnitureFormWrapper {
	display: grid;
	grid-template-columns: minmax(0, 500px) 1fr;
	grid-gap: 20px;

	.newFurnitureForm {
		.el {
			&-step {
				&__description {
					padding: 10px;
				}
			}

			&-select {
				width: 100%;
			}
		}
		.cloth {
			display: flex;
			justify-content: flex-start;
			flex-flow: row wrap;
			> div {
				margin: 30px 10px;
			}
			margin-bottom: 40px;
		}
		.mainForm {
			max-width: 450px;
		}
	}
	.additioal {
		.image {
			img {
				width: 100%;
			}
		}
		.priceGroup {
			font-size: 23px;
			padding: 20px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			justify-content: start;
			align-items: baseline;
			grid-gap: 10px;
			> div {
				padding: 10px;
			}
			.price {
				font-size: 46px;
				justify-self: end;
			}
		}
	}
}

@media screen and (max-width: 1050px) {
	.newFurnitureFormWrapper {
		grid-template-columns: minmax(0, max-content);
		justify-content: center;
		.newFurnitureForm {
			.el-card {
				&__body {
					justify-content: center;
				}
			}
		}
	}
}
</style>
