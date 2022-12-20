const initRoutes = async (app, joi, plotSystem) => {

    app.get('/api/builders', function (req, res) {
        res.send(JSON.stringify(plotSystem.getBuilders()))
    })

}

module.exports = { initRoutes }