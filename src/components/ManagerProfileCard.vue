<template>
	<q-card class="card ManagerProfileCard" v-if="auth_can(1, 'Manager')">
		<q-card-title>
			Основная ифнормация
		</q-card-title>

		<q-card-main>
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
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" v-if="auth_can(3, 'Manager')">Редактировать</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { AuthMixin } from '@/mixins'

export default {
	mixins: [AuthMixin],
	props: {
		content: {
			type: Object,
			required: true
		}
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
.ManagerProfileCard {
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
