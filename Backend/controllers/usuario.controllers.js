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
                    result[0].foto="https://appweb-6p1.s3.us-east-2.amazonaws.com/"+result[0].foto
                    return res.json(result[0]);                   
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

// peticiones de diego---------------------------
exports.verificando = async(req,res)=>{
    var idUser = req.body.id
    var contra = req.body.contraAct;
    let sql = `select contra from usuario as u where idUser=${idUser}`
    let hash1=crypto.createHash('md5').update(contra).digest('hex');
    
    const conn = bd.SSHConnection.then(conn => {
        //hacemos la query normal.
        
        conn.query(sql, function (err, result) {
            if (err) throw err;
            
            if(result[0].contra == hash1){
                //console.log(idUser + ' - ' + hash1 + ' - ' + result[0].contra + ' - ' + contra);
                return res.json(result[0]);                   
            }else{
                return res.json("false");
            }                
        });

    }); 
       
}

exports.SubirFile = async(req, res) => {
    try {
        var Archivo = req.body.archivo;
        var idArchivo = req.body.base64
        var estado = req.body.estado
        var idUser = req.body.iduser
        var tipo = req.body.tipo
        let Archiv=SubirArchivo(Archivo,idArchivo,tipo);//archivo, base64, estado, iduser, tipo
        //console.log(Archivo + '--' + idArchivo + '--' + estado + '--' + idUser + '--' + tipo + '--' + Archiv + '*-*-*-*-*-*-*-*-*-*');
        if(Archiv!="error"){
             let sql = `insert into archivo(nombreArch, Arch, Estado, idUsu) values("${Archivo}","${Archiv}","${estado}","${idUser}")`
             
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
         console.log("Error al SUBIR ARCHIVO  => ", error)
         res.json("error")
     }
}

exports.getArchivos =async(req,res)=>{
    try {
        var idUser = req.body.iduser;
        let sql = `select a.nombre, b.nombreArch, b.Arch from usuario as a, archivo as b
            where a.idUser = b.idUsu and a.idUser != ${idUser} and b.Estado = 1`
        var aux;
       
        const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
            conn.query(sql, function (err, result) {
                if (err) throw err;
                
                if(result.length!=0){
                        for(let n = 0; n<result.length; n++){
                            result[n].Arch="https://appweb-6p1.s3.us-east-2.amazonaws.com/"+result[n].Arch
                        }
                        return res.json(result);                   
                }else{
                    return res.json("false");
                }                
            });
        })
    } catch (error) {
        console.log("Error al obtener archivos => ", error)
        res.json("error")
    }
}

exports.getMisArchivos =async(req,res)=>{
    try {
        var idUser = req.body.iduser;
        let sql = `select b.idArchivo, b.nombreArch, b.estado, b.Arch from usuario as a, archivo as b
            where a.idUser = b.idUsu and a.idUser = ${idUser}`
       
        const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
            conn.query(sql, function (err, result) {
                if (err) throw err;
                
                if(result.length!=0){
                        for(let n = 0; n<result.length; n++){
                            result[n].Arch="https://appweb-6p1.s3.us-east-2.amazonaws.com/"+result[n].Arch
                        }
                        return res.json(result);                   
                }else{
                    return res.json("false");
                }                
            });
        })
    } catch (error) {
        console.log("Error al obtener MIS archivos => ", error)
        res.json("error")
    }
}

exports.EliminarFile = async(req, res) => {
    try {
        var idUser = req.body.iduser;
        var nombrei = req.body.filee;
        console.log(idUser + ' ----------- ' + nombrei);
        let sql = `delete from archivo where idArchivo = ${idUser} `

        console.log("---------debio borrarse");
         const conn = bd.SSHConnection.then(conn => {
            conn.query(sql, function (err, result) {
                if (err) throw err;
                
                res.json("Eliminado correctamente");             
            });
            const params = {
                Bucket: "appweb-6p1",
                Key: nombrei
            };
            const putResult = s3.deleteObject(params).promise();
        }); 
        const params1 = {
            Bucket: "appweb-6p1",
            Key: nombrei
        };
        const putResult1 = s3.deleteObject(params1).promise();
    } catch (error) {
        console.log("Error al Elimianr => ", error)
        res.json("error")
    }
}

exports.EditFile = async(req, res) => {
    var idUser = req.body.iduser
    var estado = req.body.estado;
    let sql = `UPDATE archivo SET estado=${estado} WHERE idArchivo=${idUser}`
    
    const conn = bd.SSHConnection.then(conn => {
        //hacemos la query normal.
        conn.query(sql, function (err, result) {
            if (err) throw err;
            //console.log(idUser + ' - ' + hash1 + ' - ' + result[0].contra + ' - ' + contra);
            return res.json(result[0]);       
        });
    });
}

//funciones

function borrarFile(fileUrl){
    try {
        
        return putResult;
    } catch (error) {
        return "false";
    }
}

function SubirArchivo(Archivo, idArchivo, tipo){
    try {
        var nombrei = "files/" + Archivo +uuid()+tipo;
        //se convierte la base64 a bytes
        let buff = new Buffer.from(idArchivo, 'base64');
        
        if(tipo == ".pdf"){
            const params1 = {
                Bucket: "appweb-6p1",
                Key: nombrei,
                Body: buff,
                ACL: 'public-read'
            };
            putResult = s3.putObject(params1).promise();
        } else {
            const params2 = {
                Bucket: "appweb-6p1",
                Key: nombrei,
                Body: buff,
                ContentType: "image",
                ACL: 'public-read'
            };
            putResult = s3.putObject(params2).promise();
        }
        return nombrei;
    } catch (error) {
        return "error";
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
  