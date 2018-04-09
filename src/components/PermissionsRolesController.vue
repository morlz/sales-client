<template>
	<q-item class="permissionsController" :class="{ 'permissionsController-selected' : item.selected }">
		<q-item-side>
			{{ item.id }}
		</q-item-side>

		<q-item-main>
			<q-slide-transition>
				<q-item-tile v-if="!edit" @click.native="permissions_selectItem({ type: 'controllers', id: item.id})" class="permissionsController__name">
					{{ item.name }}
				</q-item-tile>
			</q-slide-transition>

			<q-slide-transition>
				<q-item-tile v-if="edit" class="permissionsRole__edit">
					<q-input v-model="editFields.name" float-label="Имя роли"/>
				</q-item-tile>
			</q-slide-transition>

			<q-slide-transition>
				<q-item-tile v-if="!permissions_controllersSliderHide" @click.stop>
					<q-slider v-model="access_level" :min="0" :max="4" :label-value="sliderLabel" label/>
				</q-item-tile>
			</q-slide-transition>
		</q-item-main>

		<q-item-side right class="permissionsController__buttons">
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

				<q-btn flat color="red" @click="permissions_deleteController(item.id)">
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

import { QItem, QItemMain, QItemTile, QItemSide, QSlider, QBtn, QInput, QIcon, QSlideTransition } from 'quasar'

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
		 QSlideTransition
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
			this.permissions_controllerLevelChange({ access_level, item: this.item })
		}
	},
	computed: {
		...mapGetters([
			'permissions_controllersSliderHide'
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
			'permissions_updateController',
			'permissions_controllerLevelChange',
			'permissions_deleteController'
		]),
		...mapMutations([
			'permissions_selectItem'
		]),
		update () {
			this.permissions_updateController(this.editFields)
			this.edit = false
		}
	},
}
</script>


<style lang="less">
.permissionsController {
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
