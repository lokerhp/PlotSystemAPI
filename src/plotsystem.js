class PlotSystem {

    constructor() {
        let builders;
        let difficulties;
        let teams;
    }

    async getBuilders(){
        let SQL = "SELECT * FROM plotsystem_builders";
        return await database.query(SQL);
    }

    async getDifficulties(){
        let SQL = "SELECT * FROM plotsystem_difficulties";
        return await database.query(SQL);
    }

    async getBuildTeams(api_key){
        let SQL = "SELECT * FROM plotsystem_buildteams WHERE api_key_id = (SELECT id FROM plotsystem_api_keys WHERE api_key = '?')";
        return await database.query(SQL, [api_key]);
    }
}