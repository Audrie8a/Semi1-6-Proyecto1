// Creamos el promise para la conexion
const mysql = require('mysql2');
const { Client } = require('ssh2');
var fs = require('fs')
const path = require('path')

// define connection config for the database
const dbServer ={
    host: "dbsemi1.cguv4wtarweb.us-east-2.rds.amazonaws.com", //MySQL Endpoint
    port: 3306,
    user: "admin",
    password: "Rodaudrie",
    database: "Semi1"
}
// define connection config for the ssh tunnel
const tunnelConfig = {
    host: "ec2-13-59-139-235.us-east-2.compute.amazonaws.com", //SSH Host
        port: 22,
        username:"ec2-user",
        privateKey: fs.readFileSync(path.join(__dirname,'key1_RDS.pem'))
}

//Load Balancer: https://www.youtube.com/watch?v=0KIRNTbWf-4

const forwardConfig = {
    srcHost: 'dbsemi1.cguv4wtarweb.us-east-2.rds.amazonaws.com', // any valid address
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