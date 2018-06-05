<template>
	<q-item class="permissionsGroup" :class="{ 'permissionsGroup-selected' : selected }">
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
				<q-item-tile v-if="edit && editFields.id" class="permissionsGroup__edit">
					<q-input v-model="editFields.groupName" float-label="Имя роли"/>
					<q-checkbox v-for="label, checkbox in checkboxes" :key="checkbox" v-model="editFields[checkbox]" :label="label" @change="$nextTick($forceUpdate)"/>
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

				<q-btn flat color="red" @click="salonGroups_deleteGroup(item.id)" :disable="!!(salonGroups_checked[content.id] || []).length">
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
import { SalonGroup } from '@/lib'

export default {
	components: {},
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			edit: false,
			editFields: {},
			checkboxes: SalonGroup.options
		}
	},
	watch: {
		edit(n){
			this.$emit('edit', n)
		}
	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_groupCheckboxHide',
			'salonGroups_checked',
			'salonGroups_selected'
		]),
		item () {
			this.editFields = Object.keys(this.checkboxes)
				.reduce(
					(prev, checkbox) => prev.update({ [checkbox]: !!prev[checkbox] }),
					this.content.clone()
				)

			return this.content
		},
		checked: {
			get () {
				return this.salonGroups_checked[this.content.id].includes(+this.salonGroups_selected.id)
			},
			set (checked) {
				this.salonGroups_groupCheck({ checked, group: this.content })
			}
		},
		selected () {
			return this.salonGroups_selected.type == 'groups' && this.content.id == this.salonGroups_selected.id
		}
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_deleteGroup',
			'salonGroups_updateGroup',
			'salonGroups_groupCheck'
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

	.q-radial-ripple {
		transform: none;
		margin: -50% -50%;
	}
}
</style>
