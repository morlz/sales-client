export default {
	contacts: {
		fio: { required: true, message: "Введите ФИО", trigger: "blur" },
		regard: { required: true, message: "Введите отношение этого контакта к покупателю!", trigger: "blur" },
		phone: { trigger: "blur" },
		email: { type: "email", message: "Невалидный email", trigger: "blur" }
	}
}
