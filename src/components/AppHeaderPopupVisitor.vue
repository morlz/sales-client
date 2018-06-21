<template>
<div class="HeaderVisitors">
	<template v-if="auth_can(1, 'Visitor')">

		<q-modal
			v-model="modal"
			ref="modal"
			class="HeaderVisitorsModal"
			:content-css="{minWidth: '400px', minHeight: '330px'}">
			<q-modal-layout class="HeaderVisitorsModal__layout">
				<q-toolbar slot="header">
					<q-btn flat wait-for-ripple v-close-overlay icon="keyboard_arrow_left" @click="local_visitor_create"/>
					<q-toolbar-title>Новый посетитель</q-toolbar-title>
					<q-btn flat icon-right="redo" v-if="app_view_mobile">Добавить</q-btn>
				</q-toolbar>

				<div class="HeaderVisitorsModal__content">
					<q-field>
						<q-input :value="now.format('DD MMMM YYYY hh:mm:ss')" float-label="Дата и время" disable/>
					</q-field>

					<q-field helper="Описание посетителя по которому его можно будет узнать в дальнейшем">
						<q-input type="textarea" v-model="description" float-label="Описание"/>
					</q-field>

					<q-btn
						color="primary"
						class="HeaderVisitorsModal__button"
						v-if="!app_view_mobile"
						@click="local_visitor_create">
						Добавить
					</q-btn>
				</div>
			</q-modal-layout>
		</q-modal>

		<q-btn class="HeaderVisitors__toggle" flat @click="modal = !modal" wait-for-ripple>
			<q-icon name="fas fa-user-plus" v-if="app_view_mobile"/>
			<template v-if="!app_view_mobile">
				Новый посетитель
			</template>
		</q-btn>
	</template>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { AuthMixin } from '@/mixins'

import { QModal, QModalLayout, QToolbar, QToolbarTitle, QPopover } from 'quasar'

export default {
	components: {
		QModal,
		QModalLayout,
		QToolbar,
		QToolbarTitle,
		QPopover
	},
	mixins: [AuthMixin],
	data() {
		return {
			modal: false,
			description: '',
			now: this.$moment(),
			nowUpdateInterval: null
		}
	},
	watch: {
		modal (n) {
			if (n) {
				this.nowUpdateInterval = setInterval(a => this.now = this.$moment(), 1e2)
			} else {
				clearInterval(this.nowUpdateInterval)
			}
		}
	},
	computed: {
		...mapGetters([
			'app_view_mobile',
			'app_view_desktop'
		]),
	},
	methods: {
		...mapActions([
			'visitor_create'
		]),
		async local_visitor_create () {
			await this.visitor_create({ description: this.description })
			this.modal = false
		}
	},
	beforeDestroy () {
		clearInterval(this.nowUpdateInterval)
	}
}
</script>


<style lang="stylus">
.HeaderVisitorsModal
	&__content
		display grid
		grid-gap 10px
		padding 30px
</style>
