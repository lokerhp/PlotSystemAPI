import * as url from "url";

import { Database } from "./database.js";
import { loadSyncJSON5 } from "@buildtheearth/bot-utils";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default class Settings {
  public appName!: string;
  public version!: string;
  public port!: number;
  public debug!: boolean;

  public database!: Database;

  constructor(file?: string) {
    if (!file) file = path.join(__dirname, "../../config.json5");
    const data = loadSyncJSON5(file);

    for (const [key, value] of Object.entries(data))
      (this as Record<string, unknown>)[key] = value;
  }
}
