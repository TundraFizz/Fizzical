module.exports = function(app){
  //////////////////////////////////
  // Include local libraries here //
  //////////////////////////////////
  var mysql = require("mysql"); // MySQL Database

  ///////////
  // Index //
  ///////////
  app.get("/", function(req, res){

    // var mysql      = require("mysql");
    // var connection = mysql.createConnection({
    //   host     : "localhost",
    //   user     : "root",
    //   password : "Fizz",
    //   database : "fek"
    // });

    // connection.connect();

    // connection.query("SELECT * FROM fish_chips ORDER BY fish_chips DESC, name ASC", function(err, rows, fields) {
    //   if(!err){
    //     console.log("The solution is: ", rows);
    //   }
    //   else
    //     console.log("Error while performing Query.");
    // });

    // connection.end();



    var html = "sdfsdf";

    /*
    var pool = mysql.createPool({
      connectionLimit : 100,
      host            : "localhost",
      user            : "root",
      password        : "Fizz",
      database        : "fek",
      debug           : false
    });

    pool.getConnection(function(err,connection){
      if(err){
        res.json({"code"   : 100,
                  "status" : "Error in connection database"});
        return;
      }

      console.log("connected as id " + connection.threadId);

      connection.query("SELECT * FROM fish_chips ORDER BY fish_chips DESC, name ASC",function(err,rows){
          connection.release();
          if(!err) {
              res.json(rows);
          }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
    */

    var con = mysql.createConnection({
      host     : "localhost",
      user     : "root",
      password : "Fizz",
      database : "fek",
    });

    con.connect(function(err){
      if(err){
        console.log('Error connecting to DB');
        return;
      }

      con.query("SELECT * FROM fish_chips ORDER BY fish_chips DESC, name ASC;",
      function(err,rows){
        if(err){
          console.log("There was an error!");
          console.log(err);
          return;
        }

        html = "\
        <div>\
        <table id='t-sort' class='tg'>\
          <tr>\
            <th>ID</th>\
            <th>Name</th>\
            <th>Region</th>\
            <th>FC</th>\
          </tr>";

        for(var i = 0; i < rows.length; i++){
          html += "\
          <tr>\
            <td>" + rows[i]['id'] + "</td>\
            <td>" + rows[i]['name'] + "</td>\
            <td>" + rows[i]['region'] + "</td>\
            <td>" + rows[i]['fish_chips'] + "</td>\
          </tr>"
        }

        html += "\
        </table>\
        </div>";

        res.render("index.ejs", {
          html: html
        });
      });
    });
  });
}

/*
  def view_index(request):
      con, cur = connect_to_database()

      html = """
      <div>
      <table id="t-sort" class="tg">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Region</th>
          <th>FC</th>
        </tr>"""

      sql = "SELECT * FROM fish_chips ORDER BY fish_chips DESC, name ASC"
      cur.execute(sql)
      for r in cur.fetchall():
          html += """
          <tr>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
            <td>{}</td>
          </tr>
          """.format(r["id"], r["name"], r["region"], r["fish_chips"])

      html += """
      </table>
      </div>"""

      cur.close()
      con.close()
      return {"html": html}


  def connect_to_database():
      hst = "localhost"
      usr = "root"
      psw = "Fizz"
      dtb = "fek"
      con = pymysql.connect(hst, usr, psw, dtb)
      cur = con.cursor(pymysql.cursors.DictCursor)
      return con, cur
*/
