export default {
	contacts: {
		fio: { required: true, message: "Введите ФИО", trigger: "blur" },
		regard: { required: true, message: "Введите отношение этого контакта к покупателю!", trigger: "blur" },
		phone: { trigger: "blur" },
		email: { type: "email", message: "Невалидный email", trigger: "blur" }
	},
	login: {
		login: { required: true, message: "Введите логин", trigger: "blur" },
		password: [
			{ required: true, message: "Введите пароль", trigger: "blur" },
			{ min:5, max: 255, message: "Длинна пароля от 5 до 255 символов", trigger: "blur" },
		]
	}
}
