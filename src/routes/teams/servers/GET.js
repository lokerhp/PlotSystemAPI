const initRoutes = async (app, joi, plotSystem) => {

    app.get('/api/teams/:apikey/servers', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!plotSystem.validateAPIKey(joi, req, res))
            return;
        

        const buildTeam = plotSystem.getBuildTeam(req.params.apikey);
        const map = buildTeam.getServers();
        res.send(Object.fromEntries(map))
    })

}

module.exports = { initRoutes }