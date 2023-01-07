// General Imports
require('dotenv').config();
const express = require('express')
const app = express()
const Joi = require('joi')
const bodyParser = require('body-parser')

// Plot System Imports
const settings = require('./src/Settings.js')
const database = require('./src/Database.js')
const PlotSystem = require('./src/PlotSystem.js')
const plotSystem = new PlotSystem(database);



// Init GET Routes for the API
require('./src/routes/builders/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/difficulties/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/cities/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/countries/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/ftp_configuration/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/plots/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/reviews/GET.js').initRoutes(app, Joi, plotSystem);
require('./src/routes/teams/servers/GET.js').initRoutes(app, Joi, plotSystem);


// Use the body-parser middleware
app.use(bodyParser.json())

// Init POST Routes for the API
require('./src/routes/teams/plots/POST.js').initRoutes(app, Joi, plotSystem);



// A timer that runs every 10 minutes
setInterval(() => {
    plotSystem.updateCache();
}, 10*60*1000);

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