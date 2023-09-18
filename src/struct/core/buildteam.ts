import DatabaseHandler from "../database.js";



export default class BuildTeam {

    private api_key: string;
    private ps_database: DatabaseHandler
    private buildteamID: string | null;
    private cities: Map<number, any[]> = new Map() // 
    private countries: Map<number, any[]> = new Map() // Map<country_id, country>
    private servers: Map<number, any[]> = new Map() // Map<server_id, server>
    private ftp_configuration: Map<number, any[]> = new Map(); // Map<server_id, ftp_configuration>

    constructor(api_key: string, ps_database: DatabaseHandler) {
        this.api_key = api_key;
        this.ps_database = ps_database;

        this.buildteamID = null;
    }


    // Updates the cache for the build team
    async updateCache(){
        if(this.ps_database.settings.debug)
            console.log("Updating cache for build team: " + this.api_key)

        this.buildteamID = await this.getPSBuildTeamIDFromDatabase();

        if(this.buildteamID == undefined || this.buildteamID == null)
            return;

        this.cities.clear();
        this.countries.clear();
        this.servers.clear();
        this.ftp_configuration.clear();

        // Update all countries, cities, servers and ftp configurations
        const countries = await this.getPSCountriesFromDatabase();
        for(const country of countries){
            const cities = await this.getPSCitiesFromDatabase(country.id);
            const servers = await this.getPSServersFromDatabase(country.id);

            // Update all servers and ftp configurations
            for(const server of servers){
                const ftp_configuration = await this.getPSFTPConfigurationFromDatabase(server.id);

                this.servers.set(server.id, server);
                this.ftp_configuration.set(server.id, ftp_configuration);
            }

            this.cities.set(country.id, cities);
            this.countries.set(country.id, country);
        }
    }


    /* ======================================= */
    /*              PlotSystem                 */
    /* ======================================= */


    // Returns a list of cities. If no cities are found, an empty list is returned.
    getPSCities(){
        if(this.cities == null || this.cities.size == 0){
            this.updateCache();
            return []
        }

        const cities = [];
        for(const city of this.cities.values())
            cities.push(...city);

        return cities;
    }

    // Returns a list of cities for the given country id. If the country id is not found, an empty list is returned.
    getPSCitiesByCountry(country_id: number){
        if(this.cities == null || this.cities.size == 0){
            this.updateCache();
            return []
        }

        if(!this.cities.has(country_id))
            return [];

        return this.cities.get(country_id);
    }

