import { Router } from "express";
import Network from "../../../../struct/core/network.js";

export async function initRoutes(app: Router, joi: any, network: Network) {

    app.get('/api/plotsystem/teams/:apikey/reviews', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;
        
        
        const buildTeam = network.getBuildTeam(req.params.apikey);

        if(buildTeam == null) {
            res.status(400).send({ error: 'Build Team not found' });
            return;
        }

        buildTeam.getPSReviews().then((reviews) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(reviews))
        })
    })

}