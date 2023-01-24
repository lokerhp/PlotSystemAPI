export  async function initRoutes(app, joi, plotSystem) {

    app.get('/api/difficulties', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(plotSystem.getDifficulties()))
    })

}