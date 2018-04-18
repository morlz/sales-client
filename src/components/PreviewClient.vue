<template>
<base-preview>
	<template slot="button">
		{{ fio }}
	</template>

	<q-card>
		<q-card-title>
			{{ fio }}
		</q-card-title>
		<q-card-main>
			<q-list>
				<q-item v-if="content.salon">
					<q-item-side>Салон</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.salon.NAME }}</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>
		<q-card-separator />
		<q-card-actions>
			<router-link :to="{ path: `/admin/personal/${content.ID_M}` }">
				<q-btn flat>Перейти к профилю</q-btn>
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
	},
	computed: {
		fio() {
			return client.FIO ? `${this.content.FIO} ${this.content.IMY} ${this.content.OTCH}` : `${this.content.lastname} ${this.content.name} ${this.content.patronymic}`
		}
	},
}
</script>


<style lang="stylus">
</style>
