<template>
<div class="mainAuthWrapper">
	<div class="gradient" :style="gradientStyles"/>

	<div class="mainAuth">
		<el-card class="centralCard" v-loading="auchChecking">
			<h2 class="title" slot="header">Авторизация</h2>

			<el-form :model="form" :rules="loginFormRules" ref="loginForm">
				<el-form-item label="Имя пользователя (Логин)" prop="login">
					<el-input v-model="form.login" placeholder="Логин" />
				</el-form-item>

				<el-form-item label="Пароль" prop="password">
					<el-input type="password" v-model="form.password" placeholder="Пароль" />
				</el-form-item>
			</el-form>

			<div class="buttons">
				<el-button type="primary" @click="authHandler">Войти</el-button>
				<el-button disabled>Востановить пароль</el-button>
			</div>
		</el-card>
	</div>
</div>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import formRules from '@/static/formRules'

let {
	login: loginFormRules
} = formRules

export default {
	data: () => ({
		loginFormRules,
		form: {
			login: "",
			password: ""
		},
		colors: [
			[60, 255, 60],
			[62, 35, 255],
			[255, 35, 98],
			[45, 175, 230],
			[255, 0, 255],
			[255, 128, 0]
		],
		interval: false,
		gradientSpeed: 0.002,
		step: 0,
		colorIndices: [0, 1, 2, 3],
		color1: "rgb(0, 0, 0)",
		color2: "rgb(0, 0, 0)",
	}),
	methods: {
		authHandler () {
			this.$refs.loginForm.validate(valid => {
				if (valid) this.signIn(Object.assign({}, this.form))
			})
		},
		...mapActions([
			'signIn'
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
			'logined'
		]),
		gradientStyles() {
			return {
				"background" : `linear-gradient(to left, ${this.color1} 0%, ${this.color2} 100%)`
			}
		}
	},
	mounted () {
		this.interval = setInterval(this.updateGradient, 10)
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
	}

	.gradient {
	    opacity: 0.5;
	}
}

</style>
