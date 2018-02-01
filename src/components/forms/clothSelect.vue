<template>
<div class="clothSelectWrapper" :key="index">
	<div class="clothSelected"
		@click="!disabled ?open = true : null"
		:style="{ 'background-image': value && !disabled ? `url(${noImage})` : '' }"
		:class="{ disabled: disabled }">
		<div class="buttonName" :class="{ edit: value }" v-if="!disabled">{{ value ? 'Изменить' : 'Выбрать' }}</div>
		<div class="clothNameWrapper" v-if="value">
			<div class="clothName">{{ value.name }}</div>
		</div>
	</div>

	<el-dialog title="Выбор ткани" :visible.sync="open" :key="index" class="clothDialog" width="500px" top="100px">
		<div class="search">
			<el-input v-model="local_search" placeholder="Поиск"/>
		</div>

		<div class="itemsWrapper" v-loading="furniture_clothSelectForm.loading.list">
			<div class="items">
				<div
					class="item"
					v-for="item, index in furniture_clothSelectForm.cached"
					v-html="clothLabel(item)"
					@click="select(item)"/>
			</div>

			<infinite-loading @infinite="local_furniture_clothSelectForm_infinity" ref="infiniteLoading">
				<div class="end" slot="no-results" />
				<div class="end" slot="no-more" />
				<div class="spinner" slot="spinner" v-loading="furniture_clothSelectForm.loading.bottom" />
			</infinite-loading>
		</div>
	</el-dialog>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

export default {
	props: {
		value: {},
		index: {},
		disabled: {
			type: Boolean
		}
	},
	data() {
		return {
			open: false,
			local_search: "",
			searchTimeout: false,
			noImage: "https://www.head.com/shop/en/skin/frontend/rwd/headsports/images/no-img-available.png"
		}
	},
	components: {
		InfiniteLoading
	},
	watch: {
		local_search (query) {
			if (this.searchTimeout)
				clearTimeout(this.searchTimeout)

			this.searchTimeout = setTimeout(a => this.furniture_clothSearch({ query, index: this.index }), 5e2)
		},
		async open (n) {
			if (!n) return
			this.local_search = ""
			await this.furniture_clothSearch({ query: "", index: this.index })
			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		},
		'furniture_clothSelectForm.query' () {
			this.$nextTick(() => {
				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			})
		}
	},
	computed: {
		...mapGetters([
			'furniture_clothSelectForm'
		]),
		local_furniture_clothSelectForm: {
			get () {
				return this.furniture_clothSelectForm.visible
			},
			set (n) {
				this.furniture_clothSelectForm_visibleSet(n)
			}
		}
	},
	methods: {
		...mapActions([
			'furniture_clothSearch',
			'furniture_clothSelectForm_infinity'
		]),
		...mapMutations([
			'furniture_clothSelectForm_visibleSet'
		]),
		clothLabel (item) {
			let status

			if (item.StatusActive == 1)
				status = `<div class="statusRED">${item.cStatus ? 'Не используется' : 'Отсутствует'}</div>`

			status = status || item.KAT

			return `${item.name} [${status}]`;
		},
		select (item) {
			this.$emit('input', item)
			this.open = false
		},
		local_furniture_clothSelectForm_infinity (payload) {
			this.furniture_clothSelectForm_infinity({ payload, index: this.index })
		}
	},
}
</script>


<style lang="less">
.clothSelectWrapper {
	.clothSelected {
		width: 100px;
		height: 100px;
		background-size: cover;
		transition: all 0.3s ease-in-out;
		box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.2);
		border-radius: 3px;
		display: grid;
		justify-content: center;
		align-items: center;
		position: relative;
		user-select: none;
		.buttonName {}
		.edit {
			opacity: 0;
			box-sizing: border-box;
			padding: 8px;
			line-height: 14px;
			background: #fff;
			box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.2);
			transition: all 0.3s ease-in-out;
		}
		.clothNameWrapper {
			position: absolute;
			bottom: 0;
			width: 0;
			height: 0;
			left: 50%;
			.clothName {
				padding: 10px;
				line-height: 20px;
				position: absolute;
				width: 120px;
				left: -70px;
				text-align: center;
			}
		}
		&:hover {
			cursor: pointer;
			box-shadow: 0 4px 7px 1px rgba(0, 0, 0, 0.2);
			.edit {
				opacity: 1;
			}
		}
	}

	.disabled {
		background: #f5f7fa;
		color: #b4bccc;
		&:hover {
			cursor: not-allowed;
		}
	}

	.itemsWrapper {
		height: 500px;
		margin-top: 10px;
		overflow-y: auto;
		.item {
			height: 40px;
			box-sizing: border-box;
			padding: 10px;
			cursor: pointer;
			transition: all 0.3s ease-in-out;
			user-select: none;
			&:hover {
				background: rgba(64, 158, 255, 0.1);
			}
		}
		.statusRED {
			display: inline;
			color: red;
		}
	}
}

</style>
