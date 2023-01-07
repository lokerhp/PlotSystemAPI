const BuildTeam = require('./BuildTeam.js');

module.exports = class PlotSystem {

    #database;
    #builders;
    #difficulties;
    #api_keys;
    #buildTeams;

    constructor(database) {
        this.#database = database;
        this.#builders;
        this.#difficulties;
        this.#api_keys;
        this.#buildTeams = new Map();

        this.updateCache();
    }


    async updateCache(){
        this.#builders = await this.getBuildersFromDatabase();
        this.#difficulties = await this.getDifficultiesFromDatabase();
        this.#api_keys = await this.getAPIKeysFromDatabase();

        for(const apiKey of this.#api_keys.values()){
            const buildTeam = this.getBuildTeam(apiKey);
            buildTeam.updateCache();
        }
    }

    getBuilders(){
        if(this.#builders == null){
            this.updateCache();
            return [];
        }

        return this.#builders;
    }

    getDifficulties(){
        if(this.#difficulties == null){
            this.updateCache();
            return [];
        }

        return this.#difficulties;
    }

    getAPIKeys(){
        if(this.#api_keys == null){
            this.updateCache();
            return [];
        }

        return this.#api_keys;
    }

    getBuildTeam(api_key){
        const api_keys = this.getAPIKeys();
        
        // Validate that the API key exists in the plot system database
        if (!api_keys.includes(api_key))
            return null;

        // Check if the build team is already in the cache
        if(this.#buildTeams.has(api_key))
            return this.#buildTeams.get(api_key);

        // Create a new build team and add it to the cache
        const buildTeam = new BuildTeam(api_key, this.#database);
        this.#buildTeams.set(api_key, buildTeam);

        return buildTeam;
    }



    // Validate values


    // Validate an API key that looks like this "fffb262b-0324-499a-94a6-eebf845e6123"
    validateAPIKey(joi, req, res){

        // Validate that the API key is a valid GUID
        const schema = joi.object().keys({
            apikey: joi.string().guid().required()
        });

        const result = schema.validate(req.params);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return false;
        }


        //Validate that the API key exists in the plot system database
        const api_keys = this.getAPIKeys();
        if (!api_keys.includes(req.params.apikey)) {
            res.status(401).send({success: false, error: 'Invalid API key'});
            return false;
        }

        return true;
    }



    // Get values from database
 
    async getBuildersFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_builders";
        return await this.#database.query(SQL);
    }

    async getDifficultiesFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_difficulties";
        return await this.#database.query(SQL);
    }

    async getAPIKeysFromDatabase(){
        const SQL = "SELECT * FROM plotsystem_api_keys";
        const result = await this.#database.query(SQL);     // result: [{"id":1,"api_key":"super_cool_api_key","created_at":"2022-06-23T18:00:09.000Z"}]
        return result.map(row => row.api_key);              // result: ["super_cool_api_key"]
    }
} 