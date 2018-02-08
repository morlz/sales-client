<template>
<div class="menuItem" @click.stop="clickHandler" @mouseenter.stop="mouseEnter" @mouseleave.stop="mouseLeave">
	<div class="menuItem__icon" :style="iconStyle">
		<i :class="content.icon"/>
	</div>

	<transition :css="false" @enter="showNameAnimation" @leave="hideNameAnimation">
		<div class="menuItem__name" :style="nameStyles" v-show="name.show">{{ content.name }}</div>
	</transition>

	<div class="menuItem__childs" v-show="content.childs && (open || initial)">
		<app-menu-item v-for="item, index in content.childs"
			:key="currentIndex + '-' + index"
			:currentIndex="currentIndex + '-' + index"
			:content="item"
			ref="childs"
			@spread="spread($event, index)"
			@mouseIn="mouseInHandler(index)"
			@mouseOut="mouseOutHandler(index)"
			@mounted="childMounted($event, index)"/>
	</div>
</div>
</template>

<script>
//@spread="spread($event, index)"
import { tween, timeline, easing } from 'popmotion'

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
		}
	},
	data () {
		return {
			visualize: '#fff',
			open: false,
			name: {
				show: false,
				_show: false,
				styles: {
					left: -200,
					scale: 0.7,
					opacity: 0
				},
				_tween: false
			}
		}
	},
	computed: {
		nameStyles () {
			return {
				left: `${this.name.styles.left}px`,
				transform: `scale(${this.name.styles.scale})`,
				opacity: this.name.styles.opacity
			}
		},
		iconStyle () {
			return { background: this.visualize }
		}
	},
	methods: {
		clickHandler (e) {
			if (this.initial) return
			this.open ? this.$emit('close') : this.$emit('open')
		},
		_open () {
			this.open = true
		},
		_close () {
			this.open = false
		},
		mouseEnter () {
			this.$emit('spread', true)
		},
		mouseLeave () {
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
					{ track: 'left', from: this.name.styles.left, to: 50, duration: 300, ease: easing.easeOut },
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
		mouseInHandler (index) {

		},
		mouseOutHandler (index) {

		},
		spread (e, index) {
			setTimeout(() => {
				//vizualize


				this.$emit('spread', e)

				if (this.initial)
					this.$emit('apply', e)
			}, 1000)
		},
		childMounted (vm, index) {

		},
		apply (e) {
			setTimeout(() => {
				//vizualize
				this.visualize = e ? 'blue' : 'gray'

				if ((this.open || this.initial) && this.$refs.childs)
					this.$refs.childs.map((vm, vmIndex) => setTimeout(a => vm.$emit('apply', e), vmIndex * 300))

				e ? this.$emit('name.show') : this.$emit('name.hide')
			}, 1000)

		}
	},
	mounted () {
		this.$on('open', this._open)
		this.$on('close', this._close)
		this.$on('name.show', this.showName)
		this.$on('name.hide', this.hideName)

		//this.$on('spreadTop', this.spreadTop)
		this.$on('apply', this.apply)

		this.$on('spread', e => this.visualize = (e ? 'green' : 'red'))

		this.$emit('mounted', this.$root)
	}
}
</script>


<style lang="less">
@menuItem-width: 50px;
@menuItem-height: 50px;
@menuItem-icon-width: 50px;
@menuItem-name-width: 250px;

.menuItem {
	position: relative;
	min-height: @menuItem-height;
	width: @menuItem-width;

	&__icon {
		width: @menuItem-icon-width;
		height: @menuItem-height;
		display: grid;
		align-items: center;
		justify-content: center;
		background: #fff;
		border: 1px solid blue;
		box-sizing: border-box;
		z-index: 1;
		position: relative;
	}

	&__name {
		position: absolute;
		top: 0;
		left: 0;
		width: @menuItem-name-width;
		height: @menuItem-height;
		line-height: @menuItem-height;
		border: 1px solid red;
		box-sizing: border-box;
		background: #fff;
		z-index: 0;
	}

	&__childs {
		padding-left: 15px;
		position: relative;
	}
}
</style>
