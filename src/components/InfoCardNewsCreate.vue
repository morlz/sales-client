<template>
<div class="NewsCreate">
	<q-btn color="primary" @click="toggleModalCreate">Создать</q-btn>

	<q-modal v-model="modal" class="NewsCreateModal" :content-css="{minWidth: '80vw', minHeight: '90vh'}" no-backdrop-dismiss>
		<q-modal-layout class="NewsCreateModal__layout">
			<q-toolbar slot="header">
				<q-btn flat wait-for-ripple v-close-overlay icon="keyboard_arrow_left" />
				<q-toolbar-title>Добавить новость</q-toolbar-title>
				<q-btn flat icon-right="redo" v-if="app_view_mobile" @click="save">Сохранить</q-btn>
			</q-toolbar>

			<div class="NewsCreateModal__content">
				<q-field>
					<q-input v-model="form.title" float-label="Название" />
				</q-field>

				<div class="NewsCreateModal__middle">
					<q-editor
						class="NewsCreateModal__editor"
						v-model="form.description"
						:toolbar="toolbar"
						:fonts="fonts" />

					<q-list no-border>
						<q-item v-for="group in groups" :key="group.id">
							<q-item-main>
								<q-checkbox
									class="NewsCreateModal__checkbox"
									:value="form.setup.includes(group.id)"
									:label="group.name"
									@input="check($event, group.id)"/>
							</q-item-main>
						</q-item>
					</q-list>
				</div>

				<q-btn
					color="primary"
					class="NewsCreateModal__button"
					v-if="!app_view_mobile"
					@click="save">
					Сохранить
				</q-btn>

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
import {
	AuthMixin
} from '@/mixins'
import { New } from '@/lib'

export default {
	components: {

	},
	mixins: [AuthMixin],
	props: {

	},
	data() {
		return {
			form: new New(),
			toolbar: [
				['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
				['token', 'hr', 'link', 'custom_btn'],
				['print', 'fullscreen'],
				[
					{
						//label: this.$q.i18n.editor.formatting,
						icon: this.$q.icon.editor.formatting,
						list: 'no-icons',
						options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
					},
					{
						//label: this.$q.i18n.editor.fontSize,
						icon: this.$q.icon.editor.fontSize,
						fixedLabel: true,
						fixedIcon: true,
						list: 'no-icons',
						options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
					},
					{
						//label: this.$q.i18n.editor.defaultFont,
						icon: this.$q.icon.editor.font,
						fixedIcon: true,
						list: 'no-icons',
						options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
					},
					'removeFormat'
				],
				['quote', 'unordered', 'ordered', 'outdent', 'indent'],
				[
					{
						//label: this.$q.i18n.editor.align,
						icon: this.$q.icon.editor.align,
						fixedLabel: true,
						list: 'only-icons',
						options: ['left', 'center', 'right', 'justify']
					},
				],
				['undo', 'redo']
			],
			fonts: {
				arial: 'Arial',
				arial_black: 'Arial Black',
				comic_sans: 'Comic Sans MS',
				courier_new: 'Courier New',
				impact: 'Impact',
				lucida_grande: 'Lucida Grande',
				times_new_roman: 'Times New Roman',
				verdana: 'Verdana'
			}
		}
	},
	watch: {
		async modal (n) {
			if (!n) return
			this.form = this.id ? await New.getOne(this.id) : new New()
		}
	},
	computed: {
		...mapGetters([
			'app_view_mobile'
		]),
		...mapState('news', {
			id: state => state.form.id,
			modalGetter: state => state.form.modal,
			groups: state => state.cached.groups
		}),
		modal: {
			get () {
				return this.modalGetter
			},
			set (value) {
				this.$store.commit('news/modalSet', value)
			}
		}
	},
	methods: {
		save () {
			this.$store.dispatch('news/save', this.form)

			this.modal = false
		},
		...mapMutations('news', [
			'toggleModalCreate'
		]),
		check (value, id) {
			value ?
				this.form.setup.push(+id)
			:	this.form.setup = this.form.setup.filter(el => el != +id)
		}
	},
}
</script>


<style lang="stylus">
.NewsCreate
	padding 10px

.NewsCreateModal
	&__content
		padding 20px

	&__editor
		margin 10px 0

	&__middle
		display grid
		grid-gap 10px
		grid-template-columns minmax(400px, 1fr) 300px

	&__checkbox
		user-select none
</style>
