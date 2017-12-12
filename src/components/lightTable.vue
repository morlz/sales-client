
Таблица с поиском и сортировкой

<template>
<div class="lightTableWrapper">
	<vue-good-table :columns="columns" :rows="rows" :sortable="true" :onClick="clickHandler">
		<div slot="emptystate">
			Список пуст.
		</div>
		<template slot="table-row-after" slot-scope="props" v-if="buttonRedused.length">
			<td class="buttons">
				<el-button size="small" @click="button.click($event, props)" v-for="button, index in buttonRedused" :key="index">{{ button.name }}</el-button>
			</td>
		</template>
	</vue-good-table>
</div>
</template>



<script>
/*
 *	data:Array of object
 *		anyField => string
 *
 *	fieldDescription:Array of object
 *		name => string,
 *		label => string
 *
 */

export default {
	props: ['data', 'fieldDescription', 'onClick', 'buttons'],
	computed: {
		columns() {
			return this.fieldDescription
		},
		rows() {
			return this.data
		},
		buttonRedused() {
			return this.buttons || []
		}
	},
	methods: {
		clickHandler(row, index) {
			if (typeof this.onClick == 'function') this.onClick(row)
			this.$emit("onClick", row)
		}
	}
}
</script>



<style lang="less">
.lightTableWrapper {
    width: 100%;
    box-sizing: border-box;
	.good-table {
		.responsive {
			overflow-x: auto;
			table {
				td, th {
					border: 0;
					background-color: transparent;
				}
				td {
					padding: 5px;
					vertical-align: middle;
				}
				.buttons {
					display: grid;
					grid-auto-flow: column;
					justify-content: flex-end;
				}
				th {
					border-bottom: 2px solid #f4f4f4;
				}
				thead {
					th {
						color: #337ab7;
						transition: all 0.3s ease-in-out;
						&:hover {
							color: rgb(114, 175, 210);
						}
					}
				}
			}
		}
	}
}

@media screen and (max-width: 768px) {
	.lightTableWrapper {
		.good-table {
			.responsive {
				table {
					td {
						padding: 5px 1px;
					}
					th {
						padding: 5px;
						&:not(:last-child) {
							border-right: 1px solid #f4f4f4;
						}
					}
				}
			}
		}
	}
}
</style>
