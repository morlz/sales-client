<template>
<div class="menuItem"
	:class="{ currentRouteItem }"
	@click.stop="clickHandler"
	@mouseover.stop="mouseEnterThrottled()($event)"
	@mouseout.stop="mouseLeaveThrottled()($event)">
	<div class="menuItem__icon" :style="iconStyle" :class="{ 'menuItem__icon-initial' : initial }">
		<i :class="content.icon"/>
	</div>

	<transition :css="false" @enter="showNameAnimation" @leave="hideNameAnimation">
		<div class="menuItem__name" :style="nameStyles" v-show="name.show" v-if="!initial">{{ content.name }}</div>
	</transition>

	<q-slide-transition>
		<div class="menuItem__childs" v-show="content.childs && (open || initial)">
			<app-menu-item v-for="item, index in content.childs"
				:key="currentIndex + '-' + index"
				:currentIndex="currentIndex + '-' + index"
				:content="item"
				:recursion-count="recursionCount + 1"
				ref="childs"
				@spread="spreadHandler($event, index)"
				@spreadTop="spreadTopHandler($event, index)"
				@spreadBottom="spreadBottomHandler($event, index)"
				@current="childCurrentRouteHandler"/>
		</div>
	</q-slide-transition>
</div>
</template>

<script>

import { tween, timeline, easing } from 'popmotion'
import throttle from 'lodash.throttle'
import { QSlideTransition } from 'quasar'

export default {
	name: 'AppMenuItem',
	props: {
		content: {
			type: Object,
			required: true
		},
		currentIndex: {
			type: String,
			default: a => "0"
		},
		initial: {
			type: Boolean,
			default: a => false
		},
		recursionCount: {
			type: Number,
			default: a => 0
		}
	},
	components: {
		QSlideTransition
	},
	data () {
		return {
			visualize: '#fff',
			open: false,
			spreadTimeout: false,
			name: {
				show: false,
				_show: false,
				styles: {
					left: -200,
					scale: 0.7,
					opacity: 0
				},
				_tween: false
			},
			speed: 30
		}
	},
	computed: {
		nameStyles () {
			return {
				left: `${this.name.styles.left}px`,
				transform: `scale(${this.name.styles.scale})`,
				opacity: this.name.styles.opacity,
				width: `${this.nameWidth}px`,
				'box-shadow': this.name.show ? `2px 4px 3px -1px rgba(0, 0, 0, 0.2)` : '0 0 5px 1px rgba(0, 0, 0, 0.2)',
				'padding-left': `${this.iconPaddingLeft}px`,
				'padding-right': `${this.iconPaddingRight}px`
			}
		},
		iconStyle () {
			return {
				//background: this.visualize,
				'padding-left': `${this.iconPaddingLeft}px`,
				'padding-right': `${this.iconPaddingRight}px`
			}
		},
		iconPaddingLeft () {
			return this.recursionCount * 15
		},
		iconPaddingRight () {
			let p = 30 - this.recursionCount * 15
			if (p < 0) return 0
			return p
		},
		nameWidth () {
			return 220
		},
		currentRouteItem () {
			return this.$route.path == this.content.path
		}
	},
	methods: {
		clickHandler (e) {
			if (this.initial) return
			this.open ? this.$emit('close') : this.$emit('open')
			if (this.content.path)
				router.push(this.content.path)
		},
		_open () {
			this.open = true
		},
		_close () {
			this.open = false
		},
		mouseEnterThrottled (e) {
			return throttle(this.mouseEnter, 50)
		},
		mouseLeaveThrottled (e) {
			return throttle(this.mouseLeave, 50)
		},
		mouseEnter (e) {
			this.$emit('spread', true)
		},
		mouseLeave (e) {
			this.$emit('spread', false)
		},
		showName (delay = 0) {
			setTimeout(a => this.name.show = true, delay)
		},
		hideName (delay = 0) {
			setTimeout(a => this.name.show = false, delay)
		},
		showNameAnimation (el, complete) {
			if (this.name._tween) this.name._tween.stop()
			//tween({ from: this.name.styles, to: { left: 50, scale: 1 }, duration: 300 })
			timeline([
				[
					{ track: 'left', from: this.name.styles.left, to: 50 + 30, duration: 300, ease: easing.easeOut },
					{ track: 'opacity', from: this.name.styles.opacity, to: 1, duration: 300, ease: easing.easeOut },
				],
				{ track: 'scale', from: this.name.styles.scale, to: 1, duration: 200 },
			])
			.start({ update: v => this.name.styles = v, complete })
		},
		hideNameAnimation (el, complete) {
			//this.name._tween = tween({ from: this.name.styles, to: { left: -50, scale: 0.8 }, duration: 300 })
			timeline([
				{ track: 'scale', from: this.name.styles.scale, to: 0.7, duration: 200 },
				[
					{ track: 'left', from: this.name.styles.left, to: -200, duration: 300, ease: easing.easeIn  },
					{ track: 'opacity', from: this.name.styles.opacity, to: 0, duration: 300, ease: easing.easeIn  }
				]
			])
			.start({ update: v => this.name.styles = v, complete })
		},
		// apply for prev child
		spreadTop (e, index) {
			this.visualize = e ? 'lightblue' : 'lightred'
			if (this.$refs.childs[index - 1]) {
				this.applyPrevChild(e, index)
			} else {
				if (this.$refs.childs[index])
					this.applySelf(e)
				this.$emit('spreadTop', e)
			}
		},
		//apply for next child
		spreadBottom (e, index) {
			this.visualize = e ? 'lightblue' : 'lightred'

			if (this.$refs.childs[index + 1]) {
				this.applyNextChild(e, index)
			} else {
				this.$emit('spreadBottom', e)
			}
		},
		//apply top for current item
		applyTop (e, index) {
			this.visualize = e ? 'green' : 'red'

			if (this.$refs.childs) {
				if (index != undefined) {
					this.applyPrevChild(e, index)
				} else {
					this.applyLastChild(e)
				}
			} else {
				this.$emit('spreadTop', e)
				this.applySelf(e)
			}
		},
		//apply bottom for current item
		applyBottom (e, index) {
			this.visualize = e ? 'green' : 'red'

			if (this.$refs.childs) {
				if (index != undefined) {
					this.applyNextChild(e, index)
				} else {
					this.applySelf(e)
					setTimeout(() => {
						this.applyFirstChild(e)
					}, this.speed)
				}
			} else {
				this.$emit('spreadBottom', e)
				this.applySelf(e)
			}
		},
		applyPrevChild (e, index) {
			if (this.$refs.childs[index - 1])
				this.$refs.childs[index - 1].$emit('applyTop', e)
		},
		applyNextChild (e, index) {
			if (this.$refs.childs[index + 1])
				this.$refs.childs[index + 1].$emit('applyBottom', e)
		},
		applyLastChild (e) {
			if (this.$refs.childs)
				this.$refs.childs[this.$refs.childs.length - 1].$emit('applyTop', e)
		},
		applyFirstChild (e) {
			if (this.$refs.childs)
				this.$refs.childs[0].$emit('applyBottom', e)
		},
		//child wanna spread for next and prev childs
		spreadHandler (e, index) {
			this.visualize = e ? 'blue' : 'white'
			//handle open

			this.removeSpreadHandlers()

			// распростронение от 1 ребёнка
			if (this.spreadTimeout)
				clearTimeout(this.spreadTimeout)

			this.spreadTimeout = setTimeout(() => {
				this.applyTop(e, index + 1)
				this.applyBottom(e, index - 1)
			}, 100)
		},
		removeSpreadHandlers () {
			if (this.$refs.childs)
				this.$refs.childs.map(vm => vm.spreadTimeout ? clearTimeout(vm.spreadTimeout) : null)

			if (this.$parent)
				this.$parent.spreadTimeout ? clearTimeout(this.$parent.spreadTimeout) : null
		},
		//child emit spread top
		spreadTopHandler (e, index) {
			setTimeout(() => {
				this.spreadTop(e, index)
			}, this.speed)
		},
		//child emit spread bottom
		spreadBottomHandler (e, index) {
			setTimeout(() => {
				this.spreadBottom(e, index)
			}, this.speed)
		},
		applySelf (e) {
			e ? this.$emit('name.show') : this.$emit('name.hide')
		},
		childCurrentRouteHandler () {
			this.open = true
			this.$emit('current')
		}
	},
	mounted () {
		this.$on('open', this._open)
		this.$on('close', this._close)
		this.$on('name.show', this.showName)
		this.$on('name.hide', this.hideName)
		this.$on('applyTop', this.applyTop)
		this.$on('applyBottom', this.applyBottom)
		if (this.currentRouteItem)
			this.$emit('current')
	}
}
</script>


