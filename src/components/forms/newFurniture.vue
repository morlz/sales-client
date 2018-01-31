<template>
	<div class="newFurnitureFormWrapper cards">
		<el-card class="card newFurnitureForm">
			<div class="title" slot="header">
				Основная информация
			</div>

			<el-container class="mainForm">
				<el-aside width="200px" class="steps" align-center>
					<el-steps direction="vertical" :active="furniture_new_active.currentStep" finish-status="success">
						<el-step title="Модель" />
						<el-step title="Тип" />
						<el-step title="Декор" />
						<el-step title="Ткани" />
						<el-step title="Дополнительная информация" description="Примечание, количество и цена" />
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

						<el-form-item label="Категория" v-loading="furniture_new_loading.cat">
							<el-input value="" disabled />
						</el-form-item>

						<el-form-item label="Декор">
							<el-select v-model="dekor" :disabled="furniture_new_active.dekor" v-loading="furniture_new_loading.dekor">
								<el-option v-for="item, index in furniture_new_cached.dekor" :value="item.CONFIGID" :label="item.CONFIGID" :key="index" />
							</el-select>
						</el-form-item>

						<el-form-item label="Ткани">
							<div class="cloth">
								<cloth-select-form v-model="cloth0" :index="0" :disabled="furniture_new_active.cloth[0]" />
								<cloth-select-form v-model="cloth1" :index="1" :disabled="furniture_new_active.cloth[1]" />
								<cloth-select-form v-model="cloth2" :index="2" :disabled="furniture_new_active.cloth[2]" />
							</div>
						</el-form-item>

						<el-form-item label="Примечание">
							<el-input v-model="sign" type="textarea" :disabled="furniture_new_active.sign" placeholder="Формат ввода отреза x.y м., где x - метры, y - сантиметры" />
						</el-form-item>

						<el-form-item label="Количество">
							<el-input-number v-model.number="count" :disabled="furniture_new_active.count" />
						</el-form-item>
					</el-form>
				</el-main>
			</el-container>
		</el-card>

		<el-card class="card additioal">
			<div class="images">
				<gallery :content="furniture_new_cachedImages"/>
			</div>

			<div class="blank">
				<el-form>
					<div class="priceGroup" :class="{disabled: furniture_new_active.price}">
						<div>Цена</div>

						<div class="price">{{ price }}</div>

						<div>Цена оптовая</div>

						<div class="price">{{ furniture_new_cached.opt }}</div>
					</div>

					<el-form-item>
						<el-button type="primary" :disabled="furniture_new_active.button">Создать</el-button>
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
		return {
			images: [
				"https://images2.roomstogo.com/is/image/roomstogo/lr_sof_10111413_lilithpond~Lilith-Pond-Taupe-Sofa.jpeg?$PDP_Primary_936x650$",
				"https://www.mattblatt.com.au/media/catalog/product/u/s/us-cha-004_1_copy.jpg",
				"https://res-4.cloudinary.com/dreams-co-uk/image/upload/c_pad,dpr_1.0,f_auto,q_80/media/catalog/product/m/a/madden-sofa-bed-lifestyle-main.jpg",
				"https://vignette.wikia.nocookie.net/scifiminibuilders/images/8/88/Your_Picture_Here.png/revision/latest?cb=20130507015051",
				"https://vignette.wikia.nocookie.net/scifiminibuilders/images/8/88/Your_Picture_Here.png/revision/latest?cb=20130507015051",
				"https://vignette.wikia.nocookie.net/scifiminibuilders/images/8/88/Your_Picture_Here.png/revision/latest?cb=20130507015051",
				"https://vignette.wikia.nocookie.net/scifiminibuilders/images/8/88/Your_Picture_Here.png/revision/latest?cb=20130507015051",
				"https://vignette.wikia.nocookie.net/scifiminibuilders/images/8/88/Your_Picture_Here.png/revision/latest?cb=20130507015051",
			]
		}
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
			'furniture_new_cachedImages'
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
			'furniture_new_clothSelect'
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
	grid-template-columns: 1fr 1fr;
	grid-gap: 20px;

	.newFurnitureForm {
		.steps {
			padding: 30px 10px 120px 10px;
		}
		.el-select {
			width: 100%;
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

@media screen and (max-width: 1250px) {
	.newFurnitureForm {
		.steps {
			display: none;
		}
	}
}

@media screen and (max-width: 1050px) {
	.newFurnitureFormWrapper {
		grid-template-columns: 1fr;
	}

	.newFurnitureForm {
		.steps {
			display: block;
		}
	}
}

@media screen and (max-width: 600px) {
	.newFurnitureForm {
		.steps {
			display: none;
		}
	}
}

</style>
