const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3336 
// const server = http.createServer(app) // local

// server.listen(port)

const server2 = http.createServer(app) // por ip local
server2.listen(port,'192.168.0.12', function (req, res) {

    var host = server2.address().address
    var port = server2.address().port

    console.log(`Server running at http://${host}:${port}/`);
})