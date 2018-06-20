const fs = require('fs')
const XMLParser = require('xml-js')
const _ = require('lodash')

String.prototype.numbers = function () {
	return this.replace(/\D/g, '')
}


let input = {},
	time = Date.now()

console.log('[client] read file client.xml...');
input.client = fs.readFileSync('input/client.xml', { encoding: 'utf-8' })

console.log('[client] read file invoice.json...');
input.invoice = fs.readFileSync('input/invoice.json', { encoding: 'utf-8' })

let parsed = {}
console.log('[client] file readed, parse clients...')
parsed.client = XMLParser.xml2js(input.client, {
	ignoreComment: true,
	ignoreDoctype: true
})

console.log('[client] files readed, parse invoices...')
parsed.invoice = JSON.parse(input.invoice)
/*
parsed.invoice = XMLParser.xml2js(input.invoice, {
	ignoreComment: true,
	ignoreDoctype: true
})
*/

delete input
console.log('[client] XML parsed, finding clients...')

let content = {}
content.client = ['pma_xml_export', 'database'].reduce((prev, prop) => {
	let finded = (prev.elements || []).find(el => el.name == prop)
	if (finded) {
		console.log(`[client] getting prop (${prop})`)
		return finded
	} else {
		console.log(`[client] can not get (${prop})`, prev)
		return {}
	}
}, parsed.client)

delete parsed.client

console.log('[client] XML parsed, finding invoices...')
content.invoice = parsed.invoice

delete parsed

let managerMap = {},
	invoicesCount = content.invoice.length

console.log('[client] create client managers map...')
content.invoice.forEach((invoice, index) => {
	if (!(index % 10000))
		console.log(`[client] map created for ${(index / invoicesCount * 100).toFixed()}%, ${index} items of ${invoicesCount}`)

	managerMap[+invoice.IDK] = +invoice.ID_M
})

delete content.invoice

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const formatFIO = str => capitalize(str.replace(/[^A-Za-zА-Яа-я]/g, '').toLowerCase())
const formatPhone = phone => {
	let match = phone.match(/(\+7|8)\(?\d{3,5}\)?\D{0,2}(\d{3}|\d{1}\D?\d{1}\D?\d{1})\D{0,2}\d{2}\D?\d{2}/),
		match223 = phone.match(/(\+7|8)\(?\d{3,5}\)?\D{0,2}\d{2}\D?\d{2}\D?\d{3}/),
		matchNoCode = phone.match(/\(?\d{3,5}\)?\D{0,2}(\d{3}|\d{1}\D?\d{1}\D?\d{1})\D{0,2}\d{2}\D?\d{2}/),
		matchRegionalDM = phone.match(/\d{1}-\d{2}-\d{2}/),
		matchRegionalSPB = phone.match(/576-\d{2}-\d{2}/)


	if (Array.isArray(match))
		return '' + match[0]

	if (Array.isArray(matchNoCode))
		return '8' + matchNoCode[0]

	if (Array.isArray(matchRegionalDM))
		return '849522' + matchRegionalDM[0]

	if (Array.isArray(matchRegionalSPB))
		return '8812' + matchRegionalSPB[0]

	return phone || ''
}
const formatPhoneCode = phone => {
	if (!phone.indexOf('+7'))
		return '8' + phone.substr(2, phone.length)

	if (!phone.indexOf('7')) {
		return '8' + phone.substr(2, phone.length)
	}

	return phone
}


let clients = {},
	contactFaces = {},
	clientsMap = {},
	fios = [],
	numbers = [],
	clientCount = content.client.elements.length

console.log('[client] formatting...')
content.client.elements.reverse().forEach((clientOld, index) => {
	if (!(index % 10000))
		console.log(`[client] formated ${(index / clientCount * 100).toFixed()}%, ${index} items of ${clientCount}`)

	let client = clientOld.elements.reduce((prev, el) => {
		prev[el.attributes.name] = el.elements ? el.elements[0].text == 'NULL' ? null : el.elements[0].text : ''
		return prev
	}, {})

	let fio = {
		lastName: formatFIO(client.FIO.trim().split(' ')[0]),
		name: formatFIO(client.IMY),
		patronymic: formatFIO(client.OTCH),
	}

	let formatedPhone = formatPhone((client.TEL1 || client.TEL2 || '').trim())
		phone = formatPhoneCode(formatedPhone.numbers()).substr(0, 11),
		gender = 1

	numbers.push(phone)


	switch (fio.lastName.substr(-1, 1).toLowerCase()) {
		case 'а':
			gender = 0
			break;
		case 'о':
			gender = +fio.lastName.substr(-1, 1).toLowerCase() != 'а'
			break;
		default:
			gender = 1
	}




	if (!clients[phone])
		clients[phone] = {
			id: client.IDK,
			...fio,
			salon_id: client.ID_SALONA,
			manager_id: managerMap[client.IDK + ''] || 1,
			created_at: client.DATE1,
			signs: client.COMMENT || ''
		}

	clientsMap[client.IDK] = clients[phone].id

	contactFaces[phone] = {
		client_id: clients[phone] ? clients[phone].id : client.IDK,
		regard: 'Основной',
		fio: Object.values(fio).join(' ').trim(),
		phone,
		email: client.EMAIL.trim(),
		gender
	}

	fios.push(Object.values(fio).join(' ').trim())
})

