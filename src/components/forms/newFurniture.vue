<template>
	<div class="newFurnitureFormWrapper">

		<q-card class="card newFurnitureForm">
			<q-card-title>Конфигурация</q-card-title>

			<q-card-main class="mainForm">
				<q-timeline class="newFurnitureForm__timeline">
					<q-timeline-entry title="Модель">
						<q-select
							v-model="model"
							:disable="furniture_new_active.model"
							filter
							v-loading="furniture_new_loading.models"
							:options="models"
							float-label="Модель"
						/>
					</q-timeline-entry>

					<q-timeline-entry title="Тип">
						<q-select
							v-if="!furniture_new_freeTrim"
							v-model="type"
							:disable="furniture_new_active.type"
							filter
							v-loading="furniture_new_loading.type"
							:options="types"
							float-label="Тип"
						/>

						<module-sofa-create
							v-if="furniture_new_freeTrim"
							v-model="type"
							v-loading="furniture_new_loading.types"
							:disable="furniture_new_active.type"
							:data="furniture_new_cached.types" />
					</q-timeline-entry>

					<q-timeline-entry title="Декор">
						<q-select
							v-model="dekor"
							:disable="furniture_new_active.dekor"
							filter
							v-loading="furniture_new_loading.dekor"
							:options="dekors"
							float-label="Декор"
						/>
					</q-timeline-entry>


					<q-timeline-entry title="Ткани">
						<div class="cloth">
							<form-select-cloth v-model="cloth0" :index="0" :disable="furniture_new_active.cloth[0]" />
							<form-select-cloth v-model="cloth1" :index="1" :disable="furniture_new_active.cloth[1]" />
							<form-select-cloth v-model="cloth2" :index="2" :disable="furniture_new_active.cloth[2]" />
						</div>
					</q-timeline-entry>

					<q-timeline-entry title="Дополнительная информация">
						<q-field helper="Формат ввода отреза x.y м., где x - метры, y - сантиметры">
							<q-input v-model="sign" type="textarea" float-label="Примечание" :disable="furniture_new_active.sign"/>
						</q-field>

						<q-field>
							<q-input v-model.number="count" float-label="Количество" :disable="furniture_new_active.count"/>
						</q-field>
					</q-timeline-entry>

				</q-timeline>
			</q-card-main>
		</q-card>

		<q-card class="card additioal">
			<q-card-title>Информация</q-card-title>

			<q-card-main>
				<div class="images" v-if="!furniture_new_active.gallery">
					<gallery :content="furniture_new_cachedImages"/>
				</div>

				<div class="blank">
					<el-form>
						<div class="priceGroup" :class="{disabled: furniture_new_active.price}">
							<div>Категория</div>
							<div class="price" v-loading="furniture_new_loading.cat">
								{{
									(furniture_new_modelCunning ?
										furniture_new_cunningCatSofa
									:	furniture_new_cached.cloth[furniture_new_normalMaxIndex].code) || 0
								}}
							</div>
							<div>Цена</div>
							<div class="price" v-loading="furniture_new_loading.price">{{ price }}</div>
							<template v-if="auth_can(1, 'SeeOptPrice')">
								<div>Цена оптовая</div>
								<div class="price" v-loading="furniture_new_loading.price">{{ furniture_new_cached.opt }}</div>
							</template>
						</div>
					</el-form>
				</div>
			</q-card-main>

			<q-card-actions>
				<q-btn color="primary" :disabled="furniture_new_active.button" @click="furniture_new_save" v-if="edit">Сохранить</q-btn>
				<q-btn color="primary" :disabled="furniture_new_active.button" @click="furniture_new_addToCart" v-else>Создать</q-btn>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script>
//<el-step title="Новый заказ" />
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { AuthMixin } from '@/mixins'
import FormSelectCloth from '@/components/forms/SelectCloth'
import ModuleSofaCreate from '@/components/forms/ModuleSofaCreate'
import gallery from '@/components/gallery.vue'
import { QCard, QCardTitle, QCardMain, QCardActions, QBtn, QTimeline, QTimelineEntry } from 'quasar'

export default {
	components: {
		FormSelectCloth,
		ModuleSofaCreate,
		gallery,
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QBtn,
		QTimeline,
		QTimelineEntry,
	},
	mixins: [AuthMixin],
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
		},
		edit: {
			get () { return this.furniture_new_selected.edit },
			set (n) { this.furniture_new_editSet(n) }
		},

		models () {
			return this.furniture_new_cached.models.map(el => ({ value: el.ITEMID, label: el.ITEMNAME }))
		},
		types () {
			return this.furniture_new_cached.types.map(el => ({ value: el.CONFIGID, label: el.NAME.substr(0, 80) }))
		},
		dekors () {
			return this.furniture_new_cached.dekor.map(el => ({ value: el.CONFIGID, label: el.CONFIGID }))
		},
	},
	methods: {
		...mapActions([
			'furniture_new_modelSelect',
			'furniture_new_typeSelect',
			'furniture_new_dekorSelect',
			'furniture_new_init',
			'furniture_new_clothSelect',
			'furniture_new_addToCart',
			'furniture_new_save'
		]),
		...mapMutations([
			'furniture_new_signSet',
			'furniture_new_countSet',
			'furniture_new_priceSet',
			'furniture_new_editSet'
		])
	},
	mounted () {
		this.furniture_new_init(this.$route.params.id)
	}
}
</script>


<style lang="less">
.newFurnitureFormWrapper {
	display: grid;
	grid-template-columns: minmax(0, 500px) 1fr;
	grid-gap: 10px;
	color: #5a5e66;

	.newFurnitureForm {
		&__timeline {
			.q-timeline {
				&-dot {
					left: 10px;
				}
				&-content {
					width: 100%;
				}
			}
		}



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
				margin: 30px 5px;
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
