<template>
<q-page class="allocation">
	<div class="allocation__layout">
		<q-toolbar color="orange" v-ga="'h'">
			<q-toolbar-title @click="p">Тест</q-toolbar-title>

			<q-btn flat icon="list" @click="showInvoices = !showInvoices">Заказы</q-btn>
		</q-toolbar>

		<div class="allocation__autoSelect" v-ga="'as'" v-show="false">
			<q-list>
				<q-item v-for="auto, index in autos" :key="index">
					<q-item-main>{{ auto.name }}</q-item-main>
				</q-item>
			</q-list>
		</div>


		<div class="allocation__workSpace" v-ga="'ws'">
			<draggable :list="invoices" :options="draggableOptions" class="allocation__workSpaceInner" ref="workSpace" :style="wsStyle">

				<allocation-tile
					v-for="invoice, index in invoices"
					:key="JSON.stringify(invoice.client)"
					:invoice="invoice"
					:wsCords="cords"
					@drag="setActive(index)"
					@hide="hide(index)"/>

				<template slot="footer">
					<div class="allocation__workSpaceGrid"/>

				</template>
			</draggable>
		</div>


		<transition
			enter-active-class="animated zoomInRight"
			leave-active-class="animated zoomOutRight">
			<q-card class="allocation__availableInvoices" v-if="showInvoices">
				<q-card-title>Заказы</q-card-title>

				<q-card-main class="allocation__availableInvoicesList">
					<draggable :list="available" :options="draggableOptions">
						<div class="allocation__availableInvoicesItem" v-for="item, index in available">
							{{ item.client ? item.client.name : '' }}
						</div>
					</draggable>
				</q-card-main>
			</q-card>
		</transition>
	</div>
</q-page>
</template>

<script>

import 'quasar-extras/animate/zoomInRight.css'
import 'quasar-extras/animate/zoomOutRight.css'

