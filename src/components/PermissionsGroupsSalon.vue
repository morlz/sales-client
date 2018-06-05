<template>
	<q-item class="permissionsSalon" :class="{ 'permissionsSalon-selected' : selected }">
		<q-item-side>
			<div v-if="salonGroups_salonCheckboxHide" class="permissionsSalon__ids">
				<div class="">
					{{ item.id }}
				</div>

				<div class="">
					{{ group_id }}
				</div>
			</div>

			<q-toggle v-model="checked" class="permissionsSalon__checkbox" v-if="!salonGroups_salonCheckboxHide"/>
		</q-item-side>

		<q-item-main>
			<q-item-tile @click.native="salonGroups_selectItem({ type: 'salons', id: item.id})" class="permissionsSalon__name">
				{{ item.NAME }}
			</q-item-tile>
		</q-item-main>
	</q-item>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

export default {
	components: {},
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_salonCheckboxHide',
			'salonGroups_checked',
			'salonGroups_selected',
			'salonGroups_changed'
		]),
		item () {
			return this.content
		},
		checked: {
			get () {
				return this.salonGroups_checked[this.salonGroups_selected.id].includes(this.content.id)
			},
			set (checked) {
				this.salonGroups_salonCheck({ checked, salon: this.content })
			}
		},
		selected () {
			return this.salonGroups_selected.type == 'salons' && this.content.id == this.salonGroups_selected.id
		},
		group_id () {
			if (this.salonGroups_changed[this.content.id] !== undefined)
				return this.salonGroups_changed[this.content.id]

			return this.content.group_id
		}
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_salonCheck'
		]),
		...mapMutations('salonGroups', [
			'salonGroups_selectItem'
		])
	},
}
</script>


<style lang="less">
.permissionsSalon {
	&-selected {
		background: #ecf5ff;
	}

	&__name {
		cursor: pointer;
	}

	&__checkbox {

	}

	&__ids {
		display: grid;
		width: 70px;
		grid-template-columns: 1fr 1fr;
		justify-items: center;
	}


	&__edit {
		padding: 1px 0;
		box-sizing: border-box;
	}
}
</style>
