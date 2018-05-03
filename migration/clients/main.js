const fs = require('fs')
const XMLParser = require('xml-js')

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
	invoiceCount = content.invoice.length

console.log('[client] create client managers map...')
content.invoice.forEach((invoice, index) => {
	if (!(index % 10000))
		console.log(`[client] map created for ${(index / invoiceCount * 100).toFixed()}%, ${index} items of ${invoiceCount}`)

	managerMap[+invoice.IDK] = +invoice.ID_M
})

delete content.invoice

let clients = [],
	contactFaces = [],
	clientCount = content.client.elements.length

console.log('[client] formatting...')
content.client.elements.forEach((clientOld, index) => {
	if (!(index % 10000))
		console.log(`[client] formated ${(index / clientCount * 100).toFixed()}%, ${index} items of ${clientCount}`)

	let client = clientOld.elements.reduce((prev, el) => {
		prev[el.attributes.name] = el.elements ? el.elements[0].text == 'NULL' ? null : el.elements[0].text : ''
		return prev
	}, {})

	let fio = {
		lastName: client.FIO.trim().split(' ')[0].replace(/\b\w/g, l => l.toUpperCase()),
		name: client.IMY.replace(/\b\w/g, l => l.toUpperCase()),
		patronymic: client.OTCH.replace(/\b\w/g, l => l.toUpperCase()),
	}

	let phone = (client.TEL1 || client.TEL2 || '').replace(/\D/g, ''),
		gender = +((fio.patronymic || fio.name).substr(-1, 1).toLowerCase() != 'а')

	clients.push({
		id: client.IDK,
		...fio,
		salon_id: client.ID_SALONA,
		manager_id: managerMap[client.IDK + ''] || 1,
		created_at: client.DATE1,
		signs: client.COMMENT || ''
	})

	contactFaces.push({
		client_id: client.IDK,
		regard: 'Основной',
		fio: Object.values(fio).join(' ').trim(),
		phone,
		email: client.EMAIL.trim(),
		gender
	})
})

delete content

const getClientSQLValue = client => `(${client.id}, '${client.signs}', '${client.lastName}', '${client.name}', '${client.patronymic}', '${client.manager_id}', '${client.salon_id}', '${client.created_at}', null)`
const getContactFaceSQLValue = face => `(null, ${face.client_id}, null, '${face.fio}', ${face.gender}, '${face.regard}', '${face.phone}', 0, '${face.email}', 0, 0)`

let sql = {
	clients: 'INSERT INTO `nsl_customers`(`id`, `signs`, `lastname`, `name`, `patronymic`, `manager_id`, `salon_id`, `created_at`, `notactive`) VALUES ',
	contactFaces: 'INSERT INTO `nsl_contact_faces`(`id`, `client_id`, `preorder_id`, `fio`, `gender`, `regard`, `phone`, `disableSMS`, `email`, `disableEMAIL`, `lost`) VALUES '
}

console.log('[client] formated, creating clients SQL...')
sql.clients = clients.reduce((prev, el, index) => prev + (index ? ', ' : '') + getClientSQLValue(el), sql.clients)
delete clients

console.log('[client] SQL ready, write clients sql file...')
fs.writeFileSync('output/clients.sql', sql.clients, { encoding: 'utf-8' })
delete sql.clients

console.log('[client] created, creating contact faces SQL...')
sql.contactFaces = contactFaces.reduce((prev, el, index) => prev + (index ? ', ' : '') + getContactFaceSQLValue(el), sql.contactFaces)
delete contactFaces

console.log('[client] writed, write contact faces sql file...')
fs.writeFileSync('output/contactFaces.sql', sql.contactFaces, { encoding: 'utf-8' })
delete sql

let t = Date.now() - time
console.log(`[client] writed, process end in ${t} ms (${(t/1000).toFixed(1)}s)`)
