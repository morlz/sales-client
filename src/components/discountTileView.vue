<template>
<div class="FurnitureDiscountTiles">
	<div class="FurnitureDiscountTiles__model" v-for="model, index in discount_cachedByModel">
		<div class="FurnitureDiscountTiles__modelName">{{ model.model }}</div>

		<div class="FurnitureDiscountTiles__cards">
			<q-card
				v-for="item, itemIndex in model.data"
				:key="itemIndex"
				@click.native="clickHandler(item)"
				v-ripple
				class="relative-position">
				<q-card-media>
					<img src="https://u.askona.ru/goods/1557_1.jpg"/>
				</q-card-media>

				<q-card-title class="relative-position">
					{{ item.MODEL }} {{ item.td.TIP }}

					<q-btn
						round
						color="primary"
						icon="shopping_cart"
						class="absolute"
						style="top: 0; right: 16px; transform: translateY(-50%);"
						@click.stop="discount_addToCart({ UN: item.UN })" />

					<div slot="right">{{ item.td && item.td.mestoXR ? item.td.mestoXR.NAME : '' }}</div>

					<div slot="subtitle">
						<q-icon name="fas fa-ruble-sign" /> {{ item.td.CENA_ZAL || 0 }}
						<div>Категория: {{ item.KAT }}</div>
						<div v-if="item.ISP">Исполнение: {{ item.ISP }}</div>
					</div>
				</q-card-title>

				<q-card-main v-if="item.COMMENT">
					{{ item.COMMENT }}
				</q-card-main>
			</q-card>
		</div>
	</div>

	<slot/>

	<modal-sofa v-model="modalSofa" :id="modalSofaId" type="discount"/>
</div>
</template>

<script>
import ModalSofa from '@/components/ModalSofa'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	components: {
		ModalSofa
	},
	data () {
		return {
			modalSofa: false,
			modalSofaId: 0,
		}
	},
	watch: {

	},
	methods: {
		...mapActions([
			'discount_addToCart'
		]),
		clickHandler (item) {
			this.modalSofaId = +item.td.ID
			this.modalSofa = !this.modalSofa
		}
	},
	computed: {
		...mapGetters([
			'discount_cachedByModel'
		])
	}
}
</script>


<style lang="stylus">
.FurnitureDiscountTiles
	height 100%
	overflow auto

	&__model
		display grid
		grid-auto-flow row

	&__cards
		display grid
		grid-template-columns repeat(auto-fill, minmax(250px, auto))
		grid-gap 10px
		padding 10px 15px
		> div
			cursor pointer



</style>
