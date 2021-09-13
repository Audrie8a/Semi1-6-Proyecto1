const bd = require('../BD/connection');
var crypto=require('crypto');

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
        let sql = `select u.usuario from usuario as u where u.correo="${Usuario}" or  u.usuario="${Usuario}" and u.contra="${hash}"`
        
        const conn = bd.SSHConnection.then(conn => {
            //hacemos la query normal.
            
            conn.query(sql, function (err, result) {
                if (err) throw err;
                
                if(result.length!=0){
                    
                   return res.json(result[0].usuario); 
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
       let hash=crypto.createHash('md5').update(Password).digest('hex');
       let sql = `insert into usuario values(0,"${Nombre}","${Usuario}","${Correo}","${hash}","${idFoto}")`
       
       const conn = bd.SSHConnection.then(conn => {
           //hacemos la query normal.
           
           conn.query(sql, function (err, result) {
                            
               console.log(result)             
             });
   
          
       })
       
       
    } catch (error) {
        console.log("Error al crear Usuario  => ", error)
        res.json("error")
    }
}