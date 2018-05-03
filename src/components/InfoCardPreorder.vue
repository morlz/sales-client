<template>
<q-card class="InfoCardPreorder" v-if="auth_can(1, 'Preorder')">
	<q-card-title>
		Общая информация о предзаказе
	</q-card-title>

	<q-card-main>
		<q-stepper alternative-labels :value="+data.status_id" no-header-navigation>
			<q-step v-for="item, index in preorder_statuses" :name="index" :title="item.title" :key="index" active-icon="fa-eye"/>
		</q-stepper>

		<q-list highlight no-border>
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
					{{ content.created_at }}
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
		<q-btn color="primary" icon="edit">Редактировать</q-btn>
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
	computed: {
		...mapGetters([
			'preorder_statuses'
		]),
		data () {
			return this.content
		}
	}
}
</script>


<style lang="stylus">
.InfoCardPreorder
	.q-stepper-step
		display none
</style>
