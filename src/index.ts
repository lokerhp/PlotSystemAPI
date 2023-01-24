import { NestFactory } from '@nestjs/core';
import express from 'express';

const app = express()
const router = express.Router()
import Joi from 'joi';
import bodyParser from 'body-parser';

// Plot System Imports
import Settings from './struct/settings.js';
import Database from './struct/database.js';

const config = new Settings()
const db = new Database(config)


import PlotSystem from './struct/core/plotsystem.js';
const plotSystem = new PlotSystem(db);

// Init GET Routes for the API
(await import('./routes/builders/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/difficulties/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/cities/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/countries/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/ftp_configuration/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/plots/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/reviews/GET.js')).initRoutes(router, Joi, plotSystem);
(await import('./routes/teams/servers/GET.js')).initRoutes(router, Joi, plotSystem);
// Init POST Routes for the API

(await import('./routes/teams/plots/POST.js')).initRoutes(router, Joi, plotSystem);


// Init PUT Routes for the API
(await import('./routes/teams/plots/PUT.js')).initRoutes(router, Joi, plotSystem);

// Use the body-parser middleware
//@ts-ignore
router.use(express.json())


// A timer that runs every 10 minutes
setInterval(() => {
    plotSystem.updateCache();
}, 10*60*1000);

app.use('/', router)

// Start the server
app.listen(config.port, () => 
    {
        plotSystem.updateCache(true).then(() => {
            notfityAppReady();
        });
    }
);

function notfityAppReady(){
    console.clear();
    console.log(
        '  ____  _       _   ____            _                    _    ____ ___ \n'
        + ' |  _ \\| | ___ | |_/ ___| _   _ ___| |_ ___ _ __ ___    / \\  |  _ \\_ _|\n'
        + ' | |_) | |/ _ \\| __\\___ \\| | | / __| __/ _ \\ \'_ ` _ \\  / _ \\ | |_) | | \n'
        + ' |  __/| | (_) | |_ ___) | |_| \\__ \\ ||  __/ | | | | |/ ___ \\|  __/| | \n'
        + ' |_|   |_|\\___/ \\__|____/ \\__, |___/\\__\\___|_| |_| |_/_/   \\_\\_|  |___|\n'
        + '                          |___/                                        \n'
        + '\n'
        + '-----------------------------------------------------------------------\n'
        + 'PlotSystemAPI ' + config.version +' by MineFact\n'
        + 'Listening on: http://localhost:' + config.port + '\n'
        + '-----------------------------------------------------------------------\n'
        + '\n'
    )
}