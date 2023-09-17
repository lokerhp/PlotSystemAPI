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
(GET) https://psapi.buildtheearth.net/api/builders<br><br>

- **Get Difficulties:** <br>
Returns the available difficulties of the global plot system.<br>
(GET) https://psapi.buildtheearth.net/api/difficulties<br><br>



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
