let dataObj = {
	tasksManyFieldDescription: [
		//{ field: "id", label: "№", type: "string" },
		{ field: "fio", label: "ФИО", type: "string" },
		{ field: "description", label: "Задача", type: "string" },
		{ field: "date", label: "Дата", type: "string" },
		{ field: "manager", label: "Ответсвенный", type: "string" },
		{ field: "type", label: "Тип", type: "string" },
		{ field: "end_date", label: "Выполнена", type: "string" },
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
		{ field: "calc_summ", label: "Сумма расчета", type: "number" },
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
		{ field: "end_date", label: "Выполнена", type: "string" },
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
		{ field: "calc_summ", label: "Сумма расчета", type: "number" },
		{ field: "prepay_summ", label: "Сумма предзаказа", type: "number" }
	],

	furnitureSalonFieldDescription: [{
			field: "id",
			label: "№ зак."
		},
		{
			field: "salon",
			label: "Салон"
		},
		{
			field: "fab",
			label: "Фаб.н."
		},
		{
			field: "storage",
			label: "М.хр."
		},
		{
			field: "isp",
			label: "Исп."
		},
		{
			field: "timeInStorage",
			label: "Дней на складе"
		},
		{
			field: "cloth1",
			label: "Ткань 1"
		},
		{
			field: "cloth2",
			label: "Ткань 2"
		},
		{
			field: "cloth3",
			label: "Ткань 3"
		},
		{
			field: "cat",
			label: "Кат"
		},
		{
			field: "decor",
			label: "Декор"
		},
		{
			field: "steska",
			label: "Стежка"
		},
		{
			field: "price",
			label: "Цена руб."
		},
	],

	invoicesFieldDescription: [
		{ field: "N_DOC", label: "Номер документа" },
		{ field: "DATE", label: "Дата оформления" },
		{ field: "PL_OTGR", label: "Дата отгрузки" },
		{ field: "manager", label: "Менеджер" },
		{ field: "client", label: "Клиент" },
		{ field: "adSource", label: "Рекламный источник" },
		{ field: "storage", label: "Склад" },
	]
}


export default dataObj
