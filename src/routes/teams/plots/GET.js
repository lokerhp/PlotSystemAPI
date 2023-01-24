export  async function initRoutes(app, joi, plotSystem) {

    app.get('/api/teams/:apikey/plots', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!plotSystem.validateAPIKey(joi, req, res))
            return;
        

        const buildTeam = plotSystem.getBuildTeam(req.params.apikey);

        buildTeam.getPlots().then((plots) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(plots))
        })
    })

}