<style lang="less">
@menuItem-width: 50px;
@menuItem-height: 50px;
@menuItem-icon-width: 50px;
@menuItem-icon-height: 50px;
@menuItem-name-width: 250px;

.currentRouteItem {
	.menuItem {
		&__icon, &__name {
			background: rgba(210, 210, 210,0.95);
		}
	}
}

.menuItem {
	position: relative;
	min-height: @menuItem-height;
	width: @menuItem-width;
	cursor: pointer;
	user-select: none;


	&:hover {
		> .menuItem {
			&__icon:not(.menuItem__icon-initial), &__name {
				background:	#ecf5ff;
			}
		}
	}

	&__icon {
		width: @menuItem-icon-width;
		height: @menuItem-height;
		display: grid;
		align-items: center;
		justify-content: center;
		background: #fff;
		//border: 1px solid blue;
		box-sizing: content-box;
		z-index: 2500;
		position: relative;
		transition: box-shadow 0.3s ease-in-out,
					background-color 0.3s ease-in-out;
		pointer-events: all;
		i {
			pointer-events: none;
		}
	}

	&__name {
		position: absolute;
		top: 0;
		left: 0;
		width: @menuItem-name-width;
		height: @menuItem-height;
		line-height: @menuItem-height;

		//border: 1px solid red;
		box-sizing: border-box;
		box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
		background: rgba(255, 255, 255, 0.95);
		z-index: 2000;
		pointer-events: all;
		transition: box-shadow 0.3s ease-in-out,
					background-color 0.3s ease-in-out;
	}

	&__childs {
		position: relative;
		width: 310px;
		pointer-events: none;
	}
}
</style>
