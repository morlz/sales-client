<template>
<base-preview v-if="Object.keys(content).length" class="PreviewManager">
	<template slot="button">
		{{ fio }}
	</template>

	<q-card>
		<q-card-title>
			{{ fio }}
		</q-card-title>
		<q-card-main>
			<q-list>
				<div
					v-if="content.avatar"
					class="PreviewManager__avatar"
					:style="{ backgroundImage: `url(${content.avatar.href})` }"/>

				<q-item v-if="content.salon">
					<q-item-side>Салон</q-item-side>
					<q-item-main/>
					<q-item-side>
						<preview-salon :content="content.salon" v-if="content.salon"/>
					</q-item-side>
				</q-item>
				<q-item>
					<q-item-side>Должность</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.UPOST }}</q-item-side>
				</q-item>
				<q-item>
					<q-item-main>{{ !!content.RABOTAET ? 'Работает' : 'Не работает'}}</q-item-main>
				</q-item>
				<q-item v-if="content.UVOLEN">
					<q-item-side>Уволен</q-item-side>
					<q-item-main/>
					<q-item-side>{{ content.UVOLEN }}</q-item-side>
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
import PreviewSalon from '@/components/PreviewSalon'
import BasePreview from '@/components/BasePreview'

export default {
	components: {
		BasePreview,
		PreviewSalon
	},
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	computed: {
		fio() {
			return this.content.fio || `${this.content.FIO} ${this.content.IMY} ${this.content.OTCH}`
		}
	},
}
</script>


<style lang="stylus">
.PreviewManager
	&__avatar
		width 200px
		height 200px
		border-radius 100px
		border 3px solid #d2d6de
		background-position center
		background-size cover
		border 3px solid rgba(0, 0, 0, 0.1)
		margin 10px auto
</style>
