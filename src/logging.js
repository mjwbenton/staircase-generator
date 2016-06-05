/* @flow */

import bunyan from 'bunyan';

let logger;

export function setLogger(_logger : any) {
    logger = _logger;
}

export function setupDefaultLogger() {
    logger = bunyan.createLogger({ name: 'new.mattbenton.co.uk'});
}

export function getLogger(module : string) {
    return logger.child({module});
}
