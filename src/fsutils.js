import fsp from 'fs-promise';

export function ensureDirExists(path : string) : Promise<void> {
    return fsp.mkdir(path).catch((err : { code : string }) => {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    });
}
