import { setLogger } from "./src/logging";
import * as bunyan from "bunyan";
setLogger(bunyan.createLogger({ name: 'staircase', level: 'error' }));
