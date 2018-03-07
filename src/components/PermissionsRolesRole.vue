<template>
	<q-item class="permissionsRole" :class="{ 'permissionsRole-selected' : item.selected }">
		<q-item-side>
			{{ item.id }}
		</q-item-side>

		<q-item-main>
			<q-slide-transition>
				<q-item-tile v-if="!edit" @click="permissions_selectItem({ type: 'roles', id: item.id})" class="permissionsRole__name">
					{{ item.name }}
				</q-item-tile>
			</q-slide-transition>

			<q-slide-transition>
				<q-item-tile v-if="edit" class="permissionsRole__edit">
					<q-input v-model="editFields.name" float-label="Имя роли"/>
				</q-item-tile>
			</q-slide-transition>

			<q-slide-transition>
				<q-item-tile v-if="!permissions_rolesSliderHide" @click.stop class="permissionsRole__slider">
					<q-slider v-model="access_level" :min="0" :max="4" :label-value="sliderLabel" label/>
				</q-item-tile>
			</q-slide-transition>
		</q-item-main>

		<q-item-side right class="permissionsRole__buttons">
			<q-item-tile v-if="edit">
				<q-btn flat @click="update">
					<q-icon name="save"/>
				</q-btn>

				<q-btn flat color="secondary" @click="edit = !edit">
					<q-icon name="cancel"/>
				</q-btn>
			</q-item-tile>

			<q-item-tile v-else>
				<q-btn flat @click="edit = !edit" color="primary">
					<q-icon name="edit"/>
				</q-btn>

				<q-btn flat color="red" @click="permissions_deleteRole(item.id)">
					<q-icon name="delete"/>
				</q-btn>
			</q-item-tile>
		</q-item-side>
	</q-item>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QItem, QItemMain, QItemTile, QItemSide, QSlider, QBtn, QInput, QIcon, QSlideTransition, QField } from 'quasar'

import fieldDescription from '@/static/fieldDescription'

let { lvls } = fieldDescription

export default {
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	components: {
		 QItem,
		 QItemMain,
		 QItemTile,
		 QItemSide,
		 QSlider,
		 QBtn,
		 QInput,
		 QIcon,
		 QSlideTransition,
		 QField
	},
	data() {
		return {
			access_level: 0,
			edit: false,
			editFields: {}
		}
	},
	watch: {
		access_level (access_level) {
			if (this.access_level == this.content.access_level) return
			this.permissions_roleLevelChange({ access_level, item: this.item })
		}
	},
	computed: {
		...mapGetters([
			'permissions_rolesSliderHide'
		]),
		item () {
			let data = Object.assign({}, this.content)
			this.editFields = data
			this.access_level = this.content.access_level
			return data
		},
		sliderLabel () {
			return lvls[this.access_level]
		}
	},
	methods: {
		...mapActions([
			'permissions_updateRole',
			'permissions_roleLevelChange',
			'permissions_deleteRole'
		]),
		...mapMutations([
			'permissions_selectItem'
		]),
		update () {
			this.permissions_updateRole(this.editFields)
			this.edit = false
		}
	},
}
</script>


<style lang="less">
.permissionsRole {
	&-selected {
		background: #ecf5ff;
	}

	&__name {
		cursor: pointer;
	}

	&__slider {

	}

	&__buttons {
		.q-item- {
			display: grid;
			grid-auto-flow: column;
		}
	}

	&__edit {
		padding: 1px 0;
		box-sizing: border-box;
	}
}
</style>
