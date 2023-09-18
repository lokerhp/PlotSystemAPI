export  async function initRoutes(app, joi, plotSystem) {

    app.get('/api/plotsystem/teams/:apikey/countries', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!plotSystem.validateAPIKey(req, res))
            return;

        
        const buildTeam = plotSystem.getBuildTeam(req.params.apikey);
        const map = buildTeam.getCountries();

        res.setHeader('Content-Type', 'application/json');
        res.send(Object.fromEntries(map))
    })

}
