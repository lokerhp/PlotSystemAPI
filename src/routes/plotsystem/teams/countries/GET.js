export  async function initRoutes(app, joi, network) {

    app.get('/api/plotsystem/teams/:apikey/countries', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;

        
        const buildTeam = network.getBuildTeam(req.params.apikey);
        const map = buildTeam.getPSCountries();

        res.setHeader('Content-Type', 'application/json');
        res.send(Object.fromEntries(map))
    })

}
