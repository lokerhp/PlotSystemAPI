const initRoutes = async (app, joi, plotSystem) => {

    app.get('/api/difficulties', function (req, res) {
        res.send(JSON.stringify(plotSystem.getDifficulties()))
    })

}

module.exports = { initRoutes }