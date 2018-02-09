<template>
	<el-card class="card userProfileCard" v-if="auth_can(1, 'Manager')">
		<h2 class="title" slot="header">Основная ифнормация</h2>

		<div class="gridInfo">
			<div class="info">
				<div class="avatar"></div>
				<div class="name">{{fio}}</div>
				<div class="dolz">{{data.UPOST}}</div>
			</div>
			<div class="contacts">
				<div>Телефон</div>
				<div>{{data.phone}}</div>
				<div>Эл почта</div>
				<div>{{data.email}}</div>
				<div>Скайп</div>
				<div>{{data.skype}}</div>
			</div>
		</div>


		<div class="buttons">
			<QBtn color="primary" v-if="auth_can(3, 'RoleSetup')">Редактировать</QBtn>
		</div>
	</el-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import mixins from '@/components/mixins'
import { QBtn } from 'quasar'

export default {
	mixins: [mixins],
	props: {
		content: {
			type: Object,
			required: true
		}
	},
	components: {
		QBtn
	},
	computed: {
		data () {
			return this.content || {}
		},
		fio () {
			return `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}`
		}
	}
}
</script>


<style lang="less">
.userProfileCard {
	.gridInfo {
		display: grid;
		.info {
			margin-bottom: 15px;
			display: grid;
			grid-gap: 20px;
			grid-auto-flow: row;
			justify-items: center;
			.avatar {
				width: 200px;
				height: 200px;
				border-radius: 100px;
				border: 3px solid #d2d6de;
			}
		}
		.contacts {
			display: grid;
			grid-template-columns: 1fr 1fr;
			justify-content: space-between;
			padding: 10px 0;
			div {
				padding: 10px 5px;
				border-top: 1px solid #ddd;
				&:nth-child(2n) {
					text-align: right;
				}
			}
		}
	}
}

</style>