delete content

/*
let count = numbers.length
numbers = numbers.filter((v, i, a) => {
	if (!(i % 1000))
		console.log(`[client] filtred ${(i / count * 100).toFixed()}%, ${i} items of ${count}`)

	return a.indexOf(v) === i
})
*/

//numbers = _.uniq(numbers.filter(number => !(!!+number.numbers2() && number.numbers2().length == 11)))
numbers = _.uniq(numbers)
numbers.sort()
console.log(numbers)



/*
console.log(`[client] getting unique fios...`)
let maxFioLength = 0
let uniq = fios.filter((el, index, self) => (maxFioLength = maxFioLength < el.length ? el.length : maxFioLength, self.indexOf(el) === index))
console.log(`[client] fio count: ${fios.length}, unique: ${uniq.length} (${uniq.length - fios.length}), max length: ${maxFioLength}`)
console.log(`[client] save fios...`);
fs.writeFile('output/fios.json', JSON.stringify(uniq), { encoing: 'utf8' }, err => {
	if (!err) console.log(`[client] fios saved in fios.json`)
})
*/

console.log(`[client] formated ${clientCount} items, ${Object.keys(clients).length} (${Object.keys(clients).length - clientCount}) clients, ${Object.keys(contactFaces).length} contact faces`)

const getClientSQLValue = client => `(
	${client.id},
	'${client.signs}',
	'${client.lastName}',
	'${client.name}',
	'${client.patronymic}',
	'${client.manager_id}',
	'${client.salon_id}',
	'${client.created_at}',
	NULL
)`

const getContactFaceSQLValue = face => `(
	null,
	${face.client_id},
	null,
	'${face.fio}',
	${face.gender},
	'${face.regard}',
	'${face.phone}',
	0,
	'${face.email}',
	0,
	0
)`

const getInvoiceSQLValue = (o, n) => `
	UPDATE invoice
	SET
		customer_id = ${n}
	WHERE
		IDK = ${o};
`

const getKomuSqlValue = (o, n) => `
	UPDATE Komu
	SET
		customer_id = ${n}
	WHERE
		IDK = ${o};
`

let sql = {
	clients: 'INSERT INTO `nsl_customers`(`id`, `signs`, `lastname`, `name`, `patronymic`, `manager_id`, `salon_id`, `created_at`, `notactive`) VALUES ',
	contactFaces: 'INSERT INTO `nsl_contact_faces`(`id`, `client_id`, `preorder_id`, `fio`, `gender`, `regard`, `phone`, `disableSMS`, `email`, `disableEMAIL`, `lost`) VALUES ',
	invoices: '',
	komu: ''
}

console.log('[client] creating clients SQL...')
sql.clients = Object.values(clients).reduce((prev, el, index) => prev + (index ? ', ' : '') + getClientSQLValue(el), sql.clients)
//delete clients

console.log('[client] SQL ready, write clients sql file...')
fs.writeFileSync('output/clients.sql', sql.clients, { encoding: 'utf-8' })

console.log('[client] created, creating contact faces SQL...')
sql.contactFaces = Object.values(contactFaces).reduce((prev, el, index) => prev + (index ? ', ' : '') + getContactFaceSQLValue(el), sql.contactFaces)
//delete contactFaces

console.log('[client] writed, write contact faces sql file...')
fs.writeFileSync('output/contactFaces.sql', sql.contactFaces, { encoding: 'utf-8' })

console.log('[client] writed, creating invoices SQL...')
sql.invoices = Object.keys(clientsMap).reduce((prev, key, index) => prev + getInvoiceSQLValue(key, clientsMap[key]), sql.invoices)

console.log('[client] created, write invoices sql file...')
fs.writeFileSync('output/invoices.sql', sql.invoices, { encoding: 'utf-8' })

console.log('[client] writed, creating komu SQL...')
sql.komu = Object.keys(clientsMap).reduce((prev, key, index) => prev + getKomuSqlValue(key, clientsMap[key]), sql.komu)
//delete clientsMap

console.log('[client] created, write komu sql file...')
fs.writeFileSync('output/komu.sql', sql.komu, { encoding: 'utf-8' })

console.log('[client] writed, creating all SQL...')
fs.writeFileSync('output/all.sql', Object.values(sql).join('; '), { encoding: 'utf-8' })
console.log('[client] all SQL created')

let t = Date.now() - time
console.log(`[client] writed, process end in ${t} ms (${(t/1000).toFixed(1)}s)`)



//console.log(clients, contactFaces, clientsMap)

setInterval(() => console.log('Still work'), 6e4)
