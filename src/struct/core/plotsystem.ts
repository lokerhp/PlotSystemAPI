import DatabaseHandler from "../database.js";
import Network from "./network.js";

export default class PlotSystem {
  private plotsystem_database: DatabaseHandler;
  private builders: any[] | null = null;
  private difficulties: any[] | null = null;

  constructor(network: Network) {
    this.plotsystem_database = network.getPlotSystemDatabase();
  }

  async updateCache(isStarting: boolean = false) {
    this.builders = await this.getBuildersFromDatabase();
    this.difficulties = await this.getDifficultiesFromDatabase();
  }

  getPSBuilders() {
    if (this.builders == null) {
      this.updateCache();
      return 0;
    }

    return this.builders;
  }

  getPSDifficulties() {
    if (this.difficulties == null) {
      this.updateCache();
      return [];
    }

    return this.difficulties;
  }


  // Get values from database

  async getBuildersFromDatabase() {
    const SQL = "SELECT COUNT(uuid) as builders FROM plotsystem_builders";
    return await this.plotsystem_database.query(SQL);
  }

  async getDifficultiesFromDatabase() {
    const SQL = "SELECT * FROM plotsystem_difficulties";
    return await this.plotsystem_database.query(SQL);
  }
}
