<template>
<q-card class="InfoCardPreorder" v-if="auth_can(1, 'Preorder')">
	<q-card-title>
		Общая информация о предзаказе
	</q-card-title>

	<q-card-main>
		<el-steps :active="+data.status_id" align-center finish-status="success">
			<el-step :title="item.title" v-for="item, index in preorder_statuses" :key="index" />
		</el-steps>

		<div class="infoGrid">
			<div>Салон</div>
			<div>{{ data.salon ? data.salon.NAME : '...' }}</div>
			<div>Менеджер</div>
			<div>{{ data.manager ? data.manager.FIO : '...' }}</div>
			<div>Дата создания</div>
			<div>{{ data.created_at }}</div>
			<div>Клиент</div>
			<div>{{ data.contactFaces ? data.contactFaces.find(el => el.regard == "Основной").fio : '...' }}</div>
			<div>Рекл. источник</div>
			<div>{{ data.adsource ? data.adsource.NAME : '...' }}</div>
			<div>Вероятность</div>
			<div>
				<el-rate :value="+data.chance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled />
			</div>
			<div>Бюджет</div>
			<div>{{ data.budget }}</div>
			<div>Сумма предоплаты</div>
			<div>{{ data.prepay_summ }}</div>
			<div>Сумма расчёта</div>
			<div>{{ data.calc_summ }}</div>
			<div class="lc">Примечание</div>
			<div class="lc">{{ data.description }}</div>
		</div>
	</q-card-main>

	<q-card-actions>
		<q-btn color="primary" icon="edit">Редактировать</q-btn>
	</q-card-actions>
</q-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import mixins from '@/mixins'




export default {
	mixins: [mixins],
	props: ['content'],
	computed: {
		...mapGetters([
			'preorder_statuses'
		]),
		data() {
			return this.content || {}
		}
	}
}
</script>


<style lang="less">
.InfoCardPreorder {

}
</style>
