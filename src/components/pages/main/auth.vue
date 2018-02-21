<template>
<div class="mainAuthWrapper">
	<div class="gradient" :style="gradientStyles"/>

	<div class="mainAuth">
		<q-card class="authTile" v-loading="auchChecking || logined">
			<q-card-title>Авторизация</q-card-title>

			<q-card-main>
				<q-field icon="fa-user">
					<q-input v-model="login" float-label="Имя пользователя (Логин)" @keyup.enter.native="authHandler"/>
				</q-field>

				<q-field icon="fa-key">
					<q-input type="password" v-model="pass" float-label="Пароль" @keyup.enter.native="authHandler"/>
				</q-field>
			</q-card-main>

			<q-card-actions>
				<q-btn color="primary" @click="auth_signIn" @keyup.enter.native="authHandler">Вход</q-btn>
				<q-btn color="secondary" disabled>Востановить пароль</q-btn>
			</q-card-actions>
		</q-card>
	</div>
</div>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import formRules from '@/static/formRules'
import { QField, QInput, QCard, QCardTitle, QCardMain, QCardActions, QBtn } from 'quasar'

export default {
	components: {
		QField,
		QInput,
		QCard,
		QCardTitle,
		QCardMain,
		QCardActions,
		QBtn
	},
	data () {
		return {
			colors: [
				[60, 255, 60],
				[62, 35, 255],
				[255, 35, 98],
				[45, 175, 230],
				[255, 0, 255],
				[255, 128, 0]
			],
			interval: false,
			gradientSpeed: 0.003,
			step: 0,
			colorIndices: [0, 1, 2, 3],
			color1: "rgb(0, 0, 0)",
			color2: "rgb(0, 0, 0)",
		}
	},
	watch: {
		app_view_desktop (n) {
			this.interval = n ?
					setInterval(this.updateGradient, 10)
				:	clearInterval (this.interval)
		}
	},
	methods: {
		...mapActions([
			'auth_signIn'
		]),
		updateGradient() {
			var c0_0 = this.colors[this.colorIndices[0]];
			var c0_1 = this.colors[this.colorIndices[1]];
			var c1_0 = this.colors[this.colorIndices[2]];
			var c1_1 = this.colors[this.colorIndices[3]];

			var istep = 1 - this.step;
			var r1 = Math.round(istep * c0_0[0] + this.step * c0_1[0]);
			var g1 = Math.round(istep * c0_0[1] + this.step * c0_1[1]);
			var b1 = Math.round(istep * c0_0[2] + this.step * c0_1[2]);
			this.color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

			var r2 = Math.round(istep * c1_0[0] + this.step * c1_1[0]);
			var g2 = Math.round(istep * c1_0[1] + this.step * c1_1[1]);
			var b2 = Math.round(istep * c1_0[2] + this.step * c1_1[2]);
			this.color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

			this.step += this.gradientSpeed;
			if (this.step >= 1) {
				this.step %= 1;
				this.colorIndices[0] = this.colorIndices[1];
				this.colorIndices[2] = this.colorIndices[3];

				//pick two new target color indices
				//do not pick the same as the current one
				this.colorIndices[1] = (this.colorIndices[1] + Math.floor(1 + Math.random() * (this.colors.length - 1))) % this.colors.length;
				this.colorIndices[3] = (this.colorIndices[3] + Math.floor(1 + Math.random() * (this.colors.length - 1))) % this.colors.length;
			}
		}
	},
	computed: {
		...mapGetters([
			'auchChecking',
			'logined',
			'app_view_desktop'
		]),
		gradientStyles() {
			return {
				"background" : `linear-gradient(to left, ${this.color1} 0%, ${this.color2} 100%)`
			}
		},
		login: {
			get () {
				return this.$store.getters.auth_form.login
			},
			set (data) {
				this.$store.commit('auth_fromSet', { type: 'login', data })
			}
		},
		pass: {
			get () {
				return this.$store.getters.auth_form.password
			},
			set (data) {
				this.$store.commit('auth_fromSet', { type: 'password', data })
			}
		}
	},
	mounted () {
		if (this.app_view_desktop)
			this.interval = setInterval(this.updateGradient, 50)
		this.updateGradient()
	},
	beforeDestroy () {
		if (this.interval) clearInterval (this.interval)
	}
}
</script>



<style lang="less">
.mainAuthWrapper {
	.gradient,
	.mainAuth {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    display: grid;
	    justify-content: center;
		align-content: center;
	    .centralCard {
	        .title {
	            margin: 0;
	        }
	    }
		.authTile {
			width: 350px;
			padding: 20px;
			background: #fff;
			.q-card-primary {
				padding: 5px;
			}
			.q-card-main {
				padding: 10px;
				.q-field {
					margin: 10px 0;
				}
			}
		}
	}

	.gradient {
	    opacity: 1;
		background: #666;
	}
}

</style>
