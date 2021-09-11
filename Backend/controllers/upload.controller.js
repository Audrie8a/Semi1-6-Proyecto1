//const bd = require('../BD/connection');
const aws_keys= require('../Keys/creds');
const multer=require('multer');
const upload= multer({dest:'images/'})
//instanciamos el sdk
//var AWS = require('aws-sdk');
//const s3 = new AWS.S3(aws_keys.s3);


//MULTER

const storage = multer.diskStorage({
  destination: function(req,file, cb){
      cb(null,'Public');
  },
  filename: function(req,file,cb){
      cb(null, `${file.originalname}`);
  },
})

//-------------------------------S3 BUCKET-----------------------------------------
exports.uploadArchivo=async(req,res)=>{
    var id = req.body.id;
    var foto = req.body.foto;
    
    /*const putResult=*/SubirFotoS3(id,foto);

    //res.json({ mensaje: putResult })
}

function SubirFotoS3(id, foto){
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
    //return putResult = s3.putObject(params).promise();
    console.log(id,foto);
}