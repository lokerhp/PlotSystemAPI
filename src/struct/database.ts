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
  public database_settings!: Database;
  public settings: Settings;
  private pool!: mariadb.Pool;

  constructor(settings: Settings, database_settings: Database) {
    this.database_settings = database_settings;
    this.settings = settings;

    console.log(
      `Using Database at ${database_settings.host}:${database_settings.port}/${database_settings.db}`
    );

    this.pool = mariadb.createPool({
      host: database_settings.host,
      user: database_settings.username,
      password: database_settings.password,
      connectionLimit: database_settings.max_conn,
      database: database_settings.db,
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
