<template>
<div class="UploadImage">
	<q-input v-model="url" float-label="Указать ссылку"/>

	<div>Или</div>

	<div class="UploadImageFile">
		<q-btn class="UploadImageFile__button" outline label="Выбрать файл" color="primary"/>
		<div class="UploadImageFile__selected">
			{{ file ? file.name : 'Файл не выбран' }}
		</div>
		<input id="file_select" class="UploadImageFile__field" type="file" @input="fileSelect"/>
	</div>

	<div class="UploadImage__preview" v-if="preview">
		<img :src="preview" ref="preview"/>
	</div>

	<div class="UploadImage__size" v-if="size">
		Размер: {{ size | sizeValue }} {{ size | sizeType }}.
	</div>
</div>
</template>

<script>
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'
import { BaseImage, BaseFile } from '@/lib'
import axios from 'axios'

export default {
	data() {
		return {
			url: '',
			file: null,
			preview: '',
			reader: new FileReader(),
			size: null
		}
	},
	watch: {
		async url (url) {
			if (!url) return
			this.$emit('input', { url })
			this.file = null
			this.preview = url

			let res = await BaseImage.getFile(url)
			this.size = res.headers['content-length']
		}
	},
	methods: {
		fileSelect (e) {
			let file = e.target.files[0]
			if (!(file instanceof Blob)) return
			this.file = file
			this.size = file.size
			this.url = ''
			this.$emit('input', { file })
			this.reader.readAsDataURL(file)
		}
	},
	filters: {
		sizeValue: BaseFile.getFileSize,
		sizeType: BaseFile.getSizeType,
	},
	created () {
		this.reader.onloadend = () => this.preview = this.reader.result
	}
}
</script>


<style lang="stylus">
.UploadImage
	display grid
	grid-gap 10px
	border 1px solid var(--q-color-secondary)
	padding 10px
	border-radius 2px
	width 100%

	&__preview
		width 100%
		display grid
		justify-content center
		img
			max-width 100%

.UploadImageFile
	position relative
	display grid
	grid-gap 5px
	grid-template-columns max-content 1fr
	align-items center
	&__field
		position absolute
		top 0
		right 0
		bottom 0
		left 0
		width 100%
		height 100%
		opacity 0
		cursor pointer

</style>
