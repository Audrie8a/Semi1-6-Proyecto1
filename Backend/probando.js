const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var corsOptions = {origin: true, optionsSuccessStatus: 200};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`----Listening on port ${PORT}`);
});

const mysql = require('mysql2');
var Client = require('ssh2').Client;
var sshClient = new Client();
//const { request } = require('http');
const fs = require('fs');
var uuid = require('uuid');
const aws_keys = require('./creds');

const dbServer = {
  host: 'dbsemi1.cguv4wtarweb.us-east-2.rds.amazonaws.com', //Punto de acceso url de RDS 
  port: 3306,  //Puerto de acceso de RDS
  user: 'admin', // usuario de base de datos
  password: 'Rodaudrie', // password de base de datos
  database: 'Semi1' //nombre de la base de datos
}

// Credenciales de la EC2 publica
const tunnelConfig = {
  host: 'ec2-3-128-199-197.us-east-2.compute.amazonaws.com',   // DNS ipv4 de la EC2 no es la ip es un url
  port: 22,     // puerto SSH
  username: 'ec2-user',   // usuario en este caso es una instancia de Ubuntu
  privateKey: require('fs').readFileSync('./key1_RDS.pem')  //ruta de su llave .pem de la EC2 , antes darle permisos al archivo
}

// Enlazamos las 2 conexiones
const forwardConfig = {
  srcHost: 'dbsemi1.cguv4wtarweb.us-east-2.rds.amazonaws.com', // punto acceso de RDS
  srcPort: 3306, // puerto
  dstHost: dbServer.host, // destination database
  dstPort: dbServer.port // destination port
};
var AWS = require('aws-sdk');
/* const mysqlcon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'semi1',
  multipleStatements: true
}); */

const SSHConnection = new Promise((resolve, reject) => {
  sshClient.on('ready', () => {
      //Le seteamos las credenciales
      sshClient.forwardOut(
      forwardConfig.srcHost,
      forwardConfig.srcPort,
      forwardConfig.dstHost,
      forwardConfig.dstPort,
      (err, stream) => {
           if (err) reject(err);
          // creamos un servidor de base de datos
          const updatedDbServer = {
               ...dbServer,
               stream
          };
          // realizamos conexion a mysql rds
          const connection =  mysql.createConnection(updatedDbServer);
         //  hacemos una validacion que si conecte          
         connection.connect((error) => {
          if (error) {
              reject(error);
              console.log('Error de conexion')
          }
          resolve(connection);
          console.log('Conectado a Base de datos');
          });
          //retornamos la conexion
          return connection;
     });
  }).connect(tunnelConfig);
});

// GET all Employees
app.get('/consulta1', async (req, res) => {
  const conn = SSHConnection.then(conn => {
    conn.query("SELECT * FROM usuario", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  })
});

// GET An Employee
app.get('/nombre/:id', (req, res) => {
  const { id } = req.params; 
  const conn = SSHConnection.then(conn => {
    conn.query(`SELECT nombre FROM usuario WHERE idUser = ${id}`, (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    });
  });
});

app.post('/nuevoArchivo', (req, res) => {
  var nameArch = req.body["nombre"];
  var Arch = req.body["archivo"];
  var estad = req.body["estado"];
  var dueño = req.body["dueño"];
  let sql = `insert into archivo (nombreArch, Arch, Estado, idUsu)
      values ('${nameArch}', '${Arch}', ${estad}, ${dueño})`;

  const conn = SSHConnection.then(conn => {
    conn.query(sql, [], (err, rows, fields) => {
      if (!err) {
      console.log('Resultats: ', rows);
      res.send({
        "code":200,
        "success":"votre memo est bien modifié ! "
          });
        } else {
          console.log(err);
        }
    });
  });
});

