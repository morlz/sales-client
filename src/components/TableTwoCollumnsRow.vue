<template>
<div class="tableTwoCollumns__row">
	<div class="tableTwoCollumns__rowName">
		<slot name="label"/>
	</div>
	<div class="tableTwoCollumns__rowValue">
		<slot/>
	</div>
</div>
</template>

<script>
export default {}
</script>


<style lang="less">
.tableTwoCollumns {
	&__row {
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-gap: 5px;
		justify-content: space-between;
		padding: 10px;
		transition: all 0.3s ease-in-out;
		align-items: center;
		&:hover {
			background: #ecf5ff;
		}
	}
	&__rowName {
		text-align: left;
	}
	&__rowValue {
		text-align: right;
		justify-self: end;
	}
}
</style>
