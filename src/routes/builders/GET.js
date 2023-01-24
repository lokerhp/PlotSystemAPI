export  async function initRoutes(app, joi, plotSystem) {

    app.get('/api/builders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(plotSystem.getBuilders()))
    })

}