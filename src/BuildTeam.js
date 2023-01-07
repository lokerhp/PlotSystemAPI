module.exports = class BuildTeam {

    #api_key;
    #database;
    #builteamID;
    #cities; // Map<country_id, city[]>
    #countries; // Map<country_id, country>
    #servers; // Map<server_id, server>
    #ftp_configuration; // Map<server_id, ftp_configuration>

    constructor(api_key, database) {
        this.#api_key = api_key;
        this.#database = database;

        this.#builteamID = null;
        this.#cities = new Map();
        this.#countries = new Map();
        this.#servers = new Map();
        this.#ftp_configuration = new Map();
    }


    // Updates the cache for the build team
    async updateCache(){
        console.log("Updating cache for build team: " + this.#api_key)
        this.#builteamID = await this.getBuildTeamIDFromDatabase();

        this.#cities.clear();
        this.#countries.clear();
        this.#servers.clear();
        this.#ftp_configuration.clear();

        // Update all countries, cities, servers and ftp configurations
        const countries = await this.getCountriesFromDatabase();
        for(const country of countries){
            const cities = await this.getCitiesFromDatabase(country.id);
            const servers = await this.getServersFromDatabase(country.id);

            // Update all servers and ftp configurations
            for(const server of servers){
                const ftp_configuration = await this.getFTPConfigurationFromDatabase(server.id);

                this.#servers.set(server.id, server);
                this.#ftp_configuration.set(server.id, ftp_configuration);
            }

            this.#cities.set(country.id, cities);
            this.#countries.set(country.id, country);
        }
    }


    /* ======================================= */
    /*                  CITIES                 */
    /* ======================================= */


    // Returns a list of cities. If no cities are found, an empty list is returned.
    getCities(){
        if(this.#cities == null || this.#cities.size == 0){
            this.updateCache();
            return []
        }

        const cities = [];
        for(const city of this.#cities.values())
            cities.push(...city);

        return cities;
    }

    // Returns a list of cities for the given country id. If the country id is not found, an empty list is returned.
    getCitiesByCountry(country_id){
        if(this.#cities == null || this.#cities.size == 0){
            this.updateCache();
            return []
        }

        if(!this.#cities.has(country_id))
            return [];

        return this.#cities.get(country_id);
    }



    /* ======================================= */
    /*                  COUNTRIES              */
    /* ======================================= */


    // Returns a map of countries with the country id as the key. If no countries are found, an empty map is returned.
    getCountries(){
        if(this.#countries == null || this.#countries.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.#countries;
    }



    /* ======================================= */
    /*                  SERVERS                */
    /* ======================================= */


    // Returns a map of servers with the server id as the key. If no servers are found, an empty map is returned.
    getServers(){
        if(this.#servers == null || this.#servers.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.#servers;
    }



    /* ======================================= */
    /*             FTP CONFIGURATION           */
    /* ======================================= */

    // Returns a map of ftp configurations with the server id as the key. If no ftp configurations are found, an empty map is returned.
    getFTPConfiguration(){
        if(this.#ftp_configuration == null || this.#ftp_configuration.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.#ftp_configuration;        
    }



    /* ======================================= */
    /*                  PLOTS                  */
    /* ======================================= */

    // Returns an uncached list of plots of this team. If no plots are found, an empty list is returned.
    async getPlots(){
        if(this.#cities == null || this.#cities.size == 0)
            return [];

        const plots = [];
        for(const city of this.getCities()){
            const cityPlots = await this.getPlotsByCity(city.id);
            plots.push(...cityPlots);
        }

        return plots;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getPlotsByCity(city_id){
        if(!this.#cities.has(city_id))
            return [];

        return await this.getCityPlotsFromDatabase(city_id);        
    }

    // Creates a new plot for the given city id. If the city id is not found, false is returned.
    async createPlot(city_project_id, difficulty_id, mc_coordinates, outline, create_player, version){
        if(!this.getCities().some(city => city.id == city_project_id))
            return false;

        return await this.createPlotInDatabase(city_project_id, difficulty_id, mc_coordinates, outline, create_player, version);
    }



    /* ======================================= */
    /*                  REVIEWS                */
    /* ======================================= */

    // Returns an uncached list of reviews.
    async getReviews(){
        if(this.#cities == null || this.#cities.size == 0)
            return [];

        const reviews = [];
        for(const city of this.getCities()){
            const cityReviews = await this.getReviewsByCity(city.id);
            reviews.push(...cityReviews);
        }

        return reviews;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getReviewsByCity(city_id){
        if(!this.#cities.has(city_id))
            return [];

        return await this.getCityReviewsFromDatabase(city_id);        
    }

    

    /* ======================================= */
    /*         DATABASE GET REQUESTS           */
    /* ======================================= */

    async getBuildTeamIDFromDatabase(){
        const SQL = "SELECT a.id as btid FROM plotsystem_buildteams as a WHERE api_key_id = (SELECT b.id FROM plotsystem_api_keys as b WHERE api_key = ?)";
        const result = await this.#database.query(SQL, [this.#api_key]);
        return result[0].btid;
    }
    
    async getCountriesFromDatabase(){
        const SQL = "SELECT a.* FROM plotsystem_countries as a, plotsystem_buildteam_has_countries as b WHERE buildteam_id = ? AND a.id = b.country_id";
        return await this.#database.query(SQL, [this.#builteamID]);
    }

    async getCitiesFromDatabase(country_id){
        const SQL = "SELECT * FROM plotsystem_city_projects WHERE country_id = ?";
        return await this.#database.query(SQL, [country_id]);
    }

    async getServersFromDatabase(country_id){
        const SQL = "SELECT * FROM plotsystem_servers WHERE id = (SELECT server_id FROM plotsystem_countries WHERE id = ?)";
        return await this.#database.query(SQL, [country_id]);
    }

    async getFTPConfigurationFromDatabase(server_id){
        const SQL = "SELECT * FROM plotsystem_ftp_configurations as a WHERE a.id = (SELECT ftp_configuration_id FROM plotsystem_servers as b WHERE b.id = ?)";
        return await this.#database.query(SQL, [server_id]);
    }

    async getCityPlotsFromDatabase(city_id){
        const SQL = "SELECT * FROM plotsystem_plots WHERE city_project_id = ?";
        return await this.#database.query(SQL, [city_id]);
    }

    async getCityReviewsFromDatabase(city_id){
        const SQL = "SELECT a.* FROM plotsystem_reviews as a, plotsystem_plots as b WHERE a.id = b.review_id";
        return await this.#database.query(SQL, [city_id]);
    }



    /* ======================================= */
    /*         DATABASE POST REQUEST           */
    /* ======================================= */

    async createPlotInDatabase(city_project_id, difficulty_id, mc_coordinates, outline, create_player, version){
        const SQL = "INSERT INTO plotsystem_plots (city_project_id, difficulty_id, mc_coordinates, outline, create_player, version) VALUES (?, ?, ?, ?, ?, ?)";

        const result = await this.#database.query(SQL, [city_project_id, difficulty_id, mc_coordinates, outline, create_player, version]);

        if(result.affectedRows == 1)
            return true;
        else 
            return false;
    }   
}