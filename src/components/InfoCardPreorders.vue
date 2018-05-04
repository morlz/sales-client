<template>
	<q-card class="preorders" v-if="auth_can(1, 'Preorder')">
		<q-card-title>
			Предзаказы
		</q-card-title>

		<q-card-main>
			<q-tabs inverted v-if="hasTabs" v-model="currentTab">
				<q-tab slot="title" label="Предстоящие" name="next" :default="hasNext" v-if="hasNext"/>
				<q-tab slot="title" label="Выполеные" name="end" :default="!hasNext" v-if="hasPrev"/>
			</q-tabs>

			<table-collapsible :columns="InfoCardPreorders" :rows="dataFiltred" @click="routerGoIdPath('/preorder/preorders')(null, $event)"/>

			<div v-if="!hasTabs">
				Предзаказов нет
			</div>
		</q-card-main>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { InfoCardPreorders } from '@/static/fieldDescription'
import { AuthMixin, RouteMixin } from '@/mixins'
import TableCollapsible from '@/components/TableCollapsible'
import { Preorder } from '@/lib'


export default {
	props: {
		content: {
			type: Array,
			default: a => []
		}
	},
	mixins: [AuthMixin, RouteMixin],
	components: {
		TableCollapsible
	},
	data () {
		return {
			InfoCardPreorders,
			currentTab: 'next'
		}
	},
	computed: {
		...mapGetters([
			'salon_list',
			'cachedManagers',
			'preorder_statuses'
		]),
		data () {
			return this.content.map(el => el instanceof Preorder ? el : new Preorder(el))
		},
		hasPrev () {
			return !!this.data.filter(el => el.end_at !== null).length
		},
		hasNext () {
			return !!this.data.filter(el => el.end_at === null).length
		},
		hasTabs () {
			return this.hasPrev || this.hasNext
		},
		dataFiltred () {
			switch (this.currentTab) {
				case 'prev':
					return this.data.filter(el => el.end_at !== null && this.$moment(el.end_at) < this.$moment())
					break;

				case 'next':
					return this.data.filter(el => el.end_at === null || this.$moment(el.end_at) > this.$moment())
					break;
			}
		}
	}
}
</script>


<style lang="less">

</style>
