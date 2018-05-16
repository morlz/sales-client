<template>
<q-modal v-model="model" :content-css="{minWidth: '80vw', minHeight: '80vh'}" class="ModalSofa">
	<q-modal-layout class="ModalSofa__layout">
		<q-toolbar slot="header">
			<q-btn flat wait-for-ripple v-close-overlay round>
				<q-icon name="keyboard_arrow_left"/>
			</q-btn>
			<q-toolbar-title>{{ furniture_current.furniture ? furniture_current.furniture.MODEL + ' ' + furniture_current.furniture.TIP : '...' }}</q-toolbar-title>

			<q-btn
				v-if="furniture_current && !cart_alreadyIn(furniture_current.ID, true)"
				flat
				wait-for-ripple
				@click="local_addToCart(furniture_current)">
				Добавить в корзину
			</q-btn>

			<q-btn flat wait-for-ripple @click="$router.push(`/furniture/salon/${furniture_current.ID}`)">
				Перейти к дивану
			</q-btn>
		</q-toolbar>

		<div class="ModalSofa__main">
			<q-list v-for="list, listIndex in one.lists" :key="listIndex">
				<template v-if="list.label">
					<q-list-header>
						{{ list.label }}
					</q-list-header>

					<q-item-separator/>
				</template>

				<q-item v-for="row, rowIndex in list.items" :key="rowIndex" v-if="typeof row.hide !== 'function' || !row.hide()">
					<q-item-main>
						{{ row.label }}
					</q-item-main>

					<q-item-side right>
						<template v-if="row.component">
							<div :is="row.component" v-bind="row.props()"/>
						</template>

						<template v-else>
							{{ (row.filter ? row.filter : el => el) ( getContentByPath(row.source) ) }}
						</template>
					</q-item-side>
				</q-item>
			</q-list>

			<loading :value="furniture_loadingOne"/>
		</div>
	</q-modal-layout>
</q-modal>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'
import PreviewCloth from '@/components/PreviewCloth'
import PreviewSalon from '@/components/PreviewSalon'
import Loading from '@/components/Loading'
import { AuthMixin, SingleItemPageMixin, RouteMixin, CartMixin } from '@/mixins'
import money from '@/filters/Money'

export default {
	components: {
		Loading
	},
	mixins: [AuthMixin, SingleItemPageMixin, RouteMixin, CartMixin],
	props: {
		value: Boolean,
		id: Number,
		type: String
	},
	data() {
		return {
			one: {
				lists: {
					info: {
						items: [
							{ label: 'Фабричный номер', source: 'furniture_current.UN' },
							{ label: 'Модель', source: 'furniture_current.furniture.MODEL' },
							{ label: 'Тип', source: 'furniture_current.furniture.TIP' },
							{ label: 'Исполнение', source: 'furniture_current.furniture.ISP' },
							{ label: 'Категория', source: 'furniture_current.furniture.KAT' },
							{ label: 'Декор', source: 'furniture_current.furniture.DEKOR' },
							{ label: 'Стежка', source: 'furniture_current.furniture.Vid_stegki' },
						]
					},
					storage: {
						label: 'Информация о складе',
						items: [
							{
								label: 'Местоположение',
								component: PreviewSalon,
								props: () => ({ content: this.getContentByPath('furniture_current.salon') || {} })
							},
							{ label: 'Место хранения', source: 'furniture_current.mestoXR.NAME' },
							{
								label: 'Прибытие на склад',
								source: 'furniture_current.DATE_VX',
								filter: el => this.$moment(el).fromNow() + ` (${this.$moment().diff(this.$moment(el), 'days')} дн.)`
							},
						]
					},
					cloth: {
						label: 'Ткани',
						items: [
							{ label: 'Ткань 1', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.furniture.cloth1') || {} }) },
							{ label: 'Ткань 2', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.furniture.cloth2') || {} }) },
							{ label: 'Ткань 3', component: PreviewCloth, props: () => ({ content: this.getContentByPath('furniture_current.furniture.cloth3') || {} }) },
						]
					},
					sost: {
						label: 'Состояние',
						items: [
							{ label: 'Примечание', source: 'furniture_current.furniture.COMMENT' },
							{ label: 'Состояние', source: 'furniture_current.Sostoynie' },
						]
					},
					price: {
						label: 'Цены',
						items: [
							{ label: 'Цена', source: 'furniture_current.CENA', filter: el => money(el) + ' руб.' },
							{ label: 'Цена модели опт', source: 'furniture_current.ModelPriceOpt', filter: el => money(el) + ' руб.', hide: a => !this.auth_can(1, 'SeeOptPrice') },
							{ label: 'Цена модели розн', source: 'furniture_current.ModelPriceR', filter: el => money(el) + ' руб.' },
							{ label: 'Цена зал', source: 'furniture_current.CENA_ZAL', filter: el => money(el) + ' руб.' },
						]
					}
				}
			}
		}
	},
	watch: {
		id (n) {
			if (!n) return

			this.furniture_getOne(n)
		}
	},
	computed: {
		...mapGetters([
			'furniture_current',
			'furniture_loadingOne'
		]),
		model: {
			get () {
				return this.value
			},
			set (e) {
				this.$emit('input', e)
			}
		}
	},
	methods: {
		...mapActions([
			'furniture_getOne',
			'discount_addToCart',
			'storage_addToCart',
			'furniture_addToCart'
		]),
		local_addToCart (data) {
			switch (this.type) {
				case 'salon':
					this.furniture_addToCart(data)
					break;

				case 'storage':
					this.storage_addToCart(data)
					break;

				case 'discount':
					this.discount_addToCart(data)
					break;
			}
		}
	},
	mounted () {

	}
}
</script>


<style lang="stylus">
	.ModalSofa
		&__main
			padding 10px
			position relative
			display grid
			grid-gap 10px
			grid-template-columns repeat(auto-fit, minmax(300px, 1fr))

			.q-item
				display grid
				grid-auto-flow column

			.q-item-side-right
				justify-self end

</style>
