<template>
<div class="palermoConstructorWrapper">
	<el-dropdown :hide-on-click="false" class="selected">
		<div class="items">
			<div class="item" v-for="item, index in selected" :key="index" @click="remove(index)">
				{{ showName ? item.NAME : item.CRSEACHNAME }}
			</div>
			<div class="removeAll" @click="removeAll">
				<i class="el-icon-circle-close"/>
			</div>
		</div>

		<el-dropdown-menu slot="dropdown" class="palermoConstructorDropdown" placement="bottom">
			<div class="palermoConstructorDropdownItems">
				<el-dropdown-item v-for="item, index in data" class="palermoConstructorDropdownItem" :key="index">
					<div class="g" @click="add(item)">
						<div>{{ item.CONFIGID }}</div>
						<div>{{ item.CRSEACHNAME }}</div>
						<div>{{ item.NAME }}</div>
					</div>
				</el-dropdown-item>
			</div>
		</el-dropdown-menu>
	</el-dropdown>

	<el-switch
		class="nameSwitch"
		v-model="showName"
		active-text="Показывать имя"
		inactive-text="Показывать код"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

export default {
	props: {
		value: {
			type: String,
			default: a => ""
		},
		disabled: {
			type: Boolean,
			default: a => false
		},
		data: {
			type: Array,
			default: a => ([])
		}
	},
	data() {
		return {
			selected: [],
			showName: false
		}
	},
	components: {

	},
	watch: {
		selected (n) {
			if (!n.length)
				n = ""
			else
				n = n.map(el => el.CRSEACHNAME).join('-')

			this.$emit('input', n)
		},
		value (n) {
			let splited = n.split('-').map(el => this.data.find(d => d.CRSEACHNAME == el)).filter(el => el)
			if (this.selected != splited)
				this.selected = splited
		}
	},
	computed: {

	},
	methods: {
		add (item) {
			this.selected.push(item)
		},
		remove(index) {
			this.selected.splice(index, 1)
		},
		removeAll () {
			this.selected = []
		}
	},
}
</script>


<style lang="less">
.palermoConstructorWrapper {
	line-height: 14px;
	.selected {
		width: 100%;
		.items {
			min-height: 40px;
			width: 100%;
			border: 1px solid #d8dce5;
			border-radius: 4px;
			box-sizing: border-box;
			padding: 3px 5px;
			position: relative;
			//#409EFF
			.item {
				display: inline-block;
				padding: 5px;
				margin: 5px 2px;
				background: #f0f2f5;
				color: #878d99;
				border-radius: 3px;
				transition: all 0.3s ease-in-out;
				user-select: none;
				&:hover {
					background: #fa5555;
					color: #fff;
					cursor: pointer;
				}
			}
			.removeAll {
				position: absolute;
				top: ~"calc(50% - 7px)";
				right: 5px;
				opacity: 0.5;
				transition: all 0.3s ease-in-out;
				&:hover {
					opacity: 1;
					cursor: pointer;
				}
			}
		}
	}
	.nameSwitch {
		margin: 10px 0;
	}
}

.palermoConstructorDropdown {

	padding: 10px;
	.palermoConstructorDropdownItems {
		height: 500px;
		overflow-y: auto;
	}
	&Item {
		transition: all 0.3s ease-in-out;
		user-select: none;
		.g {
			display: grid;
			grid-template-columns: 100px 200px 1fr;
		}
	}
}
</style>
