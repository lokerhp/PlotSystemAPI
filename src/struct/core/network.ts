import BuildTeam from "./buildteam.js";
import PlotSystem from "./plotsystem.js";
import DatabaseHandler from "../database.js";
import ProgressBar from "progress";
import express from "express";
import joi from "joi";

export default class Network {
    private static readonly API_KEY_UPDATE_INTERVAL: number = 10; // 10 minutes

    private plotsystemDatabase: DatabaseHandler;
    private networkDatabase: DatabaseHandler;

    private apiKeys: any[] | null = null;
    private buildTeams = new Map();
    private plotSystem: PlotSystem;

    private updateCacheTicks: number = 0;

    constructor(plotsystemDatabase: DatabaseHandler, networkDatabase: DatabaseHandler) {
        this.plotsystemDatabase = plotsystemDatabase;
        this.networkDatabase = networkDatabase;

        this.plotSystem = new PlotSystem(this);
    }

    async updateCache(isStarting: boolean = false) {
        this.updateCacheTicks++;

        if(this.apiKeys == null || this.updateCacheTicks % Network.API_KEY_UPDATE_INTERVAL == 0)
            this.apiKeys = await this.getAPIKeysFromDatabase();

        let bar = null;
        if (isStarting == true) {
            // Get how many API keys there are as an integer
            var len = (this?.apiKeys?.length ?? 0) + 1;

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

        for (const apiKey of this?.apiKeys?.values() ?? []) {
            const buildTeam = await this.getBuildTeam(apiKey);

            if (buildTeam == null) continue;

            buildTeam.updateCache();

            if (isStarting == true) bar?.tick();
        }


        if(this.updateCacheTicks >= Number.MAX_SAFE_INTEGER - 100)
            this.updateCacheTicks = 0;
    }

 
    getUpdateCacheTicks(): number {
        return this.updateCacheTicks;
    }

    getAPIKeys(): string[] {
        if (this.apiKeys == null) {
            this.updateCache();
            return [];
        }

        return this.apiKeys;
    }

    getPlotSystem(): PlotSystem {
        return this.plotSystem;
    }

    getNetworkDatabase(): DatabaseHandler {
        return this.networkDatabase;
    }

    getPlotSystemDatabase(): DatabaseHandler {
        return this.plotsystemDatabase;
    }

    async getBuildTeam(apiKey: string): Promise<BuildTeam|null> {
        const api_keys = this.getAPIKeys();

        // Validate that the API key exists in the plot system database
        if (!api_keys.includes(apiKey)) return null;

        // Check if the build team is already in the cache
        if (this.buildTeams.has(apiKey)) return this.buildTeams.get(apiKey);

        // Create a new build team and add it to the cache
        const buildTeam = new BuildTeam(apiKey, this);
        this.buildTeams.set(apiKey, buildTeam);

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

        if (!api_keys.includes(req.params.apikey)) {
            res.status(401).send({ success: false, error: "Invalid API key" });
            return false;
        }

        return true;
    }

    // Get values from database

    async getAPIKeysFromDatabase() {
        const SQL = "SELECT APIKey FROM BuildTeams";
        const result = await this.networkDatabase.query(SQL); // result: [{"APIKey":"super_cool_api_key"}]
        return result.map((row: { APIKey: string }) => row.APIKey); // result: ["super_cool_api_key"]
    }
}
