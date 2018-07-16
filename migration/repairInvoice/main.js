const fs = require('fs')

const _ = require('lodash')


let invoices = fs.readFileSync('./input/invoice.json', { encoding: 'utf-8' })

invoices = JSON.parse(invoices.substr(1, invoices.length))

let sql = invoices.reduce((prev, el) => prev + ` UPDATE invoice SET N_DOC = '${el.N_DOC}' WHERE ID = ${el.ID};`, '')

fs.writeFileSync('./output/sql.sql', sql)
