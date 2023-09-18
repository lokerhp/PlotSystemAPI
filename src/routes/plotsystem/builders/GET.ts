import { Router } from "express";
import PlotSystem from "../../../struct/core/plotsystem.js";

export async function initRoutes(app: Router, joi: any, plotSystem: PlotSystem) {

    app.get('/api/plotsystem/builders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(plotSystem.getPSBuilders(), replacer));
    })

}

function replacer(key: string, value: any) {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
}