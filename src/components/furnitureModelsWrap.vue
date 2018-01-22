<template>
	<div class="modelsWrapper" :class="{ oneColumn: !auth_settings.showModels }">
		<el-card class="modelList" v-if="auth_settings.showModels" v-loading="loading">
			<div class="title" slot="header">Модель</div>
			<div class="model"
				v-for="item, index in models"
				:class="{ selected: current == item.MODEL || (!current && item.MODEL == 'Все модели') }"
				@click="clickHandler(item.MODEL)"
			>
				<div class="name">{{ item.MODEL }}</div>
				<div class="count">{{ item.count }}</div>
			</div>
		</el-card>

		<div class="content">
			<slot/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
	methods: {
		...mapMutations([
			'auth_settings_showModelsSet'
		]),
		clickHandler (data) {
			this.$emit("select", data)
		}
	},
	computed: {
		...mapGetters([
			'auth_settings',
		]),
		showModels: {
			get () {
				return this.auth_settings.showModels
			},
			set (n) {
				this.auth_settings_showModelsSet(n)
			}
		}
	}
}
</script>


<style lang="less">
.modelsWrapper {
	width: 100%;
	display: grid;
	grid-template-columns: 160px 1fr;
	grid-gap: 10px;
	.modelList {
		.el-card__body {
			padding: 7px;
		}
		align-self: start;
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
}

.oneColumn {
	grid-template-columns: 1fr;
}
</style>
