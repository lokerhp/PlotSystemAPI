import DatabaseHandler from "../database.js";
import Network from "./network.js";


export default class BuildTeam {

    private static readonly CITY_UPDATE_INTERVAL: number = 60 * 24; // 24 hours
    private static readonly COUNTRY_UPDATE_INTERVAL: number = 60 * 24; // 24 hours
    private static readonly SERVER_UPDATE_INTERVAL: number = 60 * 24; // 24 hours
    private static readonly FTP_CONFIGURATION_UPDATE_INTERVAL: number = 60 * 24; // 24 hours
    private static readonly BUILD_TEAM_INFO_UPDATE_INTERVAL: number = 60 * 1; // 1 hour


    private apiKey: string;
    private network: Network;
    private psDatabase: DatabaseHandler
    private nwDatabase: DatabaseHandler

    private psBuildTeamID: string | null = null;
    private psCities: Map<number, any[]> = new Map() // Map<country_id, city>
    private psCountries: Map<number, any[]> = new Map() // Map<country_id, country>
    private psServers: Map<number, any[]> = new Map() // Map<server_id, server>
    private psFTPConfiguration: Map<number, any[]> = new Map(); // Map<server_id, ftp_configuration>

    private buildTeamInfo: any | null = null;


    constructor(apiKey: string, network: Network) {
        this.apiKey = apiKey;
        this.network = network;
        this.psDatabase = network.getPlotSystemDatabase();
        this.nwDatabase = network.getNetworkDatabase();
    }


    // Updates the cache for the build team
    async updateCache(){
        if(this.psDatabase.settings.debug)
            console.log("Updating cache for build team: " + this.apiKey)
        

        if(this.psCities != null && this.network.getUpdateCacheTicks() % BuildTeam.CITY_UPDATE_INTERVAL == 0)
            this.psCities.clear();

        if(this.psCountries != null && this.network.getUpdateCacheTicks() % BuildTeam.COUNTRY_UPDATE_INTERVAL == 0)
            this.psCountries.clear();
            
        if(this.psServers != null && this.network.getUpdateCacheTicks() % BuildTeam.SERVER_UPDATE_INTERVAL == 0)
            this.psServers.clear();

        if(this.psFTPConfiguration != null && this.network.getUpdateCacheTicks() % BuildTeam.FTP_CONFIGURATION_UPDATE_INTERVAL == 0)
            this.psFTPConfiguration.clear();

        if(this.buildTeamInfo != null && this.network.getUpdateCacheTicks() % BuildTeam.BUILD_TEAM_INFO_UPDATE_INTERVAL == 0)
            this.buildTeamInfo = null;
    }

    async loadBuildTeamData(){
        if(this.psDatabase.settings.debug)
            console.log("Loading data for build team: " + this.apiKey)

        // Get the build team information
        this.buildTeamInfo = await this.getBuildTeamInfoFromDatabase();


        this.psBuildTeamID = await this.getPSBuildTeamIDFromDatabase();

        if(this.psBuildTeamID == undefined || this.psBuildTeamID == null)
            return;

        // Update all countries, cities, servers and ftp configurations
        const countries = await this.getPSCountriesFromDatabase();

        // Loop through all countries
        for(const country of countries){
            const cities = await this.getPSCitiesFromDatabase(country.id);
            const servers = await this.getPSServersFromDatabase(country.id);

            // Update all servers and ftp configurations
            for(const server of servers){
                const ftpConfiguration = await this.getPSFTPConfigurationFromDatabase(server.id);

                this.psServers.set(server.id, server);
                this.psFTPConfiguration.set(server.id, ftpConfiguration);
            }

            this.psCities.set(country.id, cities);
            this.psCountries.set(country.id, country);
        }
    }



    /* ======================================= */
    /*              BuildTeam                  */
    /* ======================================= */

    /** Returns information about the build team. 
        If key is null, all information is returned, otherwise only the information for the given key is returned. 
        If no information is found, null is returned.*/
    async getBuildTeamInfo(key: string | null){
        if(this.buildTeamInfo == null)
            await this.loadBuildTeamData();

        if(key == null)
            return this.buildTeamInfo[0];

        if(!this.buildTeamInfo[0].hasOwnProperty(key))
            return null;

        return this.buildTeamInfo[0][key];
    }


    /* ======================================= */
    /*              PlotSystem                 */
    /* ======================================= */


    // Returns a list of cities. If no cities are found, an empty list is returned.
    async getPSCities(){
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        const cities = [];
        for(const city of this.psCities.values())
            cities.push(...city);

        return cities;
    }

    // Returns a list of cities for the given country id. If the country id is not found, an empty list is returned.
    async getPSCitiesByCountry(country_id: number){
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        if(!this.psCities.has(country_id))
            return [];

        return this.psCities.get(country_id);
    }

    // Returns a map of countries with the country id as the key. If no countries are found, an empty map is returned.
    async getPSCountries(){
        if(this.psCountries == null || this.psCountries.size == 0)
            await this.loadBuildTeamData();

        return this.psCountries;
    }


    // Returns a map of servers with the server id as the key. If no servers are found, an empty map is returned.
    async getPSServers(){
        if(this.psServers == null || this.psServers.size == 0)
            await this.loadBuildTeamData();
            
        return this.psServers;
    }

