<template>
	<div class="modelsWrapper" :class="{ oneColumn: !main_auth_settings.showModels }">
		<q-card class="modelList" v-if="main_auth_settings.showModels" v-loading="loading">
			<q-card-title>Модель</q-card-title>

			<q-card-main class="models">
				<div class="model"
					v-for="item, index in models"
					:class="{ selected: current == item.MODEL || (!current && item.MODEL == 'Все модели') }"
					@click="clickHandler(item.MODEL)"
				>
					<div class="name">{{ item.MODEL }}</div>
					<div class="count">{{ item.count }}</div>
				</div>
			</q-card-main>
		</q-card>

		<div class="content">
			<slot/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QCard, QCardTitle, QCardMain } from 'quasar'

export default {
	props: {
		current: {},
		models: {
			type: Array
		},
		loading: {
			type: Boolean
		}
	},
	components: {
		QCard,
		QCardTitle,
		QCardMain
	},
	methods: {
		...mapMutations([
			'main_auth_settings_set'
		]),
		clickHandler (data) {
			this.$emit("select", data)
		}
	},
	computed: {
		...mapGetters([
			'main_auth_settings',
		]),
		showModels: {
			get () {
				return this.main_auth_settings.showModels
			},
			set (n) {
				this.main_auth_settings_set({ type: 'showModels', data: n })
			}
		}
	}
}
</script>


<style lang="less">
.modelsWrapper {
	width: 100%;
	height: ~"calc(100vh - 100px)";
	display: grid;
	grid-template-columns: 180px ~"calc(100% - 180px)";
	grid-template-rows: ~"calc(100vh - 120px)";
	align-items: start;
	.modelList {
		height: ~"calc(100% - 10px)";
		overflow-y: auto;
		.el-card__body {
			padding: 7px;
		}
		align-self: start;
		.modles {
			height: 100%;
		}
		.model {
			display: grid;
			grid-auto-flow: column;
			justify-content: space-between;
			align-items: center;
			cursor: pointer;
			transition: all 0.3s ease-in-out;
			&:hover {
				background-color: rgba(51, 122, 183, 0.1);
			}
		}
		.selected {
			color: #409EFF;
		}
	}
	.content {
		height: 100%;
	}
}

.oneColumn {
	grid-template-columns: 1fr;
}
</style>
