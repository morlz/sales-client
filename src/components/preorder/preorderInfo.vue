<template>
<el-card class="preorderInfo" v-if="auth_can(1, 'Preorder')">
	<h2 slot="header">Общая информация</h2>

	<el-steps :active="+data.status_id" align-center finish-status="success">
		<el-step :title="item.title" v-for="item, index in preorder_statuses" :key="index"></el-step>
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

	<div class="buttons">
		<el-button type="primary" icon="el-icon-edit">Редактировать</el-button>
	</div>
</el-card>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import mixins from '@/components/mixins'




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
.preorderInfo {

}
</style>
