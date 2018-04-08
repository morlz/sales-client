<template>
<div class="mainWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/profile/${oneId}` }">{{ fio }}</el-breadcrumb-item>
	</el-breadcrumb>
	<div class="mainProfile cards">
		<el-card class="card">
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
				<el-button type="primary">Редактировать</el-button>
			</div>
		</el-card>

		<el-card class="card">
			<h2 class="title" slot="header">Подробная информация</h2>

			<div class="">
				{{ data }}
			</div>

			<div class="buttons"></div>
		</el-card>
	</div>
</div>
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
