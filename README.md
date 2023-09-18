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

Plot System API Documentation: 
https://buildtheearth.github.io/network-api/


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
