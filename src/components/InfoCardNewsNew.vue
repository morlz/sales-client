<template>
	<div class="New" v-if="chat.new">
		<div class="New__description" v-html="chat.new.description"/>

		<div class="NewChat">

			<q-scroll-area
				class="NewChat__messages"
				style="width: 400px; height: 600px;"
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
					<q-input v-model="newMsg" float-label="Новое сообщение"/>
				</q-field>

				<q-btn color="primary" icon="send" @click="send"/>
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
			newMsg: ''
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
					() => {
						console.log(this.$refs.scroll.scrollHeight, this.$refs.scroll);
						this.$refs.scroll.setScrollPosition(this.$refs.scroll.scrollHeight, 300)
					}
				)
			)
		}
	},
	created () {
		this.initChatForCurrentNew()
	},
	mounted () {
		this.scrollBottom()
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
