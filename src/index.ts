import Database from "./struct/database.js";
import Joi from "joi";
import PlotSystem from "./struct/core/plotsystem.js";
import Settings from "./struct/settings.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import Network from "./struct/core/network.js";

const app = express();
const router = express.Router();

// Plot System Imports

const config = new Settings();
const plotsystem_database = new Database(config, config.plotsystem_database);
const network_database = new Database(config, config.network_database);

const network = new Network(plotsystem_database, network_database);

// Init GET Routes for the API
(await import("./routes/plotsystem/builders/GET.js")).initRoutes(router, Joi, network.getPlotSystem());
(await import("./routes/plotsystem/difficulties/GET.js")).initRoutes(
  router,
  Joi,
  network.getPlotSystem()
);
(await import("./routes/plotsystem/teams/cities/GET.js")).initRoutes(
  router,
  Joi,
  network
);
(await import("./routes/plotsystem/teams/countries/GET.js")).initRoutes(
  router,
  Joi,
  network
);
(await import("./routes/plotsystem/teams/plots/GET.js")).initRoutes(
  router,
  Joi,
  network
);
(await import("./routes/plotsystem/teams/reviews/GET.js")).initRoutes(
  router,
  Joi,
  network
);
(await import("./routes/plotsystem/teams/servers/GET.js")).initRoutes(
  router,
  Joi,
  network
);
// Init POST Routes for the API

(await import("./routes/plotsystem/teams/plots/POST.js")).initRoutes(
  router,
  Joi,
  network
);

// Init PUT Routes for the API
(await import("./routes/plotsystem/teams/plots/PUT.js")).initRoutes(
  router,
  Joi,
  network
);

// Use the body-parser middleware
//@ts-ignore
router.use(express.json());
// Use CORS & Helmet
router.use(cors());
router.use(helmet());

// A timer that runs every 1 minute
setInterval(() => {
  network.updateCache();
}, 1 * 60 * 1000);

app.use("/", router);

// Start the server
app.listen(config.port, () => {
  network.updateCache(true).then(() => {
    notfityAppReady();
  });
});

function notfityAppReady() {
  console.clear();
  console.log(
    "  _   _      _                      _        _    ____ ___ \n" +
      " | \\ | | ___| |___      _____  _ __| | __   / \\  |  _ \\_ _|\n" +
      " |  \\| |/ _ \\ __\\ \\ /\\ / / _ \\| '__| |/ /  / _ \\ | |_) | | \n" +
      " | |\\  |  __/ |_ \\ V  V / (_) | |  |   <  / ___ \\|  __/| | \n" +
      " |_| \\_|\\___|\\__| \\_/\\_/  ___/|_|  |_|\\_\\/_/   \\_\\_|  |___|\n" +
      "\n" +
      "-----------------------------------------------------------------------\n" +
      "NetworkAPI " +
      config.version +
      " by BuildTheEarth\n" +
      "Listening on: http:/localhost:" +
      config.port +
      "\n" +
      "-----------------------------------------------------------------------\n" +
      "\n"
  );
}
