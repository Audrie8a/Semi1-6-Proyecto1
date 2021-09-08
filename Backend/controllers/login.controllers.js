const bd = require('../BD/connection');

exports.login = async (req, res) => {
    const conn = bd.SSHConnection.then(conn => {
        //hacemos la query normal.

        conn.query(`SELECT * FROM Prueba`, function (err, result) {
            if (err) throw err;
            res.send(result);
          });

       
    })
}