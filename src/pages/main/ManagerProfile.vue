<template>
<q-page class="AppContent">
	<div class="ManagerPofile AppContent__inner">
		<q-card>
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
				<q-btn type="primary">Редактировать</q-btn>
			</q-card-actions>
		</q-card>

		<q-card>
			<q-card-title>
				Подробная информация
			</q-card-title>

			<q-card-main>
				{{ data }}
			</q-card-main>

			<q-card-actions>
			</q-card-actions>
		</q-card>
	</div>
</q-page>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import mixins from '@/mixins'

export default {
	mixins: [mixins],
	data () {
		return {

		}
	},
	watch: {
		oneId() {
			if (this.isOne) this.getManagerProfileById(this.oneId)
		}
	},
	methods: {
		...mapActions([
			'getManagerProfileById'
		])
	},
	computed: {
		data () {
			return this.currentManagerProfile || {}
		},
		...mapGetters([
			'currentManagerProfile'
		]),
		fio () {
			return `${this.data.FIO} ${this.data.IMY} ${this.data.OTCH}`
		}
	},
	mounted () {
		if (this.isOne) this.getManagerProfileById(this.oneId)
	}
}
</script>



<style lang="less">
.mainWrapper {
	.cards {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: 1fr 1fr;
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
}

@media screen and (max-width: 1250px) {
	.mainWrapper {
		.cards {
			grid-template-columns: 1fr;
		}
	}
}
</style>
