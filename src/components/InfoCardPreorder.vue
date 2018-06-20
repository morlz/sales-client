<template>
<q-card class="InfoCardPreorder" v-if="auth_can(1, 'Preorder')">
	<q-card-title>
		Общая информация о предзаказе
	</q-card-title>

	<q-card-main>
		<q-stepper alternative-labels :value="+data.status_id - 1" no-header-navigation>
			<q-step v-for="item, index in preorder_statuses" :name="index" :title="item.title" :key="index" active-icon="fas fa-eye"/>
		</q-stepper>

		<div class="InfoCardPreorder__edit" v-if="edit">
			<q-field helper="Рекламный источник">
				<q-select v-model="editFields.ad_source_id" :options="adSource_listSelect" float-label="Рекламный источник" filter/>
			</q-field>

			<q-field helper="Вероятность">
				<q-rating v-model.number="editFields.rating" :max="5" size="30px"/>
			</q-field>

			<q-field>
				<q-input v-model.number="editFields.budget" type="number" float-label="Бюджет"/>
			</q-field>

			<q-field>
				<q-input v-model.number="editFields.prepay_summ" type="number" float-label="Сумма предоплаты"/>
			</q-field>

			<q-field>
				<q-input v-model.number="editFields.calc_summ" type="number" float-label="Сумма расчёта"/>
			</q-field>

			<q-field helper="Примечание">
				<q-input v-model="editFields.description" type="textarea" float-label="Примечание"/>
			</q-field>
		</div>

		<q-list highlight no-border v-else>
			<q-item v-if="content.salon">
				<q-item-side>Салон</q-item-side>
				<q-item-main/>
				<q-item-side right>
					<preview-salon :content="content.salon"/>
				</q-item-side>
			</q-item>

			<q-item v-if="content.manager">
				<q-item-side>Менеджер</q-item-side>
				<q-item-main/>
				<q-item-side right>
					<preview-manager :content="content.manager"/>
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Дата создания</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ $moment(content.created_at).format('DD MMMM YYYY HH:mm:ss') }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Клиент</q-item-side>
				<q-item-main/>
				<q-item-side right>
					<preview-client :content="content.client"/>
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Рекл. источник</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ content.adsource ? content.adsource.NAME : '...' }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Вероятность</q-item-side>
				<q-item-main/>
				<q-item-side right>
					<q-rating :value="+content.chance" readonly :max="5" />
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Бюджет</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ content.budget }}
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Сумма предоплаты</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ content.prepay_summ }} руб.
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Сумма расчёта</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ content.calc_summ }} руб.
				</q-item-side>
			</q-item>

			<q-item>
				<q-item-side>Примечание</q-item-side>
				<q-item-main/>
				<q-item-side right>
					{{ content.description }}
				</q-item-side>
			</q-item>
		</q-list>
	</q-card-main>

	<q-card-actions>
		<template v-if="edit">
			<q-btn color="primary" @click="save">Сохранить</q-btn>
			<q-btn color="secondary" @click="edit = false" flat wait-for-ripple>Отмена</q-btn>
		</template>

		<template v-else>
			<q-btn color="primary" v-if="data.canEdit" @click="edit = true" wait-for-ripple>Редактировать</q-btn>
			<q-btn color="primary" v-if="data.invoice" :to="data.invoice.href">Перейти к заказу</q-btn>
		</template>
	</q-card-actions>
</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import { AuthMixin, RouteMixin } from '@/mixins'
import { QStepper, QStep, QRating } from 'quasar'
import PreviewSalon from '@/components/PreviewSalon'
import PreviewManager from '@/components/PreviewManager'
import PreviewClient from '@/components/PreviewClient'
import { Preorder } from '@/lib'

export default {
	components: {
		QStepper,
		QStep,
		PreviewSalon,
		PreviewManager,
		PreviewClient,
		QRating
	},
	mixins: [AuthMixin, RouteMixin],
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	data () {
		return {
			edit: false,
			editFields: {}
		}
	},
	computed: {
		...mapGetters([
			'preorder_statuses',
			'adSource_listSelect'
		]),
		data () {
			let data = this.content instanceof Preorder ? this.content : new Preorder(this.content)
			this.editFields = data.clone()
			return data
		}
	},
	methods: {
		...mapActions([
			'adSource_getList',
			'preorder_update'
		]),
		async save () {
			let { id, ad_source_id, description, chance, budget, prepay_summ, calc_summ } = this.editFields
			await this.preorder_update({ id, ad_source_id, description, chance, budget, prepay_summ, calc_summ })
			this.edit = false
		}
	},
	created () {
		this.adSource_getList()
	}
}
</script>


<style lang="stylus">
.InfoCardPreorder
	.q-stepper-step
		display none

	&__edit
		margin 10px 0
		display grid
		grid-gap 10px
</style>
