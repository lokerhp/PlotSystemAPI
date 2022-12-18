module.exports = class PlotSystem {

    constructor(database) {
        this.database = database;
        this.builders;
        this.difficulties;
        this.api_keys;
        this.buildTeams = new Map();

        this.updateCache();
    }


    async updateCache(){
        this.builders = await this.getBuildersFromDatabase();
        this.difficulties = await this.getDifficultiesFromDatabase();

    }

    async getBuilders(){
        if(this.builders == null)
            await this.updateCache();

        return this.builders;
    }

    async getDifficulties(){
        if(this.difficulties == null)
            await this.updateCache();
         
        return this.difficulties;
    }

    async getBuildTeams(api_key){
        const SQL = "SELECT * FROM plotsystem_buildteams WHERE api_key_id = (SELECT id FROM plotsystem_api_keys WHERE api_key = '?')";
        return await this.database.query(SQL, [api_key]);
    }



    // Get values from database
 
    async getBuildersFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_builders";
        return await this.database.query(SQL);
    }

    async getDifficultiesFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_difficulties";
        return await this.database.query(SQL);
    }

    async getAPIKeysFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_api_keys";
        return await this.database.query(SQL);
    }
} 