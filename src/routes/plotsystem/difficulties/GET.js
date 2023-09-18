export  async function initRoutes(app, joi, plotSystem) {

    app.get('/api/plotsystem/difficulties', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(plotSystem.getPSDifficulties()))
    })

}