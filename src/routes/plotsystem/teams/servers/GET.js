export  async function initRoutes(app, joi, network) {

    app.get('/api/plotsystem/teams/:apikey/servers', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;
        

        const buildTeam = network.getBuildTeam(req.params.apikey);
        const map = buildTeam.getPSServers();

        res.setHeader('Content-Type', 'application/json');
        res.send(Object.fromEntries(map))
    })

}