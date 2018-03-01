<template>
<div class="clickable" :style="{ border: `2px solid ${color}`, width, whiteSpace: inline ? 'nowrap' : undefined }">
	<div class="clickable__content">
		<slot/>
	</div>
</div>
</template>

<script>
export default {
	props: {
		color: {
			type: String,
			default: a => "#21ba45"
		},
		width: {
			type: [Number, String],
			default: a => 'auto'
		},
		inline: {
			type: Boolean,
			default: a => false
		},
	},
}
</script>


<style lang="less">
.clickable {
	padding: 5px;
	background: none !important;
	border-radius: 3px;
	cursor: pointer;
	user-select: none;
	overflow: hidden;
	color: inherit;

	&__content {
		color: inherit;
		overflow: hidden;
		width: 100%;
		text-overflow: ellipsis;
		font-size: 14px;
	}
}
</style>
