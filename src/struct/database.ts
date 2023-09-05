import Settings from "./settings.js";
import mariadb from "mariadb";

export interface Database {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string;
  max_conn: number;
}

export default class DatabaseHandler {
  public settings!: Settings;
  private pool!: mariadb.Pool;

  constructor(settings: Settings) {
    this.settings = settings;

    console.log(
      `Using Database at ${settings.database.host}:${settings.database.port}/${settings.database.db}`
    );

    this.pool = mariadb.createPool({
      host: settings.database.host,
      user: settings.database.username,
      password: settings.database.password,
      connectionLimit: settings.database.max_conn,
      database: settings.database.db,
    });
  }

  public async query(sql: string, params: any = null) {
    // Get a connection from the pool
    const conn = await this.pool.getConnection().catch((err) => {
      console.log(
        "There was an error when creating the connection. Please retry. Error:"
      );
      console.log(err);
    });

    if (!conn) return [];

    // Execute the query
    let rows = await conn
      .query(sql, params)
      .catch((err) => {
        console.log("There was an error when executing a SQL query. Error:");
        console.log(err);
        conn.release();
        return [];
      })
      .finally(() => {
        if (this.settings.debug)
          console.log("Query executed. (" + sql + "). Params: " + params + "");

        // Release the connection back to the pool
        conn.release();
      });

    return rows;
  }
}
