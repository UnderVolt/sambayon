const importFresh = require('import-fresh')
let config = require('../../config/config.json')
const fetch = require('node-fetch')

class Network {

    getUserGeolocation(ip) {
        return new Promise((res, rej) => {
            fetch('http://ip-api.com/json/' + ip + 
            '?fields=status,message,continentCode,countryCode,timezone', {
                method: "GET",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                return res.json()
            }).then(response => {
                res(response)
            })
        })
    }

    getRequestedServer(response, req, client) {
        return new Promise((res, rej) => {
            if(response.status === "success") {
                if(config.client.id === client) {
                    if(config.network[req] != null) {
                        let r = config.network[req]
                           
                        if(r[response.continentCode] != null) {
                            res({success: true, response: r[response.continentCode]})
                        } else {
                            res({success: true, response: r.default})
                        }
                    } else res({success: false, response: "Server id doesn't exist in network."})
                } else res({success: false, response: "Forbidden client."})
            } else res({success: false, response: "Failed to contact geolocation server. (" + response.message + ")"})
        })
    }
}

module.exports = Network;