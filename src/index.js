/**
 * sambayón
 * Geolocation server
 */

let port = process.env.PORT || 3000

const bodyParser = require('body-parser')
const express = require('express')
const Network = require('./manager/network')
const package = require('../package.json')


const cors = require('cors')
const app = express()
const network = new Network()

app.use(bodyParser.json())
app.use(cors())

app.post('/', (req, res) => {
    let ip = req.headers['x-forwarded-for']
    network.getUserGeolocation(ip.split(",")[0]).then(response => {
        network.getRequestedServer(response, req.body.req, req.body.client_id).then(r => res.send(r)).catch(c => res.send(c))
    })
})

app.get('/', (req, res) => {
    res.send("Running " + package.name + " " + package.version +
    " (" + package.homepage + ").")
})

app.set('trust proxy', true)

app.listen(port, ()=> {
    console.log("Sambayón iniciado en puerto " + port)
})
