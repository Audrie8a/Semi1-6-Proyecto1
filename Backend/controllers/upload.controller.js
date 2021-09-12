//const bd = require('../BD/connection');
const aws_keys= require('../Keys/creds');
//instanciamos el sdk
//var AWS = require('aws-sdk');
//const s3 = new AWS.S3(aws_keys.s3);



//-------------------------------S3 BUCKET-----------------------------------------
exports.uploadArchivo=async(req,res)=>{
    var id = req.body.id;
    var foto = req.body.foto;
    
    /*const putResult=*/SubirFoto(id,foto);

    //res.json({ mensaje: putResult })
}

function SubirFoto(id, foto){
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