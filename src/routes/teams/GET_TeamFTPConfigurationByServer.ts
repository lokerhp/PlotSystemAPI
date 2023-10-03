import { Router } from "express";
import Network from "../../struct/core/network.js";

export async function initRoutes(app: Router, joi: any, network: Network) {

    app.get('/api/teams/:apikey/ftp_configuration/:id', async function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;

        const buildTeam = await network.getBuildTeam(req.params.apikey);

        if(buildTeam == null) {
            res.status(400).send({ error: 'Build Team not found' });
            return;
        }

        var id = parseInt(req.params.id);

        buildTeam.getPSFTPConfigurationByServer(id).then((server) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(server))
        })
    })
}