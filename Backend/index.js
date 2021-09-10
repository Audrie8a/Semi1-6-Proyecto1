//const login=require ('./routes/login.routes')
const aws_keys= require('./Keys/creds')
//const InicioRouter = require('./routes/inicio.routes');
var express = require('express');
const ejs=require('ejs');
const morgan=require('morgan');
const bodyParser = require('body-parser');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var app = express();

const cors = require('cors');
const port = 3000

//instanciamos el sdk
var AWS = require('aws-sdk');
const s3 = new AWS.S3(aws_keys.s3);

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());


//-------------------------------S3 BUCKET-----------------------------------------
app.post('/subirfoto', function (req, res) {

  var id = req.body.id;
  var foto = req.body.foto;
  //carpeta y nombre que quieran darle a la imagen

  var nombrei = "fotos/" + id + ".jpg";
  //se convierte la base64 a bytes
  let buff = new Buffer.from(foto, 'base64');

  const params = {
    Bucket: "appweb-6p1",
    Key: nombrei,
    Body: buff,
    ContentType: "image",
    ACL: 'public-read'
  };
  const putResult = s3.putObject(params).promise();
  res.json({ mensaje: putResult })



});






//Rutas
app.get('/', function(req,res){
res.send("Bienvenido!")
});

//app.use("/",Login);
//app.use('/Inicio',login)



app.listen(port, function () {
  console.log('Listening on port',port);
});