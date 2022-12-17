module.exports = class PlotSystem {

    constructor(database) {
        this.database = database;
        this.builders;
        this.difficulties;
        this.api_keys;
    }

    async getBuilders(){
        const SQL = "SELECT * FROM plotsystem_builders";
        return await this.database.query(SQL);
    }

    async getDifficulties(){
        const SQL = "SELECT * FROM plotsystem_difficulties";
        return await this.database.query(SQL);
    }

    async getBuildTeams(api_key){
        const SQL = "SELECT * FROM plotsystem_buildteams WHERE api_key_id = (SELECT id FROM plotsystem_api_keys WHERE api_key = '?')";
        return await this.database.query(SQL, [api_key]);
    }
} 