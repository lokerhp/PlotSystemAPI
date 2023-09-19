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
  public databaseSettings!: Database;
  public settings: Settings;
  private pool!: mariadb.Pool;

  constructor(settings: Settings, databaseSettings: Database) {
    this.databaseSettings = databaseSettings;
    this.settings = settings;

    console.log(
      `Using Database at ${databaseSettings.host}:${databaseSettings.port}/${databaseSettings.db}`
    );

    this.pool = mariadb.createPool({
      host: databaseSettings.host,
      user: databaseSettings.username,
      password: databaseSettings.password,
      connectionLimit: databaseSettings.max_conn,
      database: databaseSettings.db,
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
