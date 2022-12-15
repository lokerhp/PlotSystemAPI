require('dotenv').config();
const express = require('express')
const app = express()

// Plot System Imports
const settings = require('./settings.js')
const database = require('./src/database.js')

console.log(process.env.USER_ID);
 
app.get('/', function (req, res) {

  database.query("SELECT * FROM `BuildingServers` WHERE `BuildingServerID` = 'Building1NYC'")
  .then(rows => {
  
    const ID = rows[0].BuildingServerID;
    res.send('Hello World \n' + ID)
  })
  .catch(err => {
    console.log(err);
  });


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
    + 'TerraBungeeAPI 1.0.0 by MineFact\n'
    + 'Listening on: localhost:' + settings.port + '\n'
    + '-----------------------------------------------------------------------\n'
));