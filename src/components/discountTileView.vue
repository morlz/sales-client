<template>
<div class="discountTileViewWrapper">
	<div class="modelWrapper" v-for="model, index in discount_cachedByModel">
		<div class="modelName">{{ model.model }}</div>

		<div class="childs">
			<div class="discountTileViewItem" v-for="item, itemIndex in model.data" :key="itemIndex" @click="clickHandler(item)">
				<div class="title gr" slot="header">
					<div class="name">
						{{ item.MODEL }}
					</div>

					<div class="mXR">
						{{ item && item.td && item.td.mestoXR ? item.td.mestoXR.NAME : '' }}
					</div>
				</div>

				<div class="body">
					<div class="gr">
						<div class="tip">
							{{ item.td.TIP }}
						</div>

						<div class="">
							Кат. {{ item.KAT }}
						</div>
					</div>

					<div class="gr">
						<div class="">
							Цена
						</div>
						<div class="price">
							{{ item.td.CENA_ZAL }}
						</div>
					</div>

					<div class="commentWrapper">
						<div class="comment">
							{{ item.COMMENT }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>



</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	data () {
		return {}
	},
	watch: {

	},
	methods: {
		clickHandler (item) {
			router.push({ path: `/furniture/discount/${item.id}` })
		}
	},
	computed: {
		...mapGetters([
			'discount_cachedByModel'
		])
	}
}
</script>


<style lang="less">
.discountTileViewWrapper {
	.modelWrapper {
		display: grid;
		grid-auto-flow: row;
		.childs {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, auto));
			grid-gap: 20px;
			padding: 10px 15px;
			.discountTileViewItem {
				cursor: pointer;
				padding: 10px;
				border: 1px solid #e6ebf5;
				-webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
				box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

				> div {
					padding: 10px;
				}

				.title {
					border-bottom: 1px solid #e6ebf5;
				}

				.body {
					> div:not(.commentWrapper) {
						margin-top: 10px;
					}
				}


				.gr {
					display: grid;
					grid-auto-flow: column;
					justify-content: space-between;
				}
				.name, .tip {
					&::first-letter {
						text-transform: uppercase;
					}
				}

				.commentWrapper {
					position: relative;
					padding: 0;
					.comment {
						position: absolute;
						width: ~"calc(100% + 40px)";
						top: -40px;
						left: -30px;
						opacity: 0;
						transition: all 0.3s ease-in-out;
						pointer-events: none;
						padding: 10px;
						box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
						transform: scale(0.8);
					}
				}

				&:hover {
					.comment {
						opacity: 1;
						pointer-events: all;
						background: #fff;
						top: -30px;
						transform: scale(1);
					}
				}
			}
		}
	}
}
</style>
