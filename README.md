<!-- markdownlint-disable -->
<div align="center">

<img width="128" src="https://buildtheearth.net/assets/img/site-logo-animated.gif" />

# Network API

_A REST-API to interface with data from the BuildTheEarth.net Minecraft Network._

![official](https://go.buildtheearth.net/official-shield)
[![chat](https://img.shields.io/discord/706317564904472627.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.gg/buildtheearth)

</div>
<!-- markdownlint-restore -->

> Formerly known as PlotSystemAPI

## Routes

These are the routes for the Network API.

### Global Plot System

- **Get Builder Count:** <br>
Returns the number of builders of the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/builders<br><br>

- **Get Difficulties:** <br>
Returns the available difficulties of the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/difficulties<br><br>

- **Get All Plot System Countries of a Team:** <br>
Returns the countries of a build team that are available in the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/countries<br><br>

- **Get All Plot System Cities of a Team:** <br>
Returns the cities of a build team that are available in the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/cities<br><br>

- **Get All Plots of a Team:** <br>
Returns the plots of a build team that are available in the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/plots<br><br>

- **Get all reviews of a Team:** <br>
Returns all reviews of a build team that are available in the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/reviews<br><br>

- **Get all servers of a Team:** <br>
Returns all servers of a build team that are available in the global plot system.<br>
[GET] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/servers<br><br>

- **Create a Plot for a Team:** <br>
Saved the plot details for a new plot of a build team in the global plot system.<br>
[POST] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/plots<br><br>

- **Change a Plot of a Team:** <br>
Changes the plot details of a plot of a build team in the global plot system.<br>
[PUT] https://psapi.buildtheearth.net/api/plotsystem/teams/%API_KEY%/plots<br><br>

### Build Teams

- **Get Information about a Build Team:** <br>
Returns some information about a build team of BuildTheEarth.<br>
[GET] https://psapi.buildtheearth.net/api/teams/%API_KEY%<br><br>

## Installation

- Install [Node.js](https://nodejs.org/en/) version 18.12.1 or higher
- Clone the repository by clicking the green "Code" button on this page or by entering this command:
```bash
git clone <github clone url>
```
- Change the name from `_config.json5` to `config.json5` and enter the correct values for your server.
- Install the dependencies
```bash
cd network-api
npm install
```
- Build the system
```bash
npm run build
```
- Start the server
```bash
npm start
```
Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
