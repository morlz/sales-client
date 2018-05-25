<template>
<div class="ClothSelect">
	<base-cloth
		:value="value"
		v-if="value"
		@click.native="modal = !disable"
		:style="{
			pointerEvents: disable ? 'none' : 'all',
			opacity: disable ? 0.5 : 1
		}"/>

	<q-card
		class="ClothSelectEmpty"
		v-else
		@click.native="modal = !disable"
		v-ripple
		:style="{
			pointerEvents: disable ? 'none' : 'all',
			opacity: disable ? 0.5 : 1
		}">
		<q-card-media>
			<img src="statics/no-img-available.png"/>

			<div slot="overlay" class="ClothSelectEmpty__title" v-if="!disable">
				Выбрать
			</div>
		</q-card-media>
	</q-card>

	<q-modal v-model="modal" maximized>
		<q-modal-layout>
			<q-toolbar slot="header">
				<q-btn flat round dense wait-for-ripple v-close-overlay icon="keyboard_arrow_left"/>
				<q-toolbar-title>Выбор ткани</q-toolbar-title>
				<q-btn flat @click="input">
					<q-icon name="check" :style="{ marginRight: '5px' }"/> Выбрать
				</q-btn>
			</q-toolbar>

			<div class="ClothSelectModal">
				<q-input class="ClothSelectModal__search" float-label="Поиск" v-model="local_search"/>

				<q-select class="ClothSelectModal__kat" v-model="kat" :options="kats"/>

				<q-scroll-area class="ClothSelectModal__list scroll overflow-hidden" ref="scroll">
					<q-scroll-observable @scroll="scroll" />

					<div
						class="ClothCollection"
						v-for="collection, collectionIndex in furniture_selectCloth_cached[index]"
						:key="collectionIndex"
						:class="{ 'ClothCollection__big' : collection.length !== 1 }">
						<div class="ClothCollection__name">
							{{ collectionIndex }}
						</div>

						<div class="ClothCollection__items">
							<base-cloth
								v-for="cloth, clothIndex in collection"
								:value="cloth"
								:key="collectionIndex + '-' + clothIndex"
								:selected="cloth.id == current.id"
								@click.native="select(cloth)"/>
						</div>
					</div>
				</q-scroll-area>

				<q-tabs inverted no-pane-border class="ClothSelectModal__tabs" v-if="modal">
					<q-tab slot="title" name="cloth" label="Ткань" default/>
					<q-tab slot="title" name="model" label="Модель"/>

					<q-tab-pane name="cloth">
						<div class="ClothSelectModal__preview">
							<img :src="current.image" />
						</div>
					</q-tab-pane>

					<q-tab-pane name="model">
						<div class="ClothSelectModal__model">
							<sofa-3-d-view :value="current.image"/>
						</div>
					</q-tab-pane>
				</q-tabs>
			</div>
		</q-modal-layout>
	</q-modal>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import BaseCloth from '@/components/BaseCloth'
import Sofa3DView from '@/components/Sofa3DView'

import { QScrollObservable } from 'quasar'
import { AuthMixin } from '@/mixins'

