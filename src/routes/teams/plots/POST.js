export async function initRoutes(app, joi, plotSystem) {

    app.post('/api/teams/:apikey/plots', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!plotSystem.validateAPIKey(joi, req, res))
            return;
        
        const buildTeam = plotSystem.getBuildTeam(req.params.apikey);    


        // Loop through the plots in the request
        for(const i in req.body){

            // Validate that the request has all the required parameters
            if(req.body[i].city_project_id == null){
                res.status(400).send({success: false, error: 'Missing city_project_id'});
                return;
            }
            if(req.body[i].difficulty_id == null){
                res.status(400).send({success: false, error: 'Missing difficulty_id'});
                return;
            }
            if(req.body[i].mc_coordinates == null){
                res.status(400).send({success: false, error: 'Missing mc_coordinates'});
                return;
            }
            if(req.body[i].outline == null){
                res.status(400).send({success: false, error: 'Missing outline'});
                return;
            }
            

            // Get the parameters from the request
            const city_project_id = req.body[i].city_project_id;
            const difficulty_id = req.body[i].difficulty_id;
            const mc_coordinates = req.body[i].mc_coordinates;
            const outline = req.body[i].outline;
            const version = req.body[i].version;
            const create_player = "API";

            if(req.body.create_player != null)
                create_player = req.body.create_player;


            // Validate that the city exists
            if(!buildTeam.getCities().some(city => city.id == city_project_id))
                res.status(400).send({success: false, error: 'The city does not exist'});
                


             // Create the plot in the database
            const promise = buildTeam.createPlot(city_project_id, difficulty_id, mc_coordinates, outline, create_player, version);


            // Wait for the promise to resolve
            promise.then((success) => {
                    // If the plot was not created, return an error
                    if(!success){
                        res.status(400).send({success: false, error: 'An error occurred while creating the plot'});
                        return;
                    }

                    // Return the success message to the client
                    res.setHeader('Content-Type', 'application/json');
                    res.send({success: true})
            })
        }



       
    })

}