    // Returns a map of ftp configurations with the server id as the key. If no ftp configurations are found, an empty map is returned.
    async getPSFTPConfiguration(){
        if(this.psFTPConfiguration == null || this.psFTPConfiguration.size == 0)
            await this.loadBuildTeamData();

        return this.psFTPConfiguration;        
    }

    // Returns an uncached list of plots of this team. If no plots are found, an empty list is returned.
    async getPSPlots(){
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        const plots = [];
        for(const city of await this.getPSCities()){
            const cityPlots = await this.getPSPlotsByCity(city.id);
            plots.push(...cityPlots);
        }

        return plots;
    }

    // Checks if the given plot id is valid for this team. If the plot id is not found, false is returned.
    async isValidPSPlot(plot_id: number){
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        for(const city of await this.getPSCities()){
            const cityPlots = await this.getPSPlotsByCity(city.id);
            if(cityPlots.some((plot: {id: number}) => plot.id == plot_id))
                return true;
        }

        return false;
    }

    // Returns a plot for the given plot id. If the plot id is not found, null is returned.
    async getPSPlot(plot_id: number){
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        for(const plot of await this.getPSPlots())
        if(plot.id == plot_id)
            return plot;

        return null;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getPSPlotsByCity(city_id: number){
        if(!this.psCities.has(city_id))
            return [];

        return await this.getPSCityPlotsFromDatabase(city_id);        
    }

    // Creates a new plot for the given city id. If the city id is not found, false is returned.
    async createPSPlot(city_project_id: number, difficulty_id: number, mc_coordinates: [number, number, number], outline: any, create_player: string, version: string){
        const cities = await this.getPSCities();
        
        if(!cities.some(city => city.id == city_project_id))
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
        if(this.psCities == null || this.psCities.size == 0)
            await this.loadBuildTeamData();

        const reviews = [];
        for(const city of await this.getPSCities()){
            const cityReviews = await this.getPSReviewsByCity(city.id);
            reviews.push(...cityReviews);
        }

        return reviews;
    }

    // Returns an uncached list of plots for the given city id. If the city id is not found, an empty list is returned. 
    async getPSReviewsByCity(city_id: number){
        if(!this.psCities.has(city_id))
            return [];

        return await this.getPSCityReviewsFromDatabase(city_id);        
    }

    

    /* =================================================== */
    /*         PLOT SYSTEM DATABASE GET REQUESTS           */
    /* =================================================== */

    async getPSBuildTeamIDFromDatabase(){
        const SQL = "SELECT a.id as btid FROM plotsystem_buildteams as a WHERE api_key_id = (SELECT b.id FROM plotsystem_api_keys as b WHERE api_key = ?)";
        const result = await this.psDatabase.query(SQL, [this.apiKey]);

        if(result.length == 0)
            return null;

        return result[0].btid;
    }
    
    async getPSCountriesFromDatabase(){
        const SQL = "SELECT a.* FROM plotsystem_countries as a, plotsystem_buildteam_has_countries as b WHERE buildteam_id = ? AND a.id = b.country_id";
        return await this.psDatabase.query(SQL, [this.psBuildTeamID]);
    }

    async getPSCitiesFromDatabase(country_id: number){
        const SQL = "SELECT * FROM plotsystem_city_projects WHERE country_id = ?";
        return await this.psDatabase.query(SQL, [country_id]);
    }

    async getPSServersFromDatabase(country_id: number){
        const SQL = "SELECT * FROM plotsystem_servers WHERE id = (SELECT server_id FROM plotsystem_countries WHERE id = ?)";
        return await this.psDatabase.query(SQL, [country_id]);
    }

    async getPSFTPConfigurationFromDatabase(server_id: number){
        const SQL = "SELECT * FROM plotsystem_ftp_configurations as a WHERE a.id = (SELECT ftp_configuration_id FROM plotsystem_servers as b WHERE b.id = ?)";
        return await this.psDatabase.query(SQL, [server_id]);
    }

    async getPSCityPlotsFromDatabase(city_id: number){
        const SQL = "SELECT * FROM plotsystem_plots WHERE city_project_id = ?";
        return await this.psDatabase.query(SQL, [city_id]);
    }

    async getPSCityReviewsFromDatabase(city_id: number){
        const SQL = "SELECT a.* FROM plotsystem_reviews as a, plotsystem_plots as b WHERE a.id = b.review_id";
        return await this.psDatabase.query(SQL, [city_id]);
    }

    async getBuildTeamInfoFromDatabase() {
        const SQL = "SELECT * FROM BuildTeams WHERE APIKey = ?";
        return await this.nwDatabase.query(SQL, [this.apiKey]);
    }



    /* =================================================== */
    /*         PLOTSYSTEM DATABASE POST REQUEST            */
    /* =================================================== */

    async createPSPlotInDatabase(city_project_id: number, difficulty_id: number, mc_coordinates: [number, number, number], outline: any, create_player: string, version: string){
        const SQL = "INSERT INTO plotsystem_plots (city_project_id, difficulty_id, mc_coordinates, outline, create_player, version) VALUES (?, ?, ?, ?, ?, ?)";

        const result = await this.psDatabase.query(SQL, [city_project_id, difficulty_id, mc_coordinates, outline, create_player, version]);

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

        const result = await this.psDatabase.query(SQL, [city_project_id, difficulty_id, review_id, owner_uuid, member_uuids, status, mc_coordinates, outline, score, last_activity, pasted, type, version, plot_id]);

        if(result.affectedRows == 1)
            return true;
        else 
            return false;
    }
}