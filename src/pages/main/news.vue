<template>
<q-page class="AppContent New">
	<q-card class="AppContent__inner">
		<q-card-title>
		</q-card-title>

		<q-card-main v-if="chat.new">
			<div >
				<h2 class="New__title" v-html="chat.new.title"/>
				<div class="New__description" v-html="chat.new.description"/>

				<div class="New__buttons">
					<q-btn flat color="primary" icon="edit" @click="edit"/>
					<q-btn flat color="secondary" icon="archive" @click="archive"/>
					<q-btn flat color="negative" icon="delete" @click="remove"/>
					<info-card-news-create/>
				</div>
			</div>

			<div class="NewChat">
				<q-scroll-area
					class="NewChat__messages"
					style="width: 100%; height: 600px;"
					ref="scroll">
					<q-chat-message
						v-for="msg, index in messages"
						:key="msg.id"
						:text="msg.messages"
						:name="msg.manager.name"
						:avatar="msg.manager.avatar ? msg.manager.avatar.href : msg.manager.avatarDefault"
						:stamp="$moment().to(+msg.created_at)"
						:sent="auth_user.id == msg.manager.id"/>
				</q-scroll-area>

				<div class="NewChat__createMessage">
					<q-field>
						<q-input v-model="newMsg" float-label="Новое сообщение" @keydown.enter.native="send"/>
					</q-field>

					<q-btn color="primary" icon="send" @click="send" flat/>
				</div>
			</div>

		</q-card-main>
	</q-card>
</q-page>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'
import { AuthMixin, RouteMixin, SingleItemPageMixin } from '@/mixins'
import groupBy from 'lodash.groupby'
import InfoCardNewsCreate from '@/components/InfoCardNewsCreate'

const reqCheck = (f, cb) => setTimeout(() => f() ? cb() : reqCheck(f, cb), 30)

export default {
	components: {
		InfoCardNewsCreate
	},
	mixins: [AuthMixin, RouteMixin, SingleItemPageMixin],
	props: {

	},
	data () {
		return {
			newMsg: '',
			updateTimeTimeout: null
		}
	},
	watch: {
		'chat.new.messages' () {
			this.scrollBottom()
		}
	},
	computed: {
		...mapState('news', {
			chat: state => state.cached.chat
		}),
		...mapGetters([
			'auth_user'
		]),
		messages () {
			if (!this.chat.new)
				return []

			return Object
				.values(
					groupBy(
						this.chat.new.messages,
						message => message.manager_id + '_' + Math.round(+message.created_at / 6e4)
					)
				)
				.map(group => {
					let tmp = group[0]
					tmp.messages = group.map(el => el.content)
					return tmp
				})
		}
	},
	methods: {
		initChatForCurrentNew () {
			if (!this.$route.params.id) return

			this.$store.dispatch('news/getOne', this.$route.params.id)
		},
		async send () {
			if (this.newMsg == '') return
			await this.$store.dispatch('news/sendMessage', {
				new_id: this.$route.params.id,
				content: this.newMsg
			})
			this.newMsg = ''
		},
		scrollBottom () {
			reqCheck(
				() => !!this.$refs.scroll && this.$refs.scroll.scrollHeight !== undefined,
				() => this.$nextTick(
					() => this.$refs.scroll.setScrollPosition(this.$refs.scroll.scrollHeight, 300)
				)
			)
		},
		edit () {
			this.$store.commit('news/setFormId', this.$route.params.id)
			this.$store.commit('news/modalSet', true)
		},
		archive () {
			this.$store.dispatch('news/archive', this.chat.new)
		},
		remove () {
			this.$store.dispatch('news/remove', this.chat.new)
		}
	},
	created () {
		this.initChatForCurrentNew()
		this.updateTimeTimeout = setInterval(a => this.$forceUpdate(), 1e4)
	},
	mounted () {
		this.scrollBottom()
	},
	beforeDestroy () {
		clearTimeout(this.updateTimeTimeout)
		this.$store.dispatch('news/destroyChat')
	}
}
</script>


<style lang="stylus">
.New
	padding 10px
	margin 0
	&__description
		padding 10px

.NewChat
	display grid

	&__createMessage
		display grid
		grid-template-columns 1fr max-content
		grid-gap 10px
</style>
