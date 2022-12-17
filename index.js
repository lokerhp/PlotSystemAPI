// General Imports
require('dotenv').config();
const express = require('express')
const app = express()

// Plot System Imports
const settings = require('./src/Settings.js')
const database = require('./src/Database.js')
const PlotSystem = require('./src/PlotSystem.js')

const plotSystem = new PlotSystem(database);




app.get('/api/builders', function (req, res) {
  plotSystem.getBuilders()
  .then(rows => {
    res.send(JSON.stringify(rows))
  })
})

// Start the server
app.listen(settings.port, () => console.log(
      '  ____  _       _   ____            _                    _    ____ ___ \n'
    + ' |  _ \\| | ___ | |_/ ___| _   _ ___| |_ ___ _ __ ___    / \\  |  _ \\_ _|\n'
    + ' | |_) | |/ _ \\| __\\___ \\| | | / __| __/ _ \\ \'_ ` _ \\  / _ \\ | |_) | | \n'
    + ' |  __/| | (_) | |_ ___) | |_| \\__ \\ ||  __/ | | | | |/ ___ \\|  __/| | \n'
    + ' |_|   |_|\\___/ \\__|____/ \\__, |___/\\__\\___|_| |_| |_/_/   \\_\\_|  |___|\n'
    + '                          |___/                                        \n'
    + '\n'
    + '-----------------------------------------------------------------------\n'
    + 'PlotSystemAPI ' + settings.version +' by MineFact\n'
    + 'Listening on: http://localhost:' + settings.port + '\n'
    + '-----------------------------------------------------------------------\n'
    + '\n'
));