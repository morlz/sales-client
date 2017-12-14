<template>
	<el-card class="clientInfo">
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

export default {
	props: ['content'],
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
		display: grid;
		grid-template-columns: 130px 1fr;
		> div {
			padding: 5px 0;
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
