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
 
        console.log(sql)
       
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
                    console.log(sql2);
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
       
       console.log(sql);
       
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
                console.log(sql2);
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

        console.log(sql);
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
                console.log(sql2);
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
  