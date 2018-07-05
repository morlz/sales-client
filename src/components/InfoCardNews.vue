<template>
	<q-card class="InfoCardNews">
		<q-card-title>
			Новости
		</q-card-title>

		<q-card-main class="InfoCardNews__content">
			<q-list no-border link class="InfoCardNews__list">
				<info-card-news-create/>

				<q-item
					v-for="item, index in news"
					:key="index"
					@click.native="select(item)"
					class="InfoCardNewsNewTitle"
					:class="{ 'InfoCardNewsNewTitle__selected' : current == item.id }">

					<q-item-side>
					</q-item-side>

					<q-item-main>
						{{ item.title }}
					</q-item-main>

					<q-item-side right>
					</q-item-side>
				</q-item>
			</q-list>

			<div class="InfoCardNews__new">
				<info-card-news-new/>
			</div>
		</q-card-main>

		<q-card-actions>
		</q-card-actions>
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
		...mapState('news', {
			news: state => state.cached.list,
		}),
		...mapGetters('news', [
			'current'
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
	width 740px
	&__content
		display grid
		grid-gap 10px
		grid-template-columns 300px 400px

.InfoCardNewsNewTitle
	user-select none

	&__selected
		background #ecf5ff
</style>
