<template>
<base-preview>
	<template slot="button">
		{{ content.NAME }}
	</template>

	<q-card>
		<q-card-title>
			{{ content.NAME }}
		</q-card-title>
		<q-card-main>
			<q-card-main>
				<q-list>
					<q-item>
						<q-item-side>Город</q-item-side>
						<q-item-main/>
						<q-item-side>{{ content.GOROD }}</q-item-side>
					</q-item>
					<q-item>
						<q-item-side>Адрес</q-item-side>
						<q-item-main/>
						<q-item-side>{{ content.ADRES }}</q-item-side>
					</q-item>
					<q-item>
						<q-item-side>Название</q-item-side>
						<q-item-main/>
						<q-item-side>{{ content.SalonName }}</q-item-side>
					</q-item>
					<q-item>
						<q-item-side>Email</q-item-side>
						<q-item-main/>
						<q-item-side>{{ content.EM_ADRES }}</q-item-side>
					</q-item>
					<q-item v-if="content.TEL1 || content.TEL2">
						<q-item-side>Телефон(ы)</q-item-side>
						<q-item-main/>
						<q-item-side>
							<q-item-tile v-if="content.TEL1">{{ content.TEL1 }}</q-item-tile>
							<q-item-tile v-if="content.TEL2">{{ content.TEL2 }}</q-item-tile>
						</q-item-side>
					</q-item>
				</q-list>
			</q-card-main>
		</q-card-main>
		<q-card-separator />
		<q-card-actions>
			<router-link :to="{ path: `/` }">
				<q-btn flat>Перейти к салону</q-btn>
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
		}
	}
}
</script>


<style lang="stylus">
</style>
