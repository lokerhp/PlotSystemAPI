import { Router } from "express";
import Network from "../../struct/core/network.js";

export async function initRoutes(app: Router, joi: any, network: Network) {

    app.get('/api/teams/:apikey/description', async function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;

        const buildTeam = await network.getBuildTeam(req.params.apikey);

        if(buildTeam == null) {
            res.status(400).send({ error: 'Build Team not found' });
            return;
        }

        const value = await buildTeam.getBuildTeamInfo("Description");

        if(value == null) {
            res.status(400).send({ error: 'Build Team Description for this Build Team not found' });
            return;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({buildTeamDescription : value}))
    })
}