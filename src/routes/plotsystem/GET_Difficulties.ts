import { Router } from "express";
import PlotSystem from "../../struct/core/plotsystem.js";

export async function initRoutes(app: Router, joi: any, plotSystem: PlotSystem) {
    app.get('/api/plotsystem/difficulties', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(plotSystem.getPSDifficulties()))
    })
}