    // Returns a map of countries with the country id as the key. If no countries are found, an empty map is returned.
    getPSCountries(){
        if(this.countries == null || this.countries.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.countries;
    }


    // Returns a map of servers with the server id as the key. If no servers are found, an empty map is returned.
    getPSServers(){
        if(this.servers == null || this.servers.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.servers;
    }

    // Returns a map of ftp configurations with the server id as the key. If no ftp configurations are found, an empty map is returned.
    getPSFTPConfiguration(){
        if(this.ftp_configuration == null || this.ftp_configuration.size == 0){
            this.updateCache();
            return new Map();
        }

        return this.ftp_configuration;        
    }

    // Returns an uncached list of plots of this team. If no plots are found, an empty list is returned.
    async getPSPlots(){
        if(this.cities == null || this.cities.size == 0)
            return [];

        const plots = [];
        for(const city of this.getPSCities()){
            const cityPlots = await this.getPSPlotsByCity(city.id);
            plots.push(...cityPlots);
        }

        return plots;
    }

    // Checks if the given plot id is valid for this team. If the plot id is not found, false is returned.
    async isValidPSPlot(plot_id: number){
        if(this.cities == null || this.cities.size == 0)
            return false;

        for(const city of this.getPSCities()){
            const cityPlots = await this.getPSPlotsByCity(city.id);
            if(cityPlots.some((plot: {id: number}) => plot.id == plot_id))
                return true;
        }

        return false;
    }

    // Returns a plot for the given plot id. If the plot id is not found, null is returned.
    async getPSPlot(plot_id: number){
        if(this.cities == null || this.cities.size == 0)
            return null;

        for(const plot of await this.getPSPlots())
        if(plot.id == plot_id)
            return plot;

        return null;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getPSPlotsByCity(city_id: number){
        if(!this.cities.has(city_id))
            return [];

        return await this.getPSCityPlotsFromDatabase(city_id);        
    }

    // Creates a new plot for the given city id. If the city id is not found, false is returned.
    async createPSPlot(city_project_id: number, difficulty_id: number, mc_coordinates: [number, number, number], outline: any, create_player: string, version: string){
        if(!this.getPSCities().some(city => city.id == city_project_id))
            return false;

        return await this.createPSPlotInDatabase(city_project_id, difficulty_id, mc_coordinates, outline, create_player, version);
    }

    // Updates the plot with the given plot id. If the plot id is not found, false is returned.
    async updatePSPlot(plot_id: number, city_project_id: number, difficulty_id: number, review_id: number, owner_uuid: string, member_uuids: string[], status: any, mc_coordinates: [number, number, number], outline: any, score: string, last_activity: string, pasted: string, type: string, version: string){
        if(!this.isValidPSPlot(plot_id))
            return false;

        return await this.updatePSPlotInDatabase(plot_id, city_project_id, difficulty_id, review_id, owner_uuid, member_uuids, status, mc_coordinates, outline, score, last_activity, pasted, type, version);
    }

    // Returns an uncached list of reviews.
    async getPSReviews(){
        if(this.cities == null || this.cities.size == 0)
            return [];

        const reviews = [];
        for(const city of this.getPSCities()){
            const cityReviews = await this.getPSReviewsByCity(city.id);
            reviews.push(...cityReviews);
        }

        return reviews;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getPSReviewsByCity(city_id: number){
        if(!this.cities.has(city_id))
            return [];

        return await this.getPSCityReviewsFromDatabase(city_id);        
    }

    

    /* =================================================== */
    /*         PLOT SYSTEM DATABASE GET REQUESTS           */
    /* =================================================== */

    async getPSBuildTeamIDFromDatabase(){
        const SQL = "SELECT a.id as btid FROM plotsystem_buildteams as a WHERE api_key_id = (SELECT b.id FROM plotsystem_api_keys as b WHERE api_key = ?)";
        const result = await this.ps_database.query(SQL, [this.api_key]);

        if(result.length == 0)
            return null;

        return result[0].btid;
    }
    
    async getPSCountriesFromDatabase(){
        const SQL = "SELECT a.* FROM plotsystem_countries as a, plotsystem_buildteam_has_countries as b WHERE buildteam_id = ? AND a.id = b.country_id";
        return await this.ps_database.query(SQL, [this.buildteamID]);
    }

    async getPSCitiesFromDatabase(country_id: number){
        const SQL = "SELECT * FROM plotsystem_city_projects WHERE country_id = ?";
        return await this.ps_database.query(SQL, [country_id]);
    }

    async getPSServersFromDatabase(country_id: number){
        const SQL = "SELECT * FROM plotsystem_servers WHERE id = (SELECT server_id FROM plotsystem_countries WHERE id = ?)";
        return await this.ps_database.query(SQL, [country_id]);
    }

    async getPSFTPConfigurationFromDatabase(server_id: number){
        const SQL = "SELECT * FROM plotsystem_ftp_configurations as a WHERE a.id = (SELECT ftp_configuration_id FROM plotsystem_servers as b WHERE b.id = ?)";
        return await this.ps_database.query(SQL, [server_id]);
    }

    async getPSCityPlotsFromDatabase(city_id: number){
        const SQL = "SELECT * FROM plotsystem_plots WHERE city_project_id = ?";
        return await this.ps_database.query(SQL, [city_id]);
    }

    async getPSCityReviewsFromDatabase(city_id: number){
        const SQL = "SELECT a.* FROM plotsystem_reviews as a, plotsystem_plots as b WHERE a.id = b.review_id";
        return await this.ps_database.query(SQL, [city_id]);
    }



    /* =================================================== */
    /*         PLOTSYSTEM DATABASE POST REQUEST            */
    /* =================================================== */

    async createPSPlotInDatabase(city_project_id: number, difficulty_id: number, mc_coordinates: [number, number, number], outline: any, create_player: string, version: string){
        const SQL = "INSERT INTO plotsystem_plots (city_project_id, difficulty_id, mc_coordinates, outline, create_player, version) VALUES (?, ?, ?, ?, ?, ?)";

        const result = await this.ps_database.query(SQL, [city_project_id, difficulty_id, mc_coordinates, outline, create_player, version]);

        if(result.affectedRows == 1)
            return true;
        else 
            return false;
    }   


    /* =================================================== */
    /*         PLOTSYSTEM DATABASE PUT REQUEST             */
    /* =================================================== */

    // Updates the plot with the given plot id. If one of the parameters is null, the value in the database is not updated.
    async updatePSPlotInDatabase(plot_id: number, city_project_id: number, difficulty_id: number, review_id: number, owner_uuid: string, member_uuids: string[], status: any, mc_coordinates: [number, number, number], outline: any, score: string, last_activity: string, pasted: string, type: string, version: string){
        const SQL = "UPDATE plotsystem_plots SET city_project_id = ?, difficulty_id = ?, review_id = ?, owner_uuid = ?, member_uuids = ?, status = ?, mc_coordinates = ?, outline = ?, score = ?, last_activity = ?, pasted = ?, type = ?, version = ? WHERE id = ?";

        const result = await this.ps_database.query(SQL, [city_project_id, difficulty_id, review_id, owner_uuid, member_uuids, status, mc_coordinates, outline, score, last_activity, pasted, type, version, plot_id]);

        if(result.affectedRows == 1)
            return true;
        else 
            return false;
    }
}