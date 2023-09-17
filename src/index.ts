import Database from "./struct/database.js";
import Joi from "joi";
import { NestFactory } from "@nestjs/core";
import PlotSystem from "./struct/core/plotsystem.js";
import Settings from "./struct/settings.js";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();
const router = express.Router();

// Plot System Imports

const config = new Settings();
const db = new Database(config);

const plotSystem = new PlotSystem(db);

// Init GET Routes for the API
(await import("./routes/builders/GET.js")).initRoutes(router, Joi, plotSystem);
(await import("./routes/difficulties/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
(await import("./routes/teams/cities/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
(await import("./routes/teams/countries/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
(await import("./routes/teams/plots/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
(await import("./routes/teams/reviews/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
(await import("./routes/teams/servers/GET.js")).initRoutes(
  router,
  Joi,
  plotSystem
);
// Init POST Routes for the API

(await import("./routes/teams/plots/POST.js")).initRoutes(
  router,
  Joi,
  plotSystem
);

// Init PUT Routes for the API
(await import("./routes/teams/plots/PUT.js")).initRoutes(
  router,
  Joi,
  plotSystem
);

// Use the body-parser middleware
//@ts-ignore
router.use(express.json());
// Use CORS & Helmet
router.use(cors());
router.use(helmet());

// A timer that runs every 10 minutes
setInterval(() => {
  plotSystem.updateCache();
}, 10 * 60 * 1000);

app.use("/", router);

// Start the server
app.listen(config.port, () => {
  plotSystem.updateCache(true).then(() => {
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
