<template>
	<q-item class="permissionsGroup" :class="{ 'permissionsGroup-selected' : item.selected }">
		<q-item-side>
			<div v-if="salonGroups_groupCheckboxHide">
				{{ item.id }}
			</div>
			<q-toggle v-model="checked" class="permissionsGroup__checkbox" v-if="!salonGroups_groupCheckboxHide"/>
		</q-item-side>

		<q-item-main>
			<q-slide-transition>
				<q-item-tile v-if="!edit" @click.native="salonGroups_selectItem({ type: 'groups', id: item.id})" class="permissionsGroup__name">
					{{ item.name }}
				</q-item-tile>
			</q-slide-transition>

			<q-slide-transition>
				<q-item-tile v-if="edit" class="permissionsGroup__edit">
					<q-input v-model="editFields.name" float-label="Имя роли"/>
				</q-item-tile>
			</q-slide-transition>
		</q-item-main>

		<q-item-side right class="permissionsGroup__buttons">
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

				<q-btn flat color="red" @click="salonGroups_deleteGroup(item.id)" :disabled="(item.salons == undefined || !item.salons || !!item.salons.length)">
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

import { QItem, QItemMain, QItemTile, QItemSide, QToggle, QBtn, QInput, QIcon, QSlideTransition, QField } from 'quasar'


export default {
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	components: {
		QItem, QItemMain, QItemTile, QItemSide, QToggle, QBtn, QInput, QIcon, QSlideTransition, QField
	},
	data() {
		return {
			edit: false,
			editFields: {}
		}
	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_groupCheckboxHide'
		]),
		item () {
			let data = Object.assign({ salons: false }, this.content)
			this.editFields = data
			return data
		},
		checked: {
			get () {
				return this.content.checked
			},
			set (n) {
				if (!n) return
				this.salonGroups_checkedGroupChange({ checked: true, item: this.item })
			}
		}
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_deleteGroup',
			'salonGroups_updateGroup',
			'salonGroups_checkedGroupChange'
		]),
		...mapMutations('salonGroups', [
			'salonGroups_selectItem',
		]),
		update () {
			this.salonGroups_updateGroup(this.editFields)
			this.edit = false
		}
	},
}
</script>


<style lang="less">
.permissionsGroup {
	&-selected {
		background: #ecf5ff;
	}

	&__name {
		cursor: pointer;
	}

	&__checkbox {

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
