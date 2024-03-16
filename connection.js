const {Client} = require('pg')

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rachna',
    database: 'postgres'
})
module.exports = client