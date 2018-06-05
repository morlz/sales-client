<template>
<div class="permissionsGroups">
	<q-scroll-observable @scroll="scroll"/>

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

	<q-card class="permissionsGroups__groups" ref="groups" :style="{ transform: `translateY(${offset.groups}px)`, marginTop: `${margin.groups}px`}">
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
			<q-field>
				<q-input v-model="local_search" float-label="Поиск"/>
			</q-field>

			<q-list no-border>
				<permissions-groups-salon v-for="item, index in local_searched" :key="item.id" :content="item"/>
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

import PermissionsGroupsGroup from '@/components/PermissionsGroupsGroup'
import PermissionsGroupsSalon from '@/components/PermissionsGroupsSalon'
import { tween } from 'popmotion'

export default {
	components: {
		PermissionsGroupsGroup,
		PermissionsGroupsSalon
	},
	data() {
		return {
			local_search: '',
			offset: {
				groups: 0
			},
			margin: {
				groups: 0
			},
			toTopAnimation: null,
			animateHeightStartTime: 0
		}
	},
	computed: {
		...mapGetters('salonGroups', [
			'salonGroups_groups',
			'salonGroups_salons'
		]),
		local_searched () {
			if (this.local_search == '')
				return this.salonGroups_salons

			return this.salonGroups_salons.filter(
				el => el.name.toLowerCase().indexOf(this.local_search.toLowerCase()) + 1
				|| el.id == this.local_search
			)
		}
	},
	methods: {
		...mapActions('salonGroups', [
			'salonGroups_init',
			'salonGroups_createGroup',
			'salonGroups_saveState'
		]),
		...mapMutations('salonGroups', [
			'salonGroups_setAddGroup'
		]),
		scroll (e) {
			const offset = 10
			let rect = this.$refs.groups.$el.getBoundingClientRect()

			if (e.position < 335)
				return this.offset.groups = 0

			if (window.innerHeight < this.$refs.groups.$el.offsetHeight) {
				if (e.direction == 'down') {
					if (rect.top > window.innerHeight - this.$refs.groups.$el.offsetHeight + offset) return
					return this.offset.groups = e.position + (window.innerHeight - this.$refs.groups.$el.offsetHeight) - (345 + offset)
				} else {
					if (rect.bottom - this.$refs.groups.$el.offsetHeight < offset) return
					return this.offset.groups = e.position - (345 - offset)
				}
			}

			this.offset.groups = e.position - 335
		},
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
	overflow: hidden;

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