export default {
	components: {
		BaseCloth,
		QScrollObservable,
		Sofa3DView
	},
	mixins: [AuthMixin],
	props: {
		value: {
			type: [Object, String],
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		disable: Boolean
	},
	data() {
		return {
			modal: false,
			local_search: '',
			local_search_timeout: null,
			selected: null,
			loading: false
		}
	},
	watch: {
		modal (n) {
			this.$store.dispatch(n ? 'selectCloth/furniture_selectCloth_init' : 'selectCloth/furniture_selectCloth_destroy', this.index)
			if (n)
				this.selected = this.value
		},
		value (n) {
			this.selected = n
		},
		local_search (n) {
			if (this.local_search_timeout)
				clearTimeout(this.local_search_timeout)

			this.local_search_timeout = setTimeout(() => {
				if (this.$refs.inf)
					this.$refs.inf.$emit('$InfiniteLoading:reset')


				this.$store.commit('selectCloth/furniture_selectCloth_querySet', { [this.index]: n })
				this.$store.dispatch('selectCloth/furniture_selectCloth_start', this.index)
			}, 5e2)
		}
	},
	computed: {
		...mapGetters([
			'furniture_clothSelectForm'
		]),
		...mapGetters('selectCloth', [
			'furniture_selectCloth_cached',
			'furniture_selectCloth_complete',
			'furniture_selectCloth_kats'
		]),
		current () {
			if (!this.furniture_selectCloth_cached[this.index])
				return {}

			if (!this.selected)
				return (this.furniture_selectCloth_cached[this.index][Object.keys(this.furniture_selectCloth_cached[this.index])[0]] || [])[0] || {}

			return this.selected
		},
		kat: {
			get () {
				return this.furniture_selectCloth_kats[this.index]
			},
			set (n) {
				if (this.$refs.inf)
					this.$refs.inf.$emit('$InfiniteLoading:reset')

				this.$store.commit('selectCloth/furniture_selectCloth_katSet', { [this.index]: n })
				this.$store.dispatch('selectCloth/furniture_selectCloth_start', this.index)
			}
		},
		kats () {
			let res = Array.apply(null, { length: 10 }).map((el, index) => ({ label: 'K' + (index + 1), value: 'K' + (index + 1) }))
			return [{ label: 'Все', value: null }, ...res]
		}
	},
	methods: {
		select (cloth) {
			if (this.selected && this.selected.id == cloth.id)
				return this.input()

			this.selected = cloth
		},
		async input () {
			if (!this.auth_can(1, 'SelectBrokenCloth') && !this.selected.status.normal)
				return this.$store.dispatch('alert', `Ткань ${this.selected.name} (${this.selected.id}) отсутствует у поставщика и недоступна для заказа`)

			try {
				if (!this.selected.status.normal)
					await this.$q.dialog({
						title: 'Внимание',
						message: `Ткань ${this.selected.name} (${this.selected.id}) отсутствует у поставщика и недоступна для заказа. Вы уверены что хотите продолжить?`,
						ok: 'Продолжить',
						cancel: 'Отмена'
					})

				this.$emit('input', this.selected)
				this.modal = false
			} catch (err) {}
		},
		local_infinite () {
			this.$store.dispatch('selectCloth/furniture_selectCloth_infinite', {
				index: this.index,
				payload: {
					loaded: a => this.$nextTick(() => this.loading = false),
					complete: a => a,
				}
			})
		},
		scroll (e) {
			if (!this.modal) return
			if (this.loading) return
			if (this.furniture_selectCloth_complete[this.index]) return
			if (!this.$refs.scroll) return
			if (this.$refs.scroll.$el.querySelector('.absolute').offsetHeight - e.position - this.$refs.scroll.$el.offsetHeight < 800) {
				this.local_infinite()
				this.loading = true
			}
		}
	}
}
</script>


<style lang="stylus">
.ClothSelectModal
	display grid
	grid-template 's k p' 50px 'l l p' calc(100% - 50px) / 250px 75px 1fr
	height 100%

	&__search
		margin 5px
		grid-area s

	&__kat
		margin 5px
		grid-area k

	&__list
		grid-area l
		.absolute
			display grid
			grid-template-columns 1fr 1fr
			align-content start
			grid-gap 5px
			padding 5px
		height 100%
		//overflow-y auto

	&__preview
		width 100%
		height 100%
		display grid
		align-items center
		justify-items center

		img
			max-width 100%
			max-height 100%
			box-shadow 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)


	&__model
		width 100%
		height 100%

		.Sofa3DView
			width 100%
			height 100%
			padding 0
			margin 0
			overflow hidden

	&__tabs
		grid-area p
		display grid
		grid-template-rows 50px 1fr
		.q-tabs-panes
		.q-tab-pane
			width 100%
			height 100%
			padding 0
			margin 0


.ClothCollection
	width 150px
	&__name
		margin 5px 10px

	&__items
		display grid
		grid-template-columns repeat(auto-fit, minmax(150px, 1fr))
		align-content start
		grid-gap 5px

	&__big
		width 305px
		grid-column 1 / 3

.ClothSelectEmpty
	width 150px
	height 150px
	user-select none
	cursor pointer
	position relative

	&__title
		text-align center
		font-size 16px
		padding 5px 0
</style>
