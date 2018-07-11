<template>
<q-card class="card ManagerProfileCard" v-if="auth_can(1, 'Manager')">
	<q-card-title>
		Основная ифнормация
	</q-card-title>

	<template v-if="edit">
		<q-card-main class="ManagerProfileCardEdit">
			<q-field :style="{marginBottom: '10px'}">
				<upload-image @input="imageSelect"/>
			</q-field>

			<q-field>
				<q-input v-model="editFields.fio" float-label="ФИО"/>
			</q-field>

			<q-field>
				<q-input v-model="editFields.phone" float-label="Телефон"/>
			</q-field>

			<q-field>
				<q-input v-model="editFields.email" float-label="Email"/>
			</q-field>

			<q-field>
				<q-input v-model="editFields.skype" float-label="Skype"/>
			</q-field>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" v-if="auth_can(3, 'Manager')" @click="save">Сохранить</q-btn>
			<q-btn flat color="secondary" v-if="auth_can(3, 'Manager')" @click="edit = !edit">Отменить</q-btn>
		</q-card-actions>
	</template>

	<template v-else>
		<q-card-main>
			<div class="ManagerProfile">
				<div
					class="ManagerProfile__avatar"
					v-if="data.avatar"
					:style="{ backgroundImage: `url(${data.avatar.href})` }"/>
				<div class="ManagerProfile__name">{{ data.fio }}</div>
				<div class="ManagerProfile__dolz">{{ data.UPOST }}</div>
				<div class="ManagerProfile__contacts">
					<div>Телефон</div>
					<div>
						<base-phone v-if="data.phone" :value="data.phone" :place="{ profile: data }"/>
					</div>
					<div>Эл почта</div>
					<div>{{ data.email }}</div>
					<div>Скайп</div>
					<div>{{ data.skype }}</div>
				</div>
			</div>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" v-if="auth_can(3, 'Manager')" @click="edit = !edit">Редактировать</q-btn>
		</q-card-actions>
	</template>
</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import {
	AuthMixin
} from '@/mixins'
import BasePhone from '@/components/BasePhone'
import UploadImage from '@/components/UploadImage'

export default {
	components: {
		BasePhone,
		UploadImage
	},
	mixins: [AuthMixin],
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			editFields: {},
			editImage: null
		}
	},
	computed: {
		...mapGetters([
			'personal_edit'
		]),
		edit: {
			get () {
				return this.personal_edit
			},
			set (val) {
				this.$store.commit('personal_editSet', val)
			}
		},
		data () {
			this.editFields = this.content.clone()
			return this.content
		}
	},
	methods: {
		imageSelect (e) {
			this.editFields.editImage = e
		},
		async save () {
			if ( !await this.$store.dispatch('personal_save', this.editFields) ) return
			this.edit = false
		}
	}
}
</script>


<style lang="stylus">
.ManagerProfileCard
	display grid
	grid-template-rows max-content 1fr max-content


.ManagerProfile
	display grid
	justify-items center
	grid-gap 10px

	&__avatar
		width 200px
		height 200px
		border-radius 100px
		border 3px solid #d2d6de
		background-position center
		background-size cover
		border 3px solid rgba(0, 0, 0, 0.1)
		margin 10px auto

	//&__name
	//&__dolz

	&__contacts
		width 100%
		display grid
		grid-template-columns 1fr 1fr
		justify-content space-between
		padding 10px 0
		> div
			padding 10px 5px
			border-top 1px solid #ddd
			&:nth-child(2n)
				text-align right

.ManagerProfileCardEdit
	display grid
	grid-gap 10px
	align-content start
</style>
