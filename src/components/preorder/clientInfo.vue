<template>
	<el-card class="clientInfo" v-if="auth_can(1, 'Client')">
		<div slot="header">
			<h2>Информация о клиенте</h2>
		</div>

		<div class="infoGrid">
			<div>ФИО</div>
			<div>{{ data.lastname }} {{ data.name }} {{ data.patronymic }}</div>
			<div>Пол</div>
			<div>{{ data.contactfaces ? data.contactfaces.find(el => el.regard == 'Основной').gender : '...' }}</div>
			<div>Приметы</div>
			<div>{{ data.signs }}</div>
			<div>Менеджер</div>
			<div>{{ data.manager ? data.manager.FIO : '' }}</div>
			<div class="lc">Неактивен</div>
			<div class="lc">{{ data.notactive }}</div>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/mixins'


export default {
	mixins: [mixins],
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	data () {
		return {}
	},
	watch: {

	},
	methods: {

	},
	computed: {
		data () {
			return this.content || {}
		}
	}
}
</script>


<style lang="less">
.clientInfo {
	.infoGrid {
		align-self: start;
		display: grid;
		grid-template-columns: 130px 1fr;
		align-content: center;
		> div {
			padding: 15px 0;

			&:not(.lc) {
				border-bottom: 1px solid #f4f4f4;
			}
			&:nth-child(2n+1) {
				font-weight: bold;
			}
		}
	}
}

</style>
