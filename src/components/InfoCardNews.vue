<template>
	<q-card class="InfoCardNews">
		<q-card-title>
			Новости
		</q-card-title>

		<q-card-main class="InfoCardNews__content">
			<div class="InfoCardNews__list">
				<q-scroll-area
					class="InfoCardNews__scroll"
					style="width: 100%; height: 600px;"
					ref="scroll">
					<q-list no-border link>
						<q-item
							v-for="item, index in cached"
							:key="index"
							@click.native="select(item)"
							class="InfoCardNewsNewTitle"
							:class="{ 'InfoCardNewsNewTitle__selected' : current == item.id }">

							<q-item-side :avatar="item.manager.avatar"/>

							<q-item-main>
								<q-item-tile>
									{{ item.title }}
								</q-item-tile>
								<q-item-tile>
									{{ $moment().to($moment(item.date)) }}
								</q-item-tile>
							</q-item-main>

							<q-item-side right>
							</q-item-side>
						</q-item>
					</q-list>
				</q-scroll-area>

				<info-card-news-create/>
			</div>

			<div class="InfoCardNews__new">
				<info-card-news-new/>
			</div>
		</q-card-main>
	</q-card>
</template>

<script>

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'
import InfoCardNewsNew from '@/components/InfoCardNewsNew'
import InfoCardNewsCreate from '@/components/InfoCardNewsCreate'

export default {
	components: {
		InfoCardNewsNew,
		InfoCardNewsCreate
	},
	mixins: [AuthMixin],
	props: {

	},
	data () {
		return {

		}
	},
	computed: {
		...mapGetters('news', [
			'current',
			'cached'
		])
	},
	methods: {
		select (item) {
			this.$store.commit('news/cacheSet', { current: item.id })
		}
	},
	created () {
		this.$store.dispatch('news/init')
	},
	beforeDestroy () {
		this.$store.dispatch('news/destroy')
	}
}
</script>


<style lang="stylus">
.InfoCardNews
	&__content
		display grid
		grid-gap 10px
		grid-template-columns minmax(300px, 1fr) minmax(400px, 2fr)

	&__list
		display grid
		grid-template-rows 1fr max-content

.InfoCardNewsNewTitle
	user-select none

	&__selected
		background #ecf5ff
</style>
