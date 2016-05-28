/* @flow */

import fsp from 'fs-promise';

export async function ensureDirExists(path : string) : Promise<void> {
    return await fsp.mkdir(path).catch((err : { code : string }) => {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    });
}
