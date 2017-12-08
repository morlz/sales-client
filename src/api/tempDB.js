let clients = [
	{ id: 1, name: "Вася", preorder_id: 1, gender: 1, regard: "Основной", phone: "123123", dsableSms: 0, email: "mail@sdf.sdfff", disableEmail: 0, created_at: "2017-05-03", lost_at: "" },
	{ id: 2, name: "Юля", preorder_id: 2, gender: 0, regard: "Основной", phone: "123121233", dsableSms: 0, email: "masdfil@sdf.ffsdf", disableEmail: 1, created_at: "2017-05-02", lost_at: "" },
	{ id: 3, name: "Галя", preorder_id: 3, gender: 0, regard: "Основной", phone: "678123123", dsableSms: 0, email: "sdfmail@sdf.sdf", disableEmail: 0, created_at: "2017-06-02", lost_at: "" },
	{ id: 4, name: "Ахмед", preorder_id: 4, gender: 1, regard: "Друг", phone: "6786123123", dsableSms: 0, email: "maasdfil@sdf.sdf", disableEmail: 0, created_at: "2011-10-30", lost_at: "" },
	{ id: 5, name: "Мухтар", preorder_id: 5, gender: 1, regard: "Пёс", phone: "678123123", dsableSms: 1, email: "masdfil@sdf.sdf", disableEmail: 1, created_at: "2017-05-02", lost_at: "" },
	{ id: 55, name: "Ильдар", preorder_id: 6, gender: 1, regard: "Основной", phone: "786123123", dsableSms: 0, email: "masdfil@sasdfdf.sdf", disableEmail: 0, created_at: "2017-05-01", lost_at: "" },
	{ id: 100, name: "Илья", preorder_id: 7, gender: 1, regard: "Основной", phone: "678123123", dsableSms: 1, email: "maifldd@sdddf.sdf", disableEmail: 1, created_at: "2017-05-03", lost_at: "" },
	{ id: 1231, name: "Рагдар", preorder_id: 8, gender: 1, regard: "Друг", phone: "876123123", dsableSms: 0, email: "maiffl@sdfff.sdf", disableEmail: 0, created_at: "2016-05-02", lost_at: "2017-05-02" },
]

let records = [
	{ id: 1, fio: "Вася", created_at: "2017-11-25", status: "Интерес", manager: "Вася", salon: "Дмитров", rasch: 30000, prepayment: 10000},
	{ id: 2, fio: "Гена", created_at: "2017-02-25", status: "Интерес", manager: "Вася", salon: "Дмитров", rasch: 30000, prepayment: 0},
	{ id: 3, fio: "Руся", created_at: "2017-03-25", status: "Интерес", manager: "Петя", salon: "Дмитров", rasch: 300200, prepayment: 0},
	{ id: 4, fio: "Лиза", created_at: "2017-03-25", status: "Оформлние", manager: "Вася", salon: "Яхрома", rasch: 123000, prepayment: 0},
	{ id: 5, fio: "Рамзан", created_at: "2017-11-05", status: "Оформлние", manager: "Петя", salon: "Яхрома", rasch: 300, prepayment: 12345},
	{ id: 6, fio: "Ахмат", created_at: "2017-11-21", status: "Интерес", manager: "Вася", salon: "Яхрома", rasch: 40000, prepayment: 0},
	{ id: 7, fio: "Евклид", created_at: "2017-11-15", status: "Оформлние", manager: "Петя", salon: "Яхрома", rasch: 5000, prepayment: 0},
	{ id: 8, fio: "Олег", created_at: "2017-11-25", status: "Интерес", manager: "Петя", salon: "Дмитров", rasch: 10000, prepayment: 10000},
	{ id: 123, fio: "Катя", created_at: "2017-11-25", status: "Интерес", manager: "Вася", salon: "Дмитров", rasch: 30000, prepayment: 10000},
]


let tasks = [
	{ id: 1, client: "Вася", description: "Продать диван", date: "2017-01-01", manager: "Петрович", type: "Заказ", endManager: "", endDate: "", summ: 30000, created_at: "2016-12-31", creatorManager: "Петрович", salon: "Дмитров" },
	{ id: 2, client: "Люда", description: "Написать", date: "2017-01-025", manager: "Петрович", type: "Заказ", endManager: "", endDate: "", summ: 1000, created_at: "2016-12-30", creatorManager: "Петрович", salon: "Дмитров" },
	{ id: 3, client: "Таня", description: "Спросить про заказ", date: "2017-03-03", manager: "Иваныч", type: "Контакт", endManager: "", endDate: "", summ: 3000, created_at: "2016-12-31", creatorManager: "Вася", salon: "Дубна" },
	{ id: 1231, client: "Миша", description: "Спросить про диван", date: "2017-01-05", manager: "Иваныч", type: "Напоминание", endManager: "", endDate: "", summ: 30000, created_at: "2016-12-31", creatorManager: "Вася", salon: "Дубна" },
]




export default {
	clients,
	records,
	tasks
}
