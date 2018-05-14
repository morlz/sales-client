<template>
	<q-card class="Cloth" v-ripple :class="{ 'ClothSelected': selected }">
		<q-card-media class="Cloth__media" :class="{ 'Cloth__invalid': !(value.status && value.status.normal) }">
			<div class="Cloth__image" :style="{ 'background-image': `url(${value.image || 'statics/no-img-available.png'})` }"/>

			<div class="Cloth__title" slot="overlay" v-if="value.name">
				{{ value.name }}

				<div class="Cloth__cat" v-if="value.status">
					{{ value.status.normal ? value.KAT : value.status.text }}
				</div>
			</div>
		</q-card-media>
	</q-card>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			required: true
		},
		selected: Boolean,
		disable: Boolean
	}
}
</script>


<style lang="stylus">
	.Cloth
		width 150px
		height 150px
		user-select none
		cursor pointer
		position relative

		&__media
			height 100%

		&__image
			width 100%
			height 100%
			background-size cover
			background-repeat no-repeat
			background-position center

		&__title
			text-align center
			font-size 16px
			padding 5px

		&__invalid
			.q-card-media-overlay
				background rgba(255, 0, 0, 1)

		&__cat
			position absolute
			top 0
			right 8px
			transform translateY(-50%)
			background rgba(0, 0, 210, 0.3)
			border-radius 8px
			padding 4px
			font-size 12px
			color white

		.q-card-media-overlay
			transition background .2s ease-in-out

	.ClothSelected
		.q-card-media-overlay
			background rgba(0, 0, 255, 0.47)
</style>
