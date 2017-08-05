import * as Logger from 'bunyan';

let logger: Logger;

export function setLogger(_logger: Logger) {
    logger = _logger;
}

export function setupDefaultLogger() {
    logger = Logger.createLogger({ name: 'staircase'});
}

export function getLogger(module: string) {
    return logger.child({module});
}
