const initRoutes = async (app, plotSystem) => {

    app.get('/api/builders', function (req, res) {
        plotSystem.getBuilders()
        .then(rows => {
            res.send(JSON.stringify(rows))
        })
    })

}

module.exports = { initRoutes }