const initRoutes = async (app, joi, plotSystem) => {

    // A put request to change plot settings of a build team
    app.put('/api/teams/:apikey/plots', function (req, res) {

        // Validate that the API key is a valid GUID
        if(!plotSystem.validateAPIKey(joi, req, res))
            return;

        const plotid = req.body[0].id;

        if(plotid == null){
            res.status(400).send({ error: 'Missing plot id' });
            return;
        }

        const buildTeam = plotSystem.getBuildTeam(req.params.apikey);    

        if(!buildTeam.isValidPlot(plotid)) {
            res.status(400).send({ error: 'Plot could not be found' });
            return;
        }

        buildTeam.getPlot(plotid).then((plot) => {

            if(plot == null){
                res.status(400).send({ error: 'Plot not found' });
                return;
            }

            console.log(plot);

            // Get the parameters from the request
            let city_project_id = plot.city_project_id;
            let difficulty_id = plot.difficulty_id;
            let review_id = plot.review_id;
            let owner_uuid = plot.owner_uuid;
            let member_uuids = plot.member_uuids;
            let status = plot.status;
            let mc_coordinates = plot.mc_coordinates;
            let outline = plot.outline;
            let score = plot.score;
            let last_activity = plot.last_activity;
            let pasted = plot.pasted;
            let type = plot.type;
            let version = plot.version;

            if(req.body[0].city_project_id != null)
                city_project_id = req.body[0].city_project_id;
            if(req.body[0].difficulty_id != null)
                difficulty_id = req.body[0].difficulty_id;
            if(req.body[0].review_id != null)
                review_id = req.body[0].review_id;
            if(req.body[0].owner_uuid != null)
                owner_uuid = req.body[0].owner_uuid;
            if(req.body[0].member_uuids != null)
                member_uuids = req.body[0].member_uuids;
            if(req.body[0].status != null)
                status = req.body[0].status;
            if(req.body[0].mc_coordinates != null)  
                mc_coordinates = req.body[0].mc_coordinates;
            if(req.body[0].outline != null)
                outline = req.body[0].outline;
            if(req.body[0].score != null)
                score = req.body[0].score;
            if(req.body[0].last_activity != null)
                last_activity = req.body[0].last_activity;
            if(req.body[0].pasted != null)
                pasted = req.body[0].pasted;
            if(req.body[0].type != null)
                type = req.body[0].type;
            if(req.body[0].version != null)
                version = req.body[0].version;

            
            // Update the plot
            buildTeam.updatePlot(plotid, city_project_id, difficulty_id, review_id, owner_uuid, member_uuids, status, mc_coordinates, outline, score, last_activity, pasted, type, version).then((success) => {
                if(!success){
                    res.status(400).send({ error: 'An error occurred while updating the plot' });
                    return;
                }

                res.status(200).send({ success: true });  
            });
        });           
    })

}

module.exports = { initRoutes }