<template>
<base-preview v-if="Object.keys(content).length" class="PreviewClient">
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
					<q-item-side>
						<preview-salon :content="content.salon"/>
					</q-item-side>
				</q-item>

				<q-item v-if="content.manager">
					<q-item-side>Менеджер</q-item-side>
					<q-item-main/>
					<q-item-side>
						<preview-manager :content="content.manager"/>
					</q-item-side>
				</q-item>

				<q-item v-if="content.signs">
					<q-item-side>Приметы</q-item-side>
					<q-item-main/>
					<q-item-side right>
						{{ content.signs }}
					</q-item-side>
				</q-item>
			</q-list>

			<h6 class="PreviewClient__contacts">Контакные лица</h6>

			<q-list no-border v-if="content.contactfaces" class="PreviewClientContactFacesList">
				<q-item v-for="contact, index in content.contactfaces" :key="index">
					<q-item-side>{{ contact.regard }}</q-item-side>

					<q-item-main>
						{{ contact.fio }}
					</q-item-main>

					<q-item-side>
						<q-item-tile v-if="contact.phone">
							<base-phone :value="contact.phone" :place="{ contact }"/>
						</q-item-tile>

						<q-item-tile v-if="contact.email">
							{{ contact.email }}
						</q-item-tile>
					</q-item-side>
				</q-item>
			</q-list>
		</q-card-main>

		<q-card-separator />
		<q-card-actions>
			<router-link :to="{ path: `/preorder/clients/${content.id}` }">
				<q-btn flat>Перейти к профилю</q-btn>
			</router-link>
		</q-card-actions>
	</q-card>
</base-preview>
</template>

<script>
import BasePreview from '@/components/BasePreview'
import BasePhone from '@/components/BasePhone'
import PreviewSalon from '@/components/PreviewSalon'
import PreviewManager from '@/components/PreviewManager'

export default {
	components: {
		BasePreview,
		PreviewSalon,
		PreviewManager,
		BasePhone
	},
	props: {
		content: {
			type: Object,
			default: a => ({})
		}
	},
	computed: {
		fio() {
			return this.content.FIO ? `${this.content.FIO} ${this.content.IMY} ${this.content.OTCH}` : `${this.content.lastname} ${this.content.name} ${this.content.patronymic}`
		}
	},
}
</script>


<style lang="stylus">
	.PreviewClient
		&__contacts
			margin-top 15px
			font-size 18px
			font-weight normal

	.PreviewClientContactFacesList
		.q-item
			displat grid
			grid-auto-flow column
</style>
