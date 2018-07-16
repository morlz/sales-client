<template>
	<q-card class="InfoCardNews" v-if="auth_can(1, 'News')">
		<q-card-title>
			Новости
		</q-card-title>

		<q-card-main class="InfoCardNews__content">
			<div class="InfoCardNews__list">
				<q-scroll-area
					class="InfoCardNews__scroll"
					style="width: 100%; height: 100%; min-height: 350px;"
					ref="scroll">
					<q-list no-border link>
						<q-item
							v-for="item, index in cached"
							:key="index"
							@click.native="select(item)"
							class="InfoCardNewsNewTitle">

							<q-item-side v-if="item.manager.avatar" :avatar="item.manager.avatar.href"/>

							<q-item-main>
								<q-item-tile>
									{{ item.title }}
								</q-item-tile>
								<q-item-tile>
									{{ $moment().to($moment(item.date)) }}
								</q-item-tile>
							</q-item-main>

							<q-item-side right>
								<q-chip
									v-if="!item.view"
									icon="notification_important"
									color="primary">
									Не прочитано
								</q-chip>

								<q-chip
									v-else-if="item.newMessagsCount"
									color="primary">
									{{ item.newMessagsCount }}
								</q-chip>
							</q-item-side>
						</q-item>
					</q-list>
				</q-scroll-area>

				<info-card-news-create v-if="auth_can(2, 'News')"/>
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
	computed: {
		...mapGetters('news', [
			'current',
			'cached'
		])
	},
	methods: {
		select (item) {
			this.$router.push(`/news/${item.id}`)
			//this.$store.commit('news/cacheSet', { current: item.id })
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
	display grid
	grid-template-rows max-content 1fr
	&__list
		height 100%
		display grid
		grid-template-rows 1fr max-content

.InfoCardNewsNewTitle
	user-select none

	&__selected
		background #ecf5ff
</style>
