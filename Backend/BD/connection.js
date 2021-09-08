// Creamos el promise para la conexion
const mysql = require('mysql2');
const { Client } = require('ssh2');
var fs = require('fs')
const path = require('path')

// define connection config for the database
const dbServer ={
    host: "basesemi1.cepyhb6hg4t6.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "totito97gt",
    database: "sys"
}
// define connection config for the ssh tunnel
const tunnelConfig = {
    host: "ec2-18-221-141-131.us-east-2.compute.amazonaws.com",
        port: 22,
        username:"ec2-user",
        privateKey: fs.readFileSync(path.join(__dirname,'otrallave.pem'))
}

//Load Balancer: https://www.youtube.com/watch?v=0KIRNTbWf-4

const forwardConfig = {
    srcHost: '18.218.68.227', // any valid address
    srcPort: 3306, // any valid port
    dstHost: dbServer.host, // destination database
    dstPort: dbServer.port // destination port
};

// create an instance of SSH Client
const sshClient = new Client();

exports.SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) reject(err);
           
            // create a new DB server object including stream
            const updatedDbServer = {
                ...dbServer,
                stream
           };
           // 
            // connect to mysql
            const connection =  mysql.createConnection(updatedDbServer);
            // check for successful connection
           //  resolve or reject the Promise accordingly          
           connection.connect((error) => {
            if (error) {
                reject(error);
            }
            resolve(connection);
            });
       });
    }).connect(tunnelConfig);
});