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

exports.manageFriends =async(req,res)=>{
    try {
       const {user1, user2, tipo}= req.body
       let sql = "";
       if(tipo==1){ //Eliminar o rechazar Amigo
           sql=`delete from Amigo where user1 =${user1} and user2=${user2} or user1=${user2} and user2=${user1}`;
       }else if (tipo==0){// Aceptar solicitud
           sql=`update Amigo SET estado=0 where user1=${user1} and user2=${user2} or user1=${user2} and user2=${user1}`;
       }else { //Enviar solicitud
           sql=`insert into Amigo values(${user1},${user2},2)`;
       }
       

       const conn = bd.SSHConnection.then(conn => {
          
           conn.query(sql, function (err, result) {
               if (err) throw err;
               
               res.json("Acción ejecutada correctamente!");
             });
       })
       
    } catch (error) {
        console.log("Error al ejecutar acción Amigo  => ", error)
        res.json("error")
    }
}


exports.getSugerencias =async(req,res)=>{
    try {
        const {idUser, Usuario, tipo}= req.body
        let sql ="";
        if(tipo==0){//Obtener Sugerencias
            sql= `select idUser, nombre, usuario, correo, contra, foto from usuario as u
                where idUser not in 
                (select user1 from Amigo
                where user2=${idUser})
                and idUser not in 
                (select user2 from Amigo
                where user1=${idUser})
                and idUser!=${idUser}
                `;
        }else{//Obtener Sugerencias Filtrado
            sql= `select idUser, nombre, usuario, correo, contra, foto from usuario as u
                where idUser not in 
                (select user1 from Amigo
                where user2=${idUser})
                and idUser not in 
                (select user2 from Amigo
                where user1=${idUser})
                and idUser!=${idUser}
                and u.usuario="${Usuario}"
                `;
        }
 
        
       
       const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
           conn.query(sql, function (err, result) {
               if (err) throw err;
               
               if(result.length!=0){
                    let Amigos = [];
                    let Amigo ={
                        "idUser": "",
                        "nombre": "",
                        "usuario": "",
                        "correo": "",
                        "contra": "",
                        "foto": "",
                        "archivos": ""
                    }
                    Usuarios="(";
                    Amigos = result.map(x=> {
                        Amigo={
                            idUser: x.idUser,
                            nombre: x.nombre,
                            usuario: x.usuario,
                            correo: x.correo,
                            contra: x.contra,
                            foto: "https://appweb-6p1.s3.us-east-2.amazonaws.com/"+x.foto,
                            archivos: ""
                        }
                        Usuarios+=x.idUser+",";
                        return Amigo;
                    });
                    Usuarios+="0)";
                    let sql2=`select count(*) as Total from archivo where idUsu in ${Usuarios} and Estado=1`
                   
                    conn.query(sql2, function (err2, result2) {
                        if (err2) throw err2;
                        
                        let Aux=[]
                        contador=0;
                             Aux = result2.map(x=> {
                                 Amigo={
                                     idUser: Amigos[contador].idUser,
                                     nombre: Amigos[contador].nombre,
                                     usuario: Amigos[contador].usuario,
                                     correo: Amigos[contador].correo,
                                     contra: Amigos[contador].contra,
                                     foto: Amigos[contador].foto,
                                     archivos: x.Total
                                 }
                                 Amigos[contador]=Amigo;
                                 contador++;
                                 
                                 return Amigo;
                             });   
                             return res.json(Amigos);            
                      });
                                      
               }else{
                   //No hay sugerencias que mostrar
                   return res.json("false");
               }                
             });
   
          
       })
       
       
    } catch (error) {
        console.log("Error al obtener Sugerencias  => ", error)
        res.json("error")
    }
}

