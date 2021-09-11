//const login=require ('./routes/login.routes')
const aws_keys= require('./Keys/creds');
const SubirImagen=require('./routes/upload.routes');
//const InicioRouter = require('./routes/inicio.routes');
var express = require('express');
const ejs=require('ejs');
const morgan=require('morgan');
const bodyParser = require('body-parser');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var app = express();

const cors = require('cors');
const port = 3000


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());






//Rutas
app.get('/', function(req,res){
res.send("Bienvenido!")
});

//Subir Imagen
app.use('/Archivo',SubirImagen);

//app.use("/",login);
//app.use('/Inicio',login)



app.listen(port, function () {
  console.log('Listening on port',port);
});