const fs = require('fs-extra')
const path = require('path')

console.log(`deploy:epmty ./dist`)
fs.remove(path.resolve('dist'))
