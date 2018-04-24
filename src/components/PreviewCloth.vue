<template>
<base-preview v-if="Object.keys(content).length">
	<template slot="button">
		{{ content.NAME }}
	</template>

	<q-card>
		<q-card-title>
			{{ content.NAME }}
		</q-card-title>
		<q-card-main>
			<q-list>
				<q-item>
					<q-item-side>Категория</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.KAT }}</q-item-side>
				</q-item>
				<q-item v-if="content.CENA">
					<q-item-side>Цена</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.CENA }}</q-item-side>
				</q-item>
				<q-item v-if="content.ISP">
					<q-item-side>Испонение</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.ISP }}</q-item-side>
				</q-item>
				<q-item v-if="content.TKAN">
					<q-item-side>Код(ИД)</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.TKAN }}</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>
		<q-card-separator />
		<q-card-actions>
			<router-link :to="{ path: `/` }">
				<q-btn flat>Перейти к ткани</q-btn>
			</router-link>
		</q-card-actions>
	</q-card>
</base-preview>
</template>

<script>
import BasePreview from '@/components/BasePreview'

export default {
	components: {
		BasePreview
	},
	props: {
		content: {
			type: Object,
			default: a => ({})
		},
		inline: {
			type: Boolean,
			default: a => false
		},
		width: {
			type: [Number, String],
			default: a => 'auto'
		}
	},
}
</script>


<style lang="stylus">
</style>
