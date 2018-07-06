<template>
	<div class="New" v-if="chat.new">
		<h2 class="New__title" v-html="chat.new.title"/>
		<div class="New__description" v-html="chat.new.description"/>

		<div class="New__buttons">
			<q-btn flat color="primary" icon="edit" @click="edit"/>
			<q-btn flat color="secondary" icon="archive" @click="archive"/>
			<q-btn flat color="negative" icon="delete" @click="remove"/>
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
					:avatar="msg.manager.avatar"
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
	</div>
</template>

<script>

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'
import {  } from '@/lib'

import groupBy from 'lodash.groupby'
const reqCheck = (f, cb) => setTimeout(() => f() ? cb() : reqCheck(f, cb), 30)


export default {
	components: {

	},
	mixins: [AuthMixin],
	props: {

	},
	data () {
		return {
			newMsg: '',
			updateTimeTimeout: null
		}
	},
	watch: {
		current () {
			this.initChatForCurrentNew()
		},
		'chat.new.messages' () {
			this.scrollBottom()
		}
	},
	computed: {
		...mapState('news', {
			chat: state => state.cached.chat
		}),
		...mapGetters('news', [
			'current'
		]),
		...mapGetters([
			'auth_user'
		]),
		messages () {
			if (!this.chat.new) return []
			let messages = {}
			let grouped = groupBy(this.chat.new.messages, message => message.manager_id + '_' + Math.round(+message.created_at / 6e4))
			return Object.values(grouped).map(group => {
				let tmp = group[0]
				tmp.messages = group.map(el => el.content)
				return tmp
			})
		}
	},
	methods: {
		initChatForCurrentNew () {
			if (!this.current) return

			this.$store.dispatch('news/getOne', this.current)
		},
		async send () {
			if (this.newMsg == '') return
			await this.$store.dispatch('news/sendMessage', this.newMsg)
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
			this.$store.commit('news/setFormId', this.current)
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
	}
}
</script>


<style lang="stylus">
.New
	&__description
		padding 10px

.NewChat
	display grid

	&__createMessage
		display grid
		grid-template-columns 1fr max-content
		grid-gap 10px
</style>
