<template>
<div class="ModuleSofaCreate">
	<q-field :max="current.length">
		<q-chips-input v-model="current" />
	</q-field>


	<q-popover anchor="bottom left" self="bottom right">
		<q-list link>
			<q-item v-for="item, index in data" :key="index" @click.native="add(item)">
				<q-item-main>{{ item.NAME }}</q-item-main>
				<q-item-side right>
					{{ item.CONFIGID }} {{ item.CRSEACHNAME }}
				</q-item-side>
			</q-item>
		</q-list>
	</q-popover>

	<q-checkbox v-model="showName" label="Показывать названия"/>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'
import { QChipsInput, QCheckbox } from 'quasar'

export default {
	components: {
		QChipsInput,
		QCheckbox
	},
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
	watch: {
		selected (n) {
			this.$emit('input', n.length ? n.map(el => el.CRSEACHNAME).join('-') : '')
		},
		value (n) {
			let splited = n.split('-').map(el => this.data.find(d => d.CRSEACHNAME == el)).filter(el => el)
			if (this.selected != splited)
				this.selected = splited
		},
	},
	computed: {
		current: {
			get () {
				return this.selected.map(item => this.showName ? item.NAME : item.CRSEACHNAME)
			},
			set (val) {
				this.selected = val.filter(el => this.names.includes(el)).map(el => this.data.find(item => item.CRSEACHNAME === el))
			}
		},
		names () {
			return this.data.map(el => el.CRSEACHNAME)
		}
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
