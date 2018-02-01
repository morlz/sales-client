<template>
<div class="mainWrapper adminTestsWrapper">
	<el-breadcrumb separator="/" class="bc">
		<el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: '/' }">Администрирование</el-breadcrumb-item>
		<el-breadcrumb-item :to="{ path: `/admin/tests` }">Тестирование</el-breadcrumb-item>
	</el-breadcrumb>

	<div class="adminTests">
		<div class="testList">
			<el-button type="primary" @click="test_price">Тест прайс</el-button>
		</div>

		<ul>
			<li>Загружено моделей: {{ test_count.models }}</li>
			<li>Загружено типов: {{ test_count.types }}</li>
			<li>Загружено декоров: {{ test_count.dekor }}</li>
			<li>Загружено тканей: {{ test_count.cloth }}</li>
			<li>В тесте моделей: {{ test_countT.models }}</li>
			<li>В тесте типов: {{ test_countT.types }}</li>
			<li>В тесте декоров: {{ test_countT.dekor }}</li>
			<li>В тесте тканей: {{ test_countT.cloth }}</li>
			<li>Успешно: {{ test_count.t }}</li>
			<li>Провалено: {{ test_count.f }}</li>
		</ul>

		<div class="console">
			<div class="item" v-for="item, index in test_console" :key="index">
				{{ item }}
			</div>
		</div>
	</div>
</div>
</template>



<script>
import {
	mapGetters,
	mapActions,
	mapMutations
} from 'vuex'

import mixins from '@/components/mixins'

export default {
	mixins: [mixins],
	components: {

	},
	methods: {
		...mapActions([
			'test_price'
		]),
		...mapMutations([

		]),
	},
	computed: {
		...mapGetters([
			'test_console',
			'test_count',
			'test_countT',
		])
	},
	mounted() {

	}
}
</script>



<style lang="less">
.adminTestsWrapper {
	.adminTests {

	}
}
</style>