exports.getAmigos =async(req,res)=>{
    try {
       const {idUser, Usuario, tipo}= req.body
       console.log(Usuario);
       let sql ="";
       if(tipo==0){//Obtener Amigos
            sql= `select idUser, nombre, usuario, correo, contra, foto from usuario as u
            where idUser in 
            (select user1 from Amigo
            where user2=${idUser}
            and estado=0)
            or idUser in 
            (select user2 from Amigo
            where user1=${idUser}
            and estado=0)
            `;
       }else{//Obtener Amigos Filtrado
            sql= `select idUser, nombre, usuario, correo, contra, foto from usuario as u
            where idUser in 
            (select user1 from Amigo
            where user2=${idUser}
            and estado=0)
            and idUser in 
            (select user2 from Amigo
            where user1=${idUser}
            and estado=0)
            or usuario="${Usuario}"
            `;
       }
       
       
       
       const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
           conn.query(sql, function (err, result) {
               if (err) throw err;
               
               if(result.length!=0){
                let Amigos = [];
                let Amigo ={
                    "idUser": "",
                    "nombre": "",
                    "usuario": "",
                    "correo": "",
                    "contra": "",
                    "foto": "",
                    "archivos": ""
                }
                Usuarios="(";
                Amigos = result.map(x=> {
                    Amigo={
                        idUser: x.idUser,
                        nombre: x.nombre,
                        usuario: x.usuario,
                        correo: x.correo,
                        contra: x.contra,
                        foto: "https://appweb-6p1.s3.us-east-2.amazonaws.com/"+x.foto,
                        archivos: ""
                    }
                    Usuarios+=x.idUser+",";
                    return Amigo;
                });
                Usuarios+="0)";
                let sql2=`select count(*) as Total from archivo where idUsu in ${Usuarios} and Estado=1`
                
                conn.query(sql2, function (err2, result2) {
                    if (err2) throw err2;
                    
                    let Aux=[]
                    contador=0;
                         Aux = result2.map(x=> {
                             Amigo={
                                 idUser: Amigos[contador].idUser,
                                 nombre: Amigos[contador].nombre,
                                 usuario: Amigos[contador].usuario,
                                 correo: Amigos[contador].correo,
                                 contra: Amigos[contador].contra,
                                 foto: Amigos[contador].foto,
                                 archivos: x.Total
                             }
                             Amigos[contador]=Amigo;
                             contador++;
                             
                             return Amigo;
                         });   
                         return res.json(Amigos);            
                  });
                                  
           }else{
               //No hay sugerencias que mostrar
               return res.json("false");
           }                
         });
   
          
       })
       
       
    } catch (error) {
        console.log("Error al obtener Sugerencias  => ", error)
        res.json("error")
    }
}

exports.getSolicitudes =async(req,res)=>{
    try {
        const {idUser, Usuario, tipo}= req.body
        let sql ="";
        if(tipo==0){//Obtener Solicitudes
            sql = `select idUser, nombre, usuario, correo, contra, foto from usuario, Amigo
            where user1=idUser
            and user2=${idUser}
            and estado=2
            `;
        }else{
            sql = `select idUser, nombre, usuario, correo, contra, foto from usuario, Amigo
            where user1=idUser
            and user2=${idUser}
            and estado=2
            and usuario="${Usuario}"`;
        }

        
       const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
           conn.query(sql, function (err, result) {
               if (err) throw err;
               
               if(result.length!=0){
                let Amigos = [];
                let Amigo ={
                    "idUser": "",
                    "nombre": "",
                    "usuario": "",
                    "correo": "",
                    "contra": "",
                    "foto": "",
                    "archivos": ""
                }
                Usuarios="(";
                Amigos = result.map(x=> {
                    Amigo={
                        idUser: x.idUser,
                        nombre: x.nombre,
                        usuario: x.usuario,
                        correo: x.correo,
                        contra: x.contra,
                        foto: "https://appweb-6p1.s3.us-east-2.amazonaws.com/"+x.foto,
                        archivos: ""
                    }
                    Usuarios+=x.idUser+",";
                    return Amigo;
                });
                Usuarios+="0)";
                let sql2=`select count(*) as Total from archivo where idUsu in ${Usuarios} and Estado=1`
                
                conn.query(sql2, function (err2, result2) {
                    if (err2) throw err2;
                    
                    let Aux=[]
                    contador=0;
                         Aux = result2.map(x=> {
                             Amigo={
                                 idUser: Amigos[contador].idUser,
                                 nombre: Amigos[contador].nombre,
                                 usuario: Amigos[contador].usuario,
                                 correo: Amigos[contador].correo,
                                 contra: Amigos[contador].contra,
                                 foto: Amigos[contador].foto,
                                 archivos: x.Total
                             }
                             Amigos[contador]=Amigo;
                             contador++;
                             
                             return Amigo;
                         });   
                         return res.json(Amigos);            
                  });
                                  
           }else{
               //No hay sugerencias que mostrar
               return res.json("false");
           }                
         });
   
          
       })
       
       
    } catch (error) {
        console.log("Error al obtener Sugerencias  => ", error)
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


//-----------------------------------------DIEGO


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
        where a.idUser = b.idUsu 
        and a.idUser != ${idUser} and b.Estado = 1
        and a.idUser in (
        select idUser from usuario as u
       where idUser in 
       (select user1 from Amigo
       where user2=${idUser}
       and estado=0)
       or idUser in 
       (select user2 from Amigo
       where user1=${idUser}
       and estado=0));`
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
        }); 
        const params1 = {
            Bucket: "appweb-6p1",
            Key: nombrei
        };
        const putResult1 = s3.deleteObject(params1).promise();
        console.log(putResult1);
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
  