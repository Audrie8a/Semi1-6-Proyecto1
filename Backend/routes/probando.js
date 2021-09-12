const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { request } = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
app.use(bodyParser.json());
var cors = require('cors');
const mysqlConnection = require('../localC.js');

app.use(cors());
const mysqlcon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'semi1',
  multipleStatements: true
});

// GET all Employees
app.get('/consulta1', (req, res) => {
    mysqlcon.query("SELECT * FROM usuario", function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
});

// GET An Employee
app.get('/nombre/:id', (req, res) => {
  const { id } = req.params; 
  mysqlcon.query(`SELECT nombre FROM usuario WHERE idUser = ${id}`, (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

app.post('/nuevoArchivo', (req, res) => {
  var nameArch = req.body["nombre"];
  var Arch = req.body["archivo"];
  var estad = req.body["estado"];
  var dueño = req.body["dueño"];
  let sql = `insert into archivo (nombreArch, Arch, Estado, idUsu)
      values ('${nameArch}', '${Arch}', ${estad}, ${dueño})`;
  mysqlcon.query(sql, [], (err, rows, fields) => {
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

app.listen(PORT, () => {
  console.log(`----Listening on port ${PORT}`);
});