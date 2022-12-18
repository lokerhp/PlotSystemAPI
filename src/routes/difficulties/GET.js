const initRoutes = async (app, plotSystem) => {

    app.get('/api/difficulties', function (req, res) {
        plotSystem.getDifficulties()
        .then(rows => {
            res.send(JSON.stringify(rows))
        })
    })

}

module.exports = { initRoutes }