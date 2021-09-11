const express = require("express");
const router = express.Router();
//const upload= require("../controllers/upload.controller");
const aws_keys= require('../Keys/creds');
const multer=require('multer');
const upload= multer({dest:'images/'})

//instanciamos el sdk
//var AWS = require('aws-sdk');
//const s3 = new AWS.S3(aws_keys.s3);
router.post('/Upload',upload.single('file'),(req,res)=>{
    const file=req.file;
    if(file){
        res.json(file);
    }else{
        throw new error("Archivo no accesibel!");
    }
})
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


module.exports = router