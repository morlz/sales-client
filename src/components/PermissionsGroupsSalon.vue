<template>
	<q-item class="permissionsSalon" :class="{ 'permissionsSalon-selected' : item.selected }">
		<q-item-side>
				<div v-if="salonGroups_salonCheckboxHide">
					{{ item.ID_SALONA }}
				</div>

			<q-toggle v-model="checked" class="permissionsSalon__checkbox" v-if="!salonGroups_salonCheckboxHide"/>
		</q-item-side>

		<q-item-main>
			<q-item-tile @click.native="salonGroups_selectItem({ type: 'salons', id: item.ID_SALONA})" class="permissionsSalon__name">
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
			checked: false,
		}
	},
	watch: {
		checked (checked) {
			if (this.checked == this.content.checked) return
			this.salonGroups_checkedSalonChange({ checked, item: this.item })
		}
	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_salonCheckboxHide'
		]),
		item () {
			let data = Object.assign({}, this.content)
			this.checked = this.content.checked
			return data
		}
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_checkedSalonChange'
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


	&__edit {
		padding: 1px 0;
		box-sizing: border-box;
	}
}
</style>
