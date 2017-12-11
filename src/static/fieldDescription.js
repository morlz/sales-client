let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "manager", label: "Ответсвенный", type: "string" },
		{ field: "type", label: "Тип", type: "string" },
		//{ field: "endManager", label: "Завершил", type: "string" },
		//{ field: "endDate", label: "Дата завершения", type: "string" },
		//{ field: "summ", label: "Сумма", type: "number" },
		//{ field: "created_at", label: "Дата создания", type: "string" },
		//{ field: "creatorManager", label: "Создатель", type: "string" },
		{ field: "salon", label: "Салон", type: "string" },
	],

	recordsManyFieldDescription: [
		//{field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "created_at", label: "Дата создания", type: "string" },
		{ field: "status", label: "Статус", type: "string" },
		{ field: "manager", label: "Менеджер", type: "string", filterOptions: ['Вася', 'Петя'], filterDropdown: true },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "calc_summ", label: "Сумма расчёта", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" },
	],

	adSources: [
		{ value: "1", label: "Реклама" },
		{ value: "2", label: "Рассылка по почте" },
		{ value: "3", label: "Рассылка по телефону" },
		{ value: "4", label: "Интернет" },
	],

	taskTypes: [
		{ value: "1", label: "Контакт" },
		{ value: "2", label: "Заказ" },
		{ value: "3", label: "Отказ" },
		{ value: "4", label: "Напоминание" },
	],

	clientManyFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "gender", label: "Пол", type: "string" }, //filterOptions: [{ value: 0, text: "Женский" }, { value: 1, text: "Мужской" }], filterDropdown: true
		{ field: "manager", label: "Менеджер", type: "string" },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "created_at", label: "Создан", type: "string", inputFormat: 'YYYYMMDD', outputFormat: 'MMM Do YY' },
	],

	clientContactsFieldDescription: [
		//{ field: "id", label: "№", type: "number" },
		{ field: "fio", label: "ФИО", type: "string" },
		//{ field: "gender", label: "Пол", type: "number" },
		{ field: "regard", label: "Отношение", type: "string" },
		{ field: "phone", label: "Телефон", type: "string" },
		//{ field: "disableSMS", label: "Откл. sms", type: "number" },
		{ field: "email", label: "Email", type: "string" },
		//{ field: "disableEMAIL", label: "Откл. письм.", type: "number" },
		//{ field: "lost", label: "Потерян", type: "number" },
	],

	clientTasksFieldDescription: [
		{ field: "id", label: "№", type: "string" },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "type", label: "Тип", type: "string" },
		{ field: "summ", label: "Сумма", type: "number" },
		{ field: "salon", label: "Салон", type: "string" },
	],

	clientPreordersFieldDescription: [
		{ field: "id", label: "№", type: "number" },
		{ field: "created_at", label: "Дата создания", type: "string" },
		{ field: "status", label: "Статус", type: "string" },
		{ field: "manager", label: "Менеджер", type: "string", filterOptions: ['Вася', 'Петя'], filterDropdown: true },
		{ field: "salon", label: "Салон", type: "string" },
		{ field: "budget", label: "Бюждет", type: "number" },
		{ field: "calc_summ", label: "Сумма расчёта", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" }
	]
}


export default dataObj
