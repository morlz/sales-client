<template>
	<div class="FurnitureModelsWrapper" :class="{ 'FurnitureModelsWrapper__noModels': !showModels }">
		<q-card class="FurnitureModelsWrapper__models" v-if="showModels">
			<q-card-title>Модель</q-card-title>

			<q-scroll-area :style="{ width: '100%', height: '100%' }">
				<q-list link no-border>
					<q-item
						v-for="item, index in models"
						:class="{ 'FurnitureModelsWrapper__modelSelected': isSelected(item) }"
						@click.native="$emit('select', item.MODEL)"
						:key="index">

						<q-item-main>
							{{ item.MODEL }}
						</q-item-main>

						<q-item-side right>
							{{ item.count }}
						</q-item-side>
					</q-item>
				</q-list>
			</q-scroll-area>

			<loading :value="loading"/>
		</q-card>

		<div class="FurnitureModelsWrapper__content">
			<slot/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Loading from '@/components/Loading'
import { QScrollArea } from 'quasar'

export default {
	props: {
		current: {},
		models: {
			type: Array
		},
		loading: {
			type: Boolean
		}
	},
	components: {
		Loading,
		QScrollArea
	},
	methods: {
		...mapMutations([
			'main_auth_settings_set'
		]),
		isSelected (item) {
			return this.current == item.MODEL || (!this.current && item.MODEL == 'Все модели')
		}
	},
	computed: {
		...mapGetters([
			'main_auth_settings',
		]),
		showModels: {
			get () {
				return this.main_auth_settings.showModels
			},
			set (n) {
				this.main_auth_settings_set({ type: 'showModels', data: n })
			}
		}
	}
}
</script>


<style lang="stylus">
.FurnitureModelsWrapper
	height 100%
	display grid
	grid-template-columns 180px calc(100% - (180px + 10px))
	grid-gap 10px
	&__noModels
		grid-template-columns 1fr

	&__modelSelected
		background-color #eee

	&__models
		position relative
		height 100%
		display grid
		grid-template-rows min-content 1fr

	&__content
		width 100%
		height 100%
</style>
