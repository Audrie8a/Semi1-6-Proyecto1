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
        let sql = `select u.usuario from usuario as u where u.correo="${Usuario}" or  u.usuario="${Usuario}" and u.contra="${Password}"`
        
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