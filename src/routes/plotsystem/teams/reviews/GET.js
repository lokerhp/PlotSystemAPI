export  async function initRoutes(app, joi, network) {

    app.get('/api/plotsystem/teams/:apikey/reviews', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!network.validateAPIKey(req, res))
            return;
        
        
        const buildTeam = network.getBuildTeam(req.params.apikey);
        buildTeam.getPSReviews().then((reviews) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(reviews))
        })
    })

}