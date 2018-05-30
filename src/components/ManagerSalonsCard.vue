<template>
	<q-card class="ManagerSalonsCard" v-if="auth_can({
		'Salon': 1,
		'SalonsSetup': 1
	})">
		<q-card-title>
			Доступ к отдельным салонам
		</q-card-title>

		<q-card-main>
			<q-list>
				<q-item v-for="salon, index in salon_list" :key="index">
					<q-item-main>
						<q-checkbox
							:value="checked.includes(+salon.id)"
							:label="salon.name"
							@input="check($event, salon.id)"/>
					</q-item-main>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="managerSalons_saveState" v-if="auth_can({
				'Salon': 1,
				'SalonsSetup': 4
			})">Сохранить выбраные салоны</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { AuthMixin } from '@/mixins'

export default {
	mixins: [AuthMixin],
	watch: {
		personal_current () {
			this.managerSalons_getSetup()
		}
	},
	computed: {
		...mapGetters([
			'salon_list'
		]),
		...mapState ('managerSalons', {
			checked: state => state.cached.salons
		}),
		...mapGetters([
			'personal_current'
		])
	},
	methods: {
		...mapActions('managerSalons', [
			'managerSalons_init',
			'managerSalons_saveState',
			'managerSalons_getSetup'
		]),
		...mapMutations('managerSalons', [
			'managerSalons_check',
			'managerSalons_uncheck',
		]),
		check (value, salon_id) {
			value ?
				this.managerSalons_check(salon_id)
			:	this.managerSalons_uncheck(salon_id)
		}
	},
	created () {
		this.managerSalons_init()
	}
}
</script>


<style lang="stylus">

</style>
