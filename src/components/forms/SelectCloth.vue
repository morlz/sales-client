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

				<q-scroll-area class="ClothSelectModal__list scroll overflow-hidden" ref="scroll">
					<q-scroll-observable @scroll="scroll" />

					<base-cloth
						v-for="cloth, clothIndex in furniture_selectCloth_cached[index]"
						:value="cloth"
						:key="clothIndex"
						:selected="cloth.id == current.id"
						@click.native="select(cloth)"/>
				</q-scroll-area>

				<div class="ClothSelectModal__preview">
					<img :src="current.image" />
				</div>
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

import { QScrollObservable } from 'quasar'
import { AuthMixin } from '@/mixins'

export default {
	components: {
		BaseCloth,
		QScrollObservable
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
			'furniture_selectCloth_complete'
		]),
		current () {
			if (!this.furniture_selectCloth_cached[this.index])
				return {}

			if (!this.selected)
				return this.furniture_selectCloth_cached[this.index][0] || {}

			return this.selected
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
	grid-template 's p' 50px 'l p' calc(100% - 50px) / 325px 1fr
	height 100%

	&__search
		margin 5px

	&__list
		.absolute
			display grid
			grid-template-columns repeat(auto-fit, minmax(150px, 1fr))
			align-content start
			grid-gap 5px
			padding 5px

		height 100%
		//overflow-y auto

	&__preview
		grid-area p
		align-self center
		margin 10px
		img
			width 100%
			box-shadow 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12)

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
