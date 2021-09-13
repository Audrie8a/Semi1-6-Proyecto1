const bd = require('../BD/connection');
var crypto=require('crypto');
const aws_keys= require('../Keys/creds');
var AWS = require('aws-sdk');
const s3 = new AWS.S3(aws_keys.s3);
const { uuid } = require('uuidv4');

exports.Prueba = async (req, res) => {
    const conn = bd.SSHConnection.then(conn => {
        //hacemos la query normal.
        
        conn.query(`SELECT * FROM Prueba`, function (err, result) {
            if (err) throw err;
            res.send(result);
          });

       
    })
}

 exports.login =async(req,res)=>{
     try {
        const {Usuario,Password}= req.body
        let hash=crypto.createHash('md5').update(Password).digest('hex');
        let sql = `select idUser from usuario as u where u.correo="${Usuario}" or  u.usuario="${Usuario}" and u.contra="${hash}"`
        
        const conn = bd.SSHConnection.then(conn => {
            //hacemos la query normal.
            
            conn.query(sql, function (err, result) {
                if (err) throw err;
                
                if(result.length!=0){
                    
                   return res.json(result[0].idUser); 
                }else{
                    return res.json("false");
                }                
              });
    
           
        })
        
        
     } catch (error) {
         console.log("Error al loguearse  => ", error)
         res.json("error")
     }
 }


 exports.getUsuario =async(req,res)=>{
    try {
       const {idUser}= req.body
       let sql = `select * from usuario as u where idUser=${idUser}`
       var aux;
       
       const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
           conn.query(sql, function (err, result) {
               if (err) throw err;
               
               if(result.length!=0){
                    var getParams = {
                        Bucket: 'appweb-6p1',
                        Key: result[0].foto
                    }
                    
                    s3.getObject(getParams, function (err2, data) {
                        if (err2)
                            return res.json("error");
                        //de bytes a base64
                        var dataBase64 = Buffer.from(data.Body).toString('base64');
                        result[0].foto=dataBase64;
                        
                        
                        return res.json(result[0]);
                    
                    });                    
               }else{
                   return res.json("false");
               }                
             });
   
          
       })
       
       
    } catch (error) {
        console.log("Error al loguearse  => ", error)
        res.json("error")
    }
}
 exports.registro =async(req,res)=>{
    try {
       const {Nombre,Usuario,Correo,Password,idFoto}= req.body
       let Foto=SubirFoto(Usuario,idFoto);
       if(Foto!="error"){
            let hash=crypto.createHash('md5').update(Password).digest('hex');
            let sql = `insert into usuario values(0,"${Nombre}","${Usuario}","${Correo}","${hash}","${Foto}")`
            
            const conn = bd.SSHConnection.then(conn => {
                //hacemos la query normal.
                
                conn.query(sql, function (err, result) {
                    if (err) throw err;             
                    res.json("Registrado correctamente!");             
                });
        
            
            })      
       }else{
           res.json("error");
       }
       
       
    } catch (error) {
        console.log("Error al crear Usuario  => ", error)
        res.json("error")
    }
}





function SubirFoto(id, foto){
    //carpeta y nombre que quieran darle a la imagen
    try {
        var nombrei = "fotos/" + id +uuid()+".jpg";
        //se convierte la base64 a bytes
        let buff = new Buffer.from(foto, 'base64');
    
        const params = {
        Bucket: "appweb-6p1",
        Key: nombrei,
        Body: buff,
        ContentType: "image",
        ACL: 'public-read'
        };
        putResult = s3.putObject(params).promise();
        return nombrei;
    } catch (error) {
        return "error";
    }
    
    
}

//obtener foto en s3
function obtenerFoto(id){    
    //direcccion donde esta el archivo a obtener
    
    var getParams = {
      Bucket: 'appweb-6p1',
      Key: id
    }
    s3.getObject(getParams, function (err, data) {
      if (err)
        return "error";
      //de bytes a base64
      var dataBase64 = Buffer.from(data.Body).toString('base64');
      return dataBase64 ;
  
    });
  
  }
  