import {
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex'

import {
	QToolbar,
	QToolbarTitle,
	QList,
	QItem,
	QItemMain,
	QCard,
	QCardTitle,
	QCardMain,
	QBtn
} from 'quasar'
import { styler, spring, listen, pointer, value } from 'popmotion'
import AllocationTile from '@/components/AllocationTile.vue'
import draggable from 'vuedraggable'

const attachTouchEvent = (elem, e) => {
	if (elem.addEventListener) {
		if ('onwheel' in document) {
		// IE9+, FF17+, Ch31+
			elem.addEventListener("wheel", e)
		} else if ('onmousewheel' in document) {
		// устаревший вариант события
			elem.addEventListener("mousewheel", e)
		} else {
		// Firefox < 17
			elem.addEventListener("MozMousePixelScroll", e)
		}
	} else { // IE8-
		elem.attachEvent("onmousewheel", e)
	}
}


export default {
	components: {
		QToolbar,
		QToolbarTitle,
		QList,
		QItem,
		QItemMain,
		QCard,
		QCardTitle,
		QCardMain,
		AllocationTile,
		draggable,
		QBtn
	},
	data() {
		return {
			autos: [
				{ name: "aaa", space: "300", maxWeight: "900" },
				{ name: "aaa2", space: "300", maxWeight: "1300" },
				{ name: "aaa3", space: "500", maxWeight: "200" },
				{ name: "aaa4", space: "3600", maxWeight: "800" },
			],
			invoices: [],
			available: [
				{
					z: 1,
					show: false,
					client: {
						name: "Иван",
						lastname: "Кочетков",
						patronymic: "Петрович"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 200, selected: false },
						{ un: 124, name: "divan 2", weight: 320, space: 200, selected: false },
					]
				},
				{
					z: 1,
					show: false,
					client: {
						name: "Василий",
						lastname: "Петров",
						patronymic: "Генадич"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 200, selected: false },
					]
				},
				{
					z: 1,
					show: false,
					client: {
						name: "Ибрагим",
						lastname: "Кузнецов",
						patronymic: "Эльдарыч"
					},
					content: [
						{ un: 123, name: "divan", weight: 300, space: 400, selected: false },
						{ un: 124, name: "divan 2", weight: 320, space: 100, selected: false },
						{ un: 423, name: "divan 4", weight: 120, space: 2000, selected: false },
						{ un: 5345, name: "divan 5", weight: 620, space: 5400, selected: false },
						{ un: 67867, name: "divan 6", weight: 30020, space: 1, selected: false },
					]
				}
			],
			dragZIndexMax: 100,
			cords: { x: 0, y: 0 },
			mouse: { x: 0, y: 0 },
			xy: false,
			wsScale: 1,
			showInvoices: true
		}
	},
	watch: {

	},
	computed: {
		draggableOptions () {
			return {
				group: 'people'
			}
		},
		wsStyle () {
			let cords = {
				x: this.cords.x / this.wsScale,
				y: this.cords.y / this.wsScale
			}

			return { 'transform' : `scale(${this.wsScale})
									translate(${cords.x}px, ${cords.y}px)` }
		}
	},
	methods: {
		p () {
			this.invoices.push({
				z: 1,
				show: false,
				client: {
					name: "Ибрагим",
					lastname: "Кузнецов",
					patronymic: "Эльдарыч"
				},
				content: [
					{ un: 123, name: "divan", weight: 300, space: 400, selected: false },
					{ un: 124, name: "divan 2", weight: 320, space: 100, selected: false },
					{ un: 423, name: "divan 4", weight: 120, space: 2000, selected: false },
					{ un: 5345, name: "divan 5", weight: 620, space: 5400, selected: false },
					{ un: 67867, name: "divan 6", weight: 30020, space: 1, selected: false },
				]
			})
		},
		setActive (index) {
			this.invoices[index].z = ++this.dragZIndexMax
		},
		userHasScrolled ({ wheelDeltaY }) {
			this.wsScale += wheelDeltaY > 0 ? 0.1 : -this.wsScale / 10
		},
		hide (index) {
			this.available.push(...this.invoices.splice(index, 1))
		},
	},
	mounted () {
		setTimeout(() => {
			this.xy = value(this.cords, v => this.cords = v)
			listen(this.$refs.workSpace.$el, 'mousedown touchstart')
				.start(e => {
					e.preventDefault()
					this.$emit('drag')
					pointer(this.xy.get()).start(this.xy)
				})



			listen(document, 'mouseup touchend').start(a => this.xy.stop())
		}, 300)

		//attachTouchEvent(window, this.userHasScrolled)
	},
	beforeDestroy () {

	}
}
</script>


<style lang="less">
.allocation {
	height: 100%;
	&__layout {
		height: 100%;
		display: grid;
		position: relative;
		overflow: hidden;
		grid-template: 	"h"	 50px
						"ws" 1fr
					~"/" 1fr;
	}

	&__autoSelect {
		width: 150px;
	}

	&__workSpace {
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	&__workSpaceInner {
		position: relative;
		width: 100%;
		height: 100%;
	}

	&__moutionTile {
		position: absolute;
		color: black;
		background: #F9FBE7;
		cursor: move;
		max-width: 500px;
	}

	&__availableInvoices {
		position: absolute;
		right: 0;
		top: 50px;
		width: 200px;
		background: #fff;
		z-index: 99999;
		padding: 10px;
	}

	&__availableInvoicesList {
		max-height: 700px;
		overflow-y: auto;
	}

	&__availableInvoicesItem {
		padding: 5px;
		cursor: move;
	}

	&__workSpaceGrid {
		position: absolute;
		width: 1e6px;
		height: 1e6px;
		margin: ~"-5e5px 0 0 -5e5px";
		top: 0;
		left: 0;
		background:
			repeating-linear-gradient(
				transparent, transparent 20px, yellowgreen 21px
			),
			repeating-linear-gradient(
				90deg,
				transparent, transparent 20px, yellowgreen 21px
			);
	}
}

.appWrapper .app .main {
	padding: 0;
	margin: 0;
	overflow: auto;
}
</style>
