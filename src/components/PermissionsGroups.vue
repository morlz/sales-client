<template>
<div class="permissionsGroups">
	<q-btn icon="save" color="primary" @click="salonGroups_saveState" class="permissionsGroups__saveState">Сохранить состояние</q-btn>

	<q-card class="permissionsGroups__addGroup">
		<q-card-title>
			<h5>Добавить группу салонов</h5>
		</q-card-title>

		<q-card-main>
			<q-input value="" @input="salonGroups_setAddGroup" float-label="Имя новой группы"/>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="salonGroups_createGroup" icon="check" flat>
				Добавить
			</q-btn>
		</q-card-actions>
	</q-card>

	<q-card class="permissionsGroups__groups">
		<q-card-title>
			Список групп
		</q-card-title>

		<q-card-main>
			<q-list no-border>
				<permissions-groups-group v-for="item, index in salonGroups_groups" :key="item.id" :content="item"/>
			</q-list>
		</q-card-main>
	</q-card>


	<q-card class="permissionsGroups__salons">
		<q-card-title>
			Список салонов
		</q-card-title>

		<q-card-main>
			<q-list no-border>
				<permissions-groups-salon v-for="item, index in salonGroups_salons" :key="item.ID_SALONA" :content="item"/>
			</q-list>
		</q-card-main>
	</q-card>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import { QList, QItem, QItemMain, QItemSide, QCheckbox, QItemTile, QCard, QCardMain, QCardTitle, QCardActions, QInput, QBtn } from 'quasar'

import PermissionsGroupsGroup from '@/components/PermissionsGroupsGroup'
import PermissionsGroupsSalon from '@/components/PermissionsGroupsSalon'

export default {
	components: {
		QList,
		QItem,
		QItemMain,
		QItemSide,
		QCheckbox,
		QItemTile,
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QInput,
		QBtn,
		PermissionsGroupsGroup,
		PermissionsGroupsSalon
	},
	data() {
		return {}
	},
	watch: {

	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_groups',
			'salonGroups_salons'
		]),
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_init',
			'salonGroups_createGroup',
			'salonGroups_saveState'
		]),
		...mapMutations('salonGroups', [
			'salonGroups_setAddGroup'
		])
	},
	mounted () {
		this.salonGroups_init()
	}
}
</script>


<style lang="less">
.permissionsGroups {
	display: grid;
	grid-template: max-content max-content 1fr ~"/" 1fr 1fr;
	grid-gap: 10px;
	background: #EEEEEE;
	align-items: start;

	&__groups, &__salons, &__addGroup {
		background: #fff;
	}
	&__groups {

	}

	&__salons {
		grid-area: ~"2 / 2 / 4 / 3";
	}

	&__addGroup {

	}

	&__saveState {
		grid-area: ~"1 / 1 / 2 / 3";
		justify-self: end;
	}
}
</style>
