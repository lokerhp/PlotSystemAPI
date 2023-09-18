import BuildTeam from "./buildteam.js";
import PlotSystem from "./plotsystem.js";
import DatabaseHandler from "../database.js";
import ProgressBar from "progress";
import express from "express";
import joi from "joi";

export default class Network {
    private plotsystem_database: DatabaseHandler;
    private network_database: DatabaseHandler;

    private api_keys: any[] | null = null;
    private buildTeams = new Map();
    private plotSystem: PlotSystem;

    constructor(plotsystem_database: DatabaseHandler, network_database: DatabaseHandler) {
        this.plotsystem_database = plotsystem_database;
        this.network_database = network_database;

        this.plotSystem = new PlotSystem(this);
    }

    async updateCache(isStarting: boolean = false) {
        this.api_keys = await this.getAPIKeysFromDatabase();

        let bar = null;
        if (isStarting == true) {
            // Get how many API keys there are as an integer
            var len = (this?.api_keys?.length ?? 0) + 1;

            // A process bar that shows the progress of the cache update
            bar = new ProgressBar("Starting NetworkAPI [:bar] :percent :etas", {
            complete: "=",
            incomplete: " ",
            width: 20,
            total: len,
            });
            bar.render();
        }

        if (isStarting == true) bar?.tick();


        // Update the cache for all modules

        this.plotSystem.updateCache();

        for (const apiKey of this?.api_keys?.values() ?? []) {
            const buildTeam = this.getBuildTeam(apiKey);

            if (buildTeam == null) continue;

            await buildTeam.updateCache();

            if (isStarting == true) bar?.tick();
        }
    }

    getAPIKeys(): string[] {
        if (this.api_keys == null) {
            this.updateCache();
            return [];
        }

        return this.api_keys;
    }

    getPlotSystem(): PlotSystem {
        return this.plotSystem;
    }

    getNetworkDatabase(): DatabaseHandler {
        return this.network_database;
    }

    getPlotSystemDatabase(): DatabaseHandler {
        return this.plotsystem_database;
    }

    getBuildTeam(api_key: string): BuildTeam | null {
        const api_keys = this.getAPIKeys();

        // Validate that the API key exists in the plot system database
        if (!api_keys.includes(api_key)) return null;

        // Check if the build team is already in the cache
        if (this.buildTeams.has(api_key)) return this.buildTeams.get(api_key);

        // Create a new build team and add it to the cache
        const buildTeam = new BuildTeam(api_key, this.plotsystem_database);
        this.buildTeams.set(api_key, buildTeam);

        return buildTeam;
    }

    // Validate values

    // Validate an API key that looks like this "fffb262b-0324-499a-94a6-eebf845e6123"
    validateAPIKey(req: express.Request, res: express.Response): boolean {
        // Validate that the API key is a valid GUID
        const schema = joi.object().keys({
            apikey: joi.string().guid().required(),
        });

        const result = schema.validate(req.params);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return false;
        }

        //Validate that the API key exists in the plot system database
        const api_keys = this.getAPIKeys();
        console.log(req.params);
        if (!api_keys.includes(req.params.apikey)) {
            res.status(401).send({ success: false, error: "Invalid API key" });
            return false;
        }

        return true;
    }

    // Get values from database

    async getAPIKeysFromDatabase() {
        const SQL = "SELECT * FROM plotsystem_api_keys";
        const result = await this.plotsystem_database.query(SQL); // result: [{"id":1,"api_key":"super_cool_api_key","created_at":"2022-06-23T18:00:09.000Z"}]
        return result.map((row: { api_key: string }) => row.api_key); // result: ["super_cool_api_key"]
    }
}
