from pyramid.view import view_config
import pymysql


@view_config(route_name="index", renderer="templates/index.jinja2